import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Prisma, PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { getPrismaDatabaseUrl } from './database-url';

dotenv.config({ quiet: true });
dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const app = express();
const port = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production' || process.env.RENDER === 'true';

const GOKWIK_APP_ID = process.env.GOKWIK_APP_ID || '';
const GOKWIK_APP_SECRET = process.env.GOKWIK_APP_SECRET || '';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const SESSION_SECRET = process.env.SESSION_SECRET || (!isProduction ? 'totemood-dev-session-secret' : '');
// Supabase clients expect the project root, while older REST configuration
// commonly stores a `/rest/v1` suffix in this variable.
const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '');
// Accept the project's existing server-only Supabase key name while preferring
// the explicit service-role variable used by the category storage integration.
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const CATEGORY_IMAGE_BUCKET = process.env.CATEGORY_IMAGE_BUCKET || 'category-images';
const CHECKOUT_DEPOSIT_AMOUNT = 49;
const MAX_PRODUCT_REVIEW_COUNT = 1_000_000;

// Amount actually collected from Razorpay for this checkout.
// Prepaid: the full order. COD: the deposit only (rest is cash on delivery).
function payoutAmountFor(checkout: PendingCheckout): number {
  return checkout.paymentMethod === 'prepaid'
    ? checkout.total
    : Math.min(CHECKOUT_DEPOSIT_AMOUNT, checkout.total);
}
const developmentAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4010',
];
const configuredAllowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
if (isProduction && configuredAllowedOrigins.length === 0) {
  throw new Error('CORS_ORIGINS must list the deployed frontend origin in production.');
}
const allowedOrigins = new Set(
  configuredAllowedOrigins.concat(isProduction ? [] : developmentAllowedOrigins)
);
const JSON_BODY_LIMIT = process.env.JSON_BODY_LIMIT || '8mb';
const WEBHOOK_BODY_LIMIT_BYTES = 1024 * 1024;
const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-auth', 'gk-app-id', 'gk-app-secret', 'app-id', 'app-secret'],
};

// Middleware
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(cors(corsOptions));
// Capture the raw request body for the Razorpay webhook BEFORE express.json()
// parses and replaces it, so we can verify the HMAC signature over the exact
// bytes Razorpay sent.
app.use('/api/webhooks/razorpay', (req: Request, _res: Response, next: NextFunction) => {
  const chunks: Buffer[] = [];
  let total = 0;
  req.on('data', (chunk: Buffer) => {
    total += chunk.length;
    if (total <= WEBHOOK_BODY_LIMIT_BYTES) chunks.push(chunk);
  });
  req.on('end', () => {
    if (total > WEBHOOK_BODY_LIMIT_BYTES) {
      const error = new Error('Webhook payload is too large.') as Error & { status?: number };
      error.status = 413;
      next(error);
      return;
    }
    (req as any).rawWebhookBody = Buffer.concat(chunks, total);
    next();
  });
  req.on('error', next);
});
app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error && typeof error === 'object' && (('type' in error && error.type === 'entity.too.large') || ('status' in error && error.status === 413))) {
    return res.status(413).json({
      error: 'Uploaded image is too large. Please choose a smaller image and try again.',
    });
  }

  next(error);
});

if (isProduction && SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must be set to a strong random value in production.');
}

type RateLimitBucket = { count: number; resetAt: number };
const rateLimitBuckets = new Map<string, RateLimitBucket>();

function rateLimit(options: { windowMs: number; max: number; keyPrefix: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${options.keyPrefix}:${req.ip}`;
    const bucket = rateLimitBuckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      rateLimitBuckets.set(key, { count: 1, resetAt: now + options.windowMs });
      next();
      return;
    }

    bucket.count += 1;
    if (bucket.count > options.max) {
      res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
      return;
    }

    next();
  };
}

const rateLimitCleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of rateLimitBuckets) {
    if (now > bucket.resetAt) {
      rateLimitBuckets.delete(key);
    }
  }
}, 10 * 60 * 1000);

// Log GoKwik incoming requests for debugging
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.startsWith('/gokwik/')) {
    console.log(`[GoKwik] ${req.method} ${req.path}`, JSON.stringify(req.body).slice(0, 200));
  }
  next();
});

// Initialize clients
const prisma = new PrismaClient({
  datasources: { db: { url: getPrismaDatabaseUrl() } },
});
const ORDER_STATUSES = ['LIVE', 'MANIFESTED', 'SHIPPED', 'DD', 'DELIVER', 'RTO', 'CANCELLED', 'SHIP_LATER'] as const;
type OrderStatusValue = typeof ORDER_STATUSES[number];

const FALLBACK_PRODUCTS = [
  {
    id: 'ghibli-art-tote',
    name: 'CUSTOM GHIBLI ART TOTE BAG',
    description: 'Bag will have custom Ghibli image only. Add size and approval on WhatsApp after placing orders.',
    price: 499,
    oldPrice: 599,
    image: '/images/product/W1.png',
    gallery: ['/images/product/W1.png', '/images/product/W2.png', '/images/product/W3.png', '/images/product/W4.png', '/images/size.png'],
    isCustomizable: true,
    label: 'bestseller',
    category: 'image',
    inventoryCount: 50,
    reviews: 142,
  },
  {
    id: 'ghibli-text-tote',
    name: 'CUSTOM GHIBLI TOTE BAG WITH TEXT',
    description: 'Custom Ghibli image + custom text. Add size and approval on WhatsApp after placing orders.',
    price: 599,
    oldPrice: 749,
    image: '/images/product/W5.png',
    gallery: ['/images/product/W5.png', '/images/product/W6.png', '/images/product/W7.png', '/images/product/W8.png', '/images/size.png'],
    isCustomizable: true,
    label: 'bestseller',
    category: 'image+text',
    inventoryCount: 30,
    reviews: 215,
  },
  {
    id: 'emoji-ghibli-tote',
    name: 'CUTE EMOJI WITH GHIBLI TOTE',
    description: 'Emoji and text around Ghibli bags. Add size and approval on WhatsApp after placing orders.',
    price: 599,
    oldPrice: 719,
    image: '/images/product/W9.png',
    gallery: ['/images/product/W9.png', '/images/product/W10.png', '/images/product/W11.png', '/images/product/W12.png', '/images/size.png'],
    isCustomizable: true,
    label: 'bestseller',
    category: 'image+text',
    inventoryCount: 20,
    reviews: 89,
  },
  {
    id: 'polaroid-tote',
    name: 'POLAROID TOTE BAG',
    description: 'Old vintage type Polaroid design. Add size and approval on WhatsApp after placing orders.',
    price: 499,
    oldPrice: 599,
    image: '/images/product/W13.png',
    gallery: ['/images/product/W13.png', '/images/product/W14.png', '/images/product/W15.png', '/images/product/W16.png', '/images/size.png'],
    isCustomizable: true,
    label: 'new',
    category: 'image',
    inventoryCount: 100,
    reviews: 34,
  },
  {
    id: 'any-design-tote',
    name: 'ANY DESIGN TOTE BAG',
    description: 'Customer can customise any ready to print design. Add size and approval on WhatsApp after placing orders.',
    price: 499,
    oldPrice: 599,
    image: '/images/product/W17.png',
    gallery: ['/images/product/W17.png', '/images/product/W18.png', '/images/product/W19.png', '/images/product/W20.png', '/images/size.png'],
    isCustomizable: true,
    label: 'new',
    category: 'image',
    inventoryCount: 85,
    reviews: 76,
  },
];
function sanitizeProductForResponse<T extends { image: string; gallery?: string[] }>(product: T): T {
  // Legacy data URLs must continue to render while the separately reviewed
  // migration is pending. New admin uploads are replaced with storage URLs.
  return product;
}

const CATEGORY_NAME_MAX_LENGTH = 80;
const CATEGORY_IMAGE_MAX_BYTES = 2 * 1024 * 1024;
const CATEGORY_IMAGE_DATA_URL = /^data:image\/(jpeg|jpg|png|webp);base64,([a-z0-9+/=]+)$/i;

function slugifyCategoryName(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72);
}

async function getAvailableCategorySlug(name: string, excludeId?: string) {
  const base = slugifyCategoryName(name);
  if (!base) throw new Error('Category name must include letters or numbers.');
  const candidates = await prisma.category.findMany({
    where: excludeId ? { id: { not: excludeId }, slug: { startsWith: base } } : { slug: { startsWith: base } },
    select: { slug: true },
  });
  const used = new Set(candidates.map((category) => category.slug));
  if (!used.has(base)) return base;
  for (let suffix = 2; suffix < 10_000; suffix += 1) {
    const candidate = `${base}-${suffix}`;
    if (!used.has(candidate)) return candidate;
  }
  throw new Error('Could not create a unique category URL.');
}

function normalizeCategoryName(value: unknown) {
  const name = String(value || '').trim().replace(/\s+/g, ' ');
  if (!name) throw new Error('Category name is required.');
  if (name.length > CATEGORY_NAME_MAX_LENGTH) throw new Error(`Category name must be ${CATEGORY_NAME_MAX_LENGTH} characters or fewer.`);
  return name;
}

function decodeCategoryImage(value: unknown) {
  const match = String(value || '').match(CATEGORY_IMAGE_DATA_URL);
  if (!match) throw new Error('Choose a JPEG, PNG, or WebP image.');
  const imageFormat = match[1];
  const encodedImage = match[2];
  if (!imageFormat || !encodedImage) throw new Error('Choose a JPEG, PNG, or WebP image.');
  const mimeType = imageFormat.toLowerCase() === 'jpg' ? 'image/jpeg' : `image/${imageFormat.toLowerCase()}`;
  const bytes = Buffer.from(encodedImage, 'base64');
  if (!bytes.length || bytes.length > CATEGORY_IMAGE_MAX_BYTES) {
    throw new Error('Category images must be smaller than 2 MB.');
  }
  const isJpeg = bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const isPng = bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp = bytes.length > 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP';
  if ((mimeType === 'image/jpeg' && !isJpeg) || (mimeType === 'image/png' && !isPng) || (mimeType === 'image/webp' && !isWebp)) {
    throw new Error('The selected file did not contain a valid image.');
  }
  return { bytes, mimeType, extension: mimeType === 'image/jpeg' ? 'jpg' : mimeType.split('/')[1] };
}

async function uploadCategoryImage(value: unknown) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error('Category image storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    (error as Error & { status?: number }).status = 503;
    throw error;
  }
  const image = decodeCategoryImage(value);
  const storage = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const objectName = `categories/${crypto.randomUUID()}.${image.extension}`;
  const { error: uploadError } = await storage.storage.from(CATEGORY_IMAGE_BUCKET).upload(objectName, image.bytes, {
    contentType: image.mimeType,
    upsert: false,
    // A category cover can be replaced or deleted at any time. Immutable
    // object names make long-lived caching safe for normal rendering, but a
    // public URL may be checked immediately after deletion, so do not ask the
    // storage CDN to retain a stale copy.
    cacheControl: '0',
  });
  if (uploadError) throw new Error(`Could not upload category image: ${uploadError.message}`);
  const { data } = storage.storage.from(CATEGORY_IMAGE_BUCKET).getPublicUrl(objectName);
  if (!data.publicUrl) throw new Error('Category image storage did not return a public URL.');
  return data.publicUrl;
}

function categoryImageObjectName(publicUrl: string) {
  try {
    const url = new URL(publicUrl);
    const prefix = `/storage/v1/object/public/${CATEGORY_IMAGE_BUCKET}/`;
    return url.pathname.startsWith(prefix) ? decodeURIComponent(url.pathname.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

async function removeCategoryImage(publicUrl: string) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;
  const objectName = categoryImageObjectName(publicUrl);
  if (!objectName) return;
  const storage = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { error } = await storage.storage.from(CATEGORY_IMAGE_BUCKET).remove([objectName]);
  if (error) throw new Error(`Could not remove category image: ${error.message}`);
}

function categorySummary(category: { id: string; name: string; slug: string; coverImage: string; createdAt: Date; updatedAt: Date; _count?: { productLinks: number } }) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    coverImage: category.coverImage,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    productCount: category._count?.productLinks ?? 0,
  };
}

async function validatedCategoryIds(value: unknown) {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || value.some((id) => typeof id !== 'string' || !id.trim())) {
    throw new Error('Categories must be a list of category IDs.');
  }
  const ids = [...new Set(value.map((id) => id.trim()))];
  if (ids.length !== value.length) throw new Error('A category can only be selected once.');
  const found = await prisma.category.findMany({ where: { id: { in: ids } }, select: { id: true } });
  if (found.length !== ids.length) throw new Error('One or more selected categories no longer exist.');
  return ids;
}

function productWithCategories<T extends { image: string; gallery?: string[]; categoryLinks?: Array<{ category: { id: string; name: string; slug: string; coverImage: string } }> }>(product: T) {
  const sanitized = sanitizeProductForResponse(product);
  const categories = product.categoryLinks?.map((link) => link.category) || [];
  return { ...sanitized, categories, categoryIds: categories.map((category) => category.id) };
}

function productWithCategoriesAndReviews<T extends { image: string; gallery?: string[]; reviews?: number; categoryLinks?: Array<{ category: { id: string; name: string; slug: string; coverImage: string } }> }>(product: T) {
  const reviews = Number(product.reviews);
  return { ...productWithCategories(product), reviews: Number.isInteger(reviews) && reviews >= 0 ? reviews : 0 };
}

const MAX_DISPLAY_ID = 999999;

async function getNextOrderId(): Promise<string> {
  const last = await prisma.order.findFirst({
    where: { displayId: { not: '' } },
    orderBy: { displayId: 'desc' },
    select: { displayId: true },
  });

  let next = 1;
  if (last?.displayId) {
    const num = parseInt(last.displayId, 10);
    if (!isNaN(num)) {
      next = num >= MAX_DISPLAY_ID ? 1 : num + 1;
    }
  }

  const candidate = String(next).padStart(6, '0');
  const exists = await prisma.order.findFirst({ where: { displayId: candidate }, select: { id: true } });
  if (exists) {
    // Rare collision: try the next one
    const fallback = next >= MAX_DISPLAY_ID ? 1 : next + 1;
    return String(fallback).padStart(6, '0');
  }
  return candidate;
}

function normalizeOrderStatus(status: unknown): OrderStatusValue | null {
  const normalized = String(status || '').trim().toUpperCase().replace(/[\s-]+/g, '_');
  return (ORDER_STATUSES as readonly string[]).includes(normalized) ? normalized as OrderStatusValue : null;
}

// Setup Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions
});

io.on("connection", (socket) => {
  console.log("Client connected via WebSocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- In-Memory Cart Session Store ---
// GoKwik calls our backend with a session_key to fetch cart data.
// The frontend creates a session and populates it before calling GoKwik SDK.
interface CartSessionData {
  items: any[];
  totals: {
    subtotal: number;
    shipping_total: number;
    total: number;
  };
  customer: Record<string, any>;
  createdAt: number;
}

const cartSessions = new Map<string, CartSessionData>();

interface PendingCheckout {
  customerEmail: string;
  customerPhone: string;
  customerFirstName: string;
  customerLastName: string;
  addressNickname: string;
  customerAddress: string;
  saveAddress: boolean;
  accountEmail: string | null;
  customerCity: string;
  customerState: string;
  customerZip: string;
  subtotal: number;
  shipping: number;
  total: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    customImageUrl: string | null;
    customText: string | null;
  }>;
  paymentMethod: 'cod' | 'prepaid';
  createdAt: number;
}

interface AccountAddressInput {
  email: string;
  nickname: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  isDefault?: boolean;
}

interface AuthUser {
  email: string;
  name: string;
  picture: string | undefined;
}

const pendingCheckouts = new Map<string, PendingCheckout>();
const MAX_CART_ITEMS = 20;
const MAX_ITEM_QUANTITY = 10;
const MAX_CUSTOM_TEXT_LENGTH = 200;
const MAX_CHECKOUT_IMAGE_LENGTH = 250_000;
const SAFE_DATA_IMAGE_PATTERN = /^data:image\/(?:jpeg|jpg|png|webp);base64,[a-z0-9+/=]+$/i;
const CHECKOUT_TTL_MS = 30 * 60 * 1000;

function isPendingCheckout(value: Prisma.JsonValue): value is Prisma.JsonObject {
  return typeof value === 'object'
    && value !== null
    && !Array.isArray(value)
    && typeof value.createdAt === 'number'
    && typeof value.total === 'number'
    && Array.isArray(value.items)
    && (value.paymentMethod === 'cod' || value.paymentMethod === 'prepaid');
}

// --- Persistent checkouts ---
// The in-memory map above is a fast-path cache only. The authoritative copy
// lives in the "PendingCheckout" table so a paid checkout survives a Render
// restart, instance change, or horizontal scale-out.
async function savePendingCheckout(id: string, checkout: PendingCheckout, ttlMs = CHECKOUT_TTL_MS) {
  pendingCheckouts.set(id, checkout);
  try {
    await prisma.pendingCheckout.upsert({
      where: { id },
      create: {
        id,
        data: checkout as unknown as Prisma.InputJsonValue,
        createdAt: new Date(checkout.createdAt),
        expiresAt: new Date(Date.now() + ttlMs),
      },
      update: {
        data: checkout as unknown as Prisma.InputJsonValue,
        expiresAt: new Date(Date.now() + ttlMs),
      },
    });
  } catch (error) {
    console.error('Failed to persist pending checkout:', error);
  }
}

async function getPendingCheckout(id: string): Promise<PendingCheckout | null> {
  const cached = pendingCheckouts.get(id);
  if (cached) return cached;
  try {
    const stored = await prisma.pendingCheckout.findFirst({
      where: { id, expiresAt: { gt: new Date() } },
      select: { data: true },
    });
    if (!stored || !isPendingCheckout(stored.data)) return null;
    const checkout = stored.data as unknown as PendingCheckout;
    pendingCheckouts.set(id, checkout);
    return checkout;
  } catch (error) {
    console.error('Failed to load pending checkout:', error);
    return null;
  }
}

async function deletePendingCheckout(id: string) {
  pendingCheckouts.delete(id);
  try {
    await prisma.pendingCheckout.deleteMany({ where: { id } });
  } catch (error) {
    console.error('Failed to delete pending checkout:', error);
  }
}

async function findStalePendingCheckouts(): Promise<Array<{ id: string; data: PendingCheckout }>> {
  try {
    const rows = await prisma.pendingCheckout.findMany({
      where: { expiresAt: { gt: new Date() }, processedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 20,
      select: { id: true, data: true },
    });
    return rows
      .filter((row) => isPendingCheckout(row.data))
      .map((row) => ({ id: row.id, data: row.data as unknown as PendingCheckout }));
  } catch (error) {
    console.error('Failed to find stale pending checkouts:', error);
    return [];
  }
}

// Cleanup stale sessions every 30 minutes
const checkoutCleanupInterval = setInterval(() => {
  const now = Date.now();
  const THIRTY_MIN = 30 * 60 * 1000;
  for (const [key, session] of cartSessions) {
    if (now - session.createdAt > THIRTY_MIN) {
      cartSessions.delete(key);
    }
  }
  for (const [key, checkout] of pendingCheckouts) {
    if (now - checkout.createdAt > THIRTY_MIN) {
      pendingCheckouts.delete(key);
    }
  }
  prisma.pendingCheckout.deleteMany({ where: { expiresAt: { lte: new Date() } } }).catch((error) => {
    console.error('Failed to purge expired pending checkouts:', error);
  });
}, 30 * 60 * 1000);

function normalizePhone(phone: unknown) {
  return String(phone || '').replace(/\D/g, '');
}

function normalizeEmail(email: unknown) {
  return String(email || '').trim().toLowerCase();
}

function base64Url(input: string | Buffer) {
  return Buffer.from(input).toString('base64url');
}

function signSession(user: AuthUser) {
  const payload = base64Url(JSON.stringify({
    email: normalizeEmail(user.email),
    name: user.name,
    picture: user.picture || '',
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000,
  }));
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifySessionToken(token: unknown): AuthUser | null {
  const rawToken = String(token || '');
  const [payload, signature] = rawToken.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (signature.length !== expectedSignature.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data.email || !data.exp || Date.now() > data.exp) return null;
    return {
      email: normalizeEmail(data.email),
      name: String(data.name || ''),
      picture: data.picture ? String(data.picture) : undefined,
    };
  } catch {
    return null;
  }
}

function getAuthUser(req: Request): AuthUser | null {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return verifySessionToken(token);
}

function requireAuthUser(req: Request, res: Response): AuthUser | null {
  const user = getAuthUser(req);
  if (!user) {
    res.status(401).json({ error: 'Please sign in with Google first.' });
    return null;
  }
  return user;
}

// --- Admin auth (scrypt-hashed password + signed admin token) ---

const ADMIN_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function verifyAdminPassword(password: unknown): boolean {
  const stored = String(process.env.ADMIN_PASSWORD_HASH || '');
  const [scheme, saltHex, keyHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;
  try {
    const derived = crypto.scryptSync(String(password || ''), Buffer.from(saltHex, 'hex'), 64);
    const expected = Buffer.from(keyHex, 'hex');
    return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function signAdminToken() {
  const payload = base64Url(JSON.stringify({ role: 'admin', exp: Date.now() + ADMIN_TOKEN_TTL_MS }));
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAdminToken(token: unknown): boolean {
  const rawToken = String(token || '');
  const [payload, signature] = rawToken.split('.');
  if (!payload || !signature) return false;
  const expectedSignature = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('base64url');
  if (signature.length !== expectedSignature.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.role === 'admin' && !!data.exp && Date.now() <= data.exp;
  } catch {
    return false;
  }
}

function getAdminToken(req: Request): string {
  const header = req.headers['x-admin-auth'];
  if (typeof header === 'string' && header) return header;
  const auth = req.headers.authorization || '';
  return auth.startsWith('Admin ') ? auth.slice(6) : '';
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!process.env.ADMIN_PASSWORD_HASH) {
    res.status(503).json({ error: 'Admin access is not configured.' });
    return;
  }
  if (!verifyAdminToken(getAdminToken(req))) {
    res.status(401).json({ error: 'Admin authentication required.' });
    return;
  }
  next();
}

async function verifyGoogleCredential(credential: unknown): Promise<AuthUser> {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google login is not configured on the server.');
  }

  const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(String(credential || ''))}`);
  const tokenInfo = await tokenInfoRes.json();
  if (!tokenInfoRes.ok || tokenInfo.aud !== GOOGLE_CLIENT_ID || !tokenInfo.email) {
    throw new Error('Google sign-in could not be verified.');
  }

  return {
    email: normalizeEmail(tokenInfo.email),
    name: String(tokenInfo.name || tokenInfo.email || ''),
    picture: tokenInfo.picture ? String(tokenInfo.picture) : undefined,
  };
}

function hasCheckoutImage(value: unknown) {
  const image = String(value || '').trim();
  return SAFE_DATA_IMAGE_PATTERN.test(image) && image.length <= MAX_CHECKOUT_IMAGE_LENGTH;
}

function hasAllCheckoutImages(item: any, quantity: number) {
  if (Array.isArray(item.customImageUrls)) {
    return item.customImageUrls.length >= quantity
      && item.customImageUrls.slice(0, quantity).every(hasCheckoutImage);
  }

  return quantity === 1 && hasCheckoutImage(item.customImageUrl);
}

function hasCheckoutText(value: unknown) {
  return String(value || '').trim().length > 0;
}

function hasAllCheckoutTexts(item: any, quantity: number) {
  if (Array.isArray(item.customTexts)) {
    return item.customTexts.length >= quantity
      && item.customTexts.slice(0, quantity).every(hasCheckoutText);
  }

  return quantity === 1 && hasCheckoutText(item.customText);
}

function firstCheckoutText(item: any) {
  if (Array.isArray(item.customTexts)) {
    return String(item.customTexts.find(hasCheckoutText) || '').trim();
  }

  return String(item.customText || '').trim();
}

function firstCheckoutImage(item: any) {
  if (Array.isArray(item.customImageUrls)) {
    return String(item.customImageUrls.find(hasCheckoutImage) || '').trim();
  }

  return String(item.customImageUrl || '').trim();
}

function hasDuplicateValues(values: string[]) {
  return new Set(values).size !== values.length;
}

function routeParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] || '' : value || '';
}

function validateCustomer(data: any) {
  const errors: Record<string, string> = {};
  const customer = {
    customerEmail: String(data.customerEmail || '').trim(),
    customerPhone: normalizePhone(data.customerPhone),
    customerFirstName: String(data.customerFirstName || '').trim(),
    customerLastName: String(data.customerLastName || '').trim(),
    addressNickname: String(data.addressNickname || data.nickname || 'Custom Address').trim() || 'Custom Address',
    customerAddress: String(data.customerAddress || '').trim(),
    saveAddress: Boolean(data.saveAddress),
    customerCity: String(data.customerCity || '').trim(),
    customerState: String(data.customerState || '').trim(),
    customerZip: String(data.customerZip || '').trim(),
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.customerEmail)) {
    errors.customerEmail = 'Enter a valid email address.';
  }
  if (!/^[6-9]\d{9}$/.test(customer.customerPhone)) {
    errors.customerPhone = 'Enter a valid 10 digit WhatsApp number.';
  }
  if (customer.customerFirstName.length < 2) errors.customerFirstName = 'First name is required.';
  if (customer.customerLastName.length < 1) errors.customerLastName = 'Last name is required.';
  if (customer.customerAddress.length < 8) errors.customerAddress = 'Enter a complete delivery address.';
  if (customer.customerCity.length < 2) errors.customerCity = 'City is required.';
  if (customer.customerState.length < 2) errors.customerState = 'State is required.';
  if (!/^\d{6}$/.test(customer.customerZip)) errors.customerZip = 'Enter a valid 6 digit PIN code.';

  return { customer, errors };
}

function validateAccountAddress(data: any): { address: AccountAddressInput; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const address = {
    email: normalizeEmail(data.email || data.customerEmail),
    nickname: String(data.nickname || 'Custom Address').trim() || 'Custom Address',
    firstName: String(data.firstName || data.customerFirstName || '').trim(),
    lastName: String(data.lastName || data.customerLastName || '').trim(),
    phone: normalizePhone(data.phone || data.customerPhone),
    address: String(data.address || data.customerAddress || '').trim(),
    city: String(data.city || data.customerCity || '').trim(),
    state: String(data.state || data.customerState || '').trim(),
    zip: String(data.zip || data.customerZip || '').trim(),
    isDefault: Boolean(data.isDefault),
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address.email)) errors.email = 'Enter a valid email address.';
  if (address.nickname.length < 1) errors.nickname = 'Label is required.';
  if (address.firstName.length < 2) errors.firstName = 'First name is required.';
  if (address.lastName.length < 1) errors.lastName = 'Last name is required.';
  if (!/^[6-9]\d{9}$/.test(address.phone)) errors.phone = 'Enter a valid 10 digit WhatsApp number.';
  if (address.address.length < 8) errors.address = 'Enter a complete delivery address.';
  if (address.city.length < 2) errors.city = 'City is required.';
  if (address.state.length < 2) errors.state = 'State is required.';
  if (!/^\d{6}$/.test(address.zip)) errors.zip = 'Enter a valid 6 digit PIN code.';

  return { address, errors };
}

function normalizeProductLabel(value: unknown) {
  const label = String(value || '').trim().toLowerCase();
  return ['bestseller', 'new', 'premium'].includes(label) ? label : 'new';
}

function normalizeProductCategory(value: unknown) {
  const category = String(value || '').trim().toLowerCase().replace(/\s*\+\s*/g, '+');
  return ['image', 'text', 'image+text', 'no customization'].includes(category) ? category : 'image';
}

function normalizeProductReviewCount(value: unknown) {
  const reviews = Number(value ?? 0);
  if (!Number.isInteger(reviews) || reviews < 0 || reviews > MAX_PRODUCT_REVIEW_COUNT) {
    throw new Error(`Review count must be a whole number between 0 and ${MAX_PRODUCT_REVIEW_COUNT.toLocaleString()}.`);
  }
  return reviews;
}

function normalizeProductGallery(value: unknown, coverImage: string) {
  const seen = new Set<string>();
  const addImage = (next: unknown, gallery: string[]) => {
    const image = String(next || '').trim();
    if (!image || seen.has(image)) return;
    if (gallery.length >= 8) throw new Error('A product can have at most 8 gallery images.');
    seen.add(image);
    gallery.push(image);
  };

  const gallery: string[] = [];
  addImage(coverImage, gallery);
  if (Array.isArray(value)) {
    value.forEach((item) => addImage(item, gallery));
  }
  return gallery;
}

type PreparedProductImages = {
  image: string;
  gallery: string[];
};

function imageReference(value: unknown) {
  const image = String(value || '').trim();
  if (!image) throw new Error('A product cover image is required.');
  if (image.length > 7 * 1024 * 1024) throw new Error('The product image reference is too large.');
  if (image.startsWith('data:') && !SAFE_DATA_IMAGE_PATTERN.test(image)) {
    throw new Error('Product images must be JPEG, PNG, or WebP.');
  }
  return image;
}

function prepareProductImages(imageValue: unknown, galleryValue: unknown): PreparedProductImages {
  const requestedCover = imageReference(imageValue);
  const requestedGallery = normalizeProductGallery(galleryValue, requestedCover).map(imageReference);
  // Product-image object migration is intentionally postponed. Preserve the
  // existing data URL or URL exactly as supplied; no storage write is part of
  // the release path.
  return { image: requestedCover, gallery: requestedGallery };
}

async function saveAccountAddress(data: any) {
  const { address, errors } = validateAccountAddress(data);
  if (Object.keys(errors).length > 0) {
    const error = new Error('Address validation failed') as Error & { details?: Record<string, string> };
    error.details = errors;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    if (address.isDefault) {
      await tx.savedAddress.updateMany({
        where: { email: address.email },
        data: { isDefault: false },
      });
    }

    const existingCount = await tx.savedAddress.count({ where: { email: address.email } });
    return tx.savedAddress.create({
      data: {
        ...address,
        isDefault: address.isDefault || existingCount === 0,
      },
    });
  });
}

function validateAdminProductInput(data: Record<string, unknown>) {
  const name = String(data.name || '').trim();
  const description = String(data.description || '').trim();
  const price = Number(data.price);
  const oldPrice = data.oldPrice === undefined || data.oldPrice === null || data.oldPrice === '' ? null : Number(data.oldPrice);
  const inventoryCount = Number(data.inventoryCount ?? 0);

  if (name.length < 2 || name.length > 160) throw new Error('Product name must be between 2 and 160 characters.');
  if (description.length > 4_000) throw new Error('Product description must be at most 4,000 characters.');
  if (!Number.isFinite(price) || price < 0 || price > 1_000_000) throw new Error('Product price must be between 0 and 1,000,000.');
  if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice < price || oldPrice > 1_000_000)) {
    throw new Error('Original price must be a valid amount no less than the current price.');
  }
  if (!Number.isInteger(inventoryCount) || inventoryCount < 0 || inventoryCount > 1_000_000) {
    throw new Error('Inventory count must be a whole number between 0 and 1,000,000.');
  }

  return { name, description, price, oldPrice, inventoryCount };
}

async function buildVerifiedCheckout(data: any): Promise<PendingCheckout> {
  const { customer, errors } = validateCustomer(data);
  const incomingItems = Array.isArray(data.items) ? data.items : [];
  const accountUser = verifySessionToken(data.accountToken);

  if (incomingItems.length === 0) {
    errors.items = 'Your cart is empty.';
  }
  if (customer.saveAddress && !accountUser) {
    errors.saveAddress = 'Please sign in with Google to save this address.';
  }
  if (accountUser && normalizeEmail(customer.customerEmail) !== accountUser.email) {
    errors.customerEmail = 'Use your Google account email for checkout.';
  }

  const productIds = incomingItems.map((item: any) => String(item.productId || item.id || ''));
  if (incomingItems.length > MAX_CART_ITEMS) {
    errors.items = `Your cart can include up to ${MAX_CART_ITEMS} item lines.`;
  }
  if (hasDuplicateValues(productIds)) {
    errors.items = 'Please combine duplicate products into a single cart line.';
  }

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map((product) => [product.id, product]));

  const verifiedItems = incomingItems.map((item: any) => {
    const productId = String(item.productId || item.id || '');
    const product = productMap.get(productId);
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
    const customText = firstCheckoutText(item);
    const customImageUrl = firstCheckoutImage(item);

    if (!product) {
      errors.items = 'One or more products are no longer available.';
      return null;
    }
    if (quantity > MAX_ITEM_QUANTITY) {
      errors.items = `You can order up to ${MAX_ITEM_QUANTITY} pieces of a product at a time.`;
      return null;
    }
    if (product.inventoryCount < quantity) {
      errors.items = `${product.name} has only ${product.inventoryCount} left in stock.`;
      return null;
    }
    const category = normalizeProductCategory(product.category);
    const requiresImage = category === 'image' || category === 'image+text';
    const requiresText = category === 'text' || category === 'image+text';

    if (requiresImage && !hasAllCheckoutImages(item, quantity)) {
      errors.items = 'Please upload artwork for every custom tote before placing your order.';
      return null;
    }
    if (requiresText && !hasAllCheckoutTexts(item, quantity)) {
      errors.items = 'Please add custom text for every image + text tote before placing your order.';
      return null;
    }
    if (customText.length > MAX_CUSTOM_TEXT_LENGTH) {
      errors.items = `Custom text can be up to ${MAX_CUSTOM_TEXT_LENGTH} characters.`;
      return null;
    }

    return {
      productId,
      quantity,
      price: product.price,
      customImageUrl,
      customText: customText || null,
    };
  }).filter(Boolean) as PendingCheckout['items'];

  if (Object.keys(errors).length > 0) {
    const error = new Error('Checkout validation failed') as Error & { details?: Record<string, string> };
    error.details = errors;
    throw error;
  }

  const subtotal = verifiedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 150 ? 0 : 15;

  return {
    ...customer,
    accountEmail: accountUser?.email || null,
    subtotal,
    shipping,
    total: subtotal + shipping,
    items: verifiedItems,
    paymentMethod: data.paymentMethod === 'prepaid' ? 'prepaid' : 'cod',
    createdAt: Date.now(),
  };
}

interface CreateOrderOptions {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  gokwikOrderId?: string;
  paidAmount?: number;
  codBalance?: number;
  paymentStatus?: string;
}

async function createOrderFromCheckout(checkout: PendingCheckout, options: CreateOrderOptions = {}) {

  const {
    razorpayOrderId,
    razorpayPaymentId,
    gokwikOrderId,
    paidAmount = 0,
    codBalance = 0,
    paymentStatus = 'pending',
  } = options;

  const orderInclude = {
    items: {
      include: { product: true },
    },
  };

  const findExisting = async () => {
    if (razorpayOrderId) {
      const order = await prisma.order.findFirst({ where: { razorpayOrderId }, include: orderInclude });
      if (order) return order;
    }
    if (razorpayPaymentId) {
      const order = await prisma.order.findFirst({ where: { razorpayPaymentId }, include: orderInclude });
      if (order) return order;
    }
    if (gokwikOrderId) {
      const order = await prisma.order.findFirst({ where: { gokwikOrderId }, include: orderInclude });
      if (order) return order;
    }
    return null;
  };

  // Idempotency race guard: if a concurrent request (webhook + browser, or a
  // double-submit) already created this order, return it untouched. A pending
  // order that was created during an earlier verification which couldn't
  // confirm capture is upgraded in place now that we have confirmation — never
  // double-charging inventory.
  const existing = await findExisting();
  if (existing) {
    if ((options.paymentStatus === 'paid' || options.paymentStatus === 'partial') && existing.paymentStatus === 'pending') {
      try {
        const upgraded = await prisma.order.update({
          where: { id: existing.id },
          data: {
            razorpayPaymentId: razorpayPaymentId || existing.razorpayPaymentId,
            paidAmount: paidAmount > 0 ? paidAmount : existing.paidAmount,
            codBalance,
            paymentStatus: options.paymentStatus,
          },
        });
        const loaded = await prisma.order.findUnique({ where: { id: upgraded.id }, include: orderInclude });
        return loaded || existing;
      } catch (upgradeError: any) {
        if (upgradeError?.code === 'P2002') {
          const winner = await findExisting();
          if (winner) return winner;
        }
        throw upgradeError;
      }
    }
    return existing;
  }

  let created;
  try {
    created = await prisma.$transaction(async (tx) => {
      for (const item of checkout.items) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            inventoryCount: { gte: item.quantity },
          },
          data: { inventoryCount: { decrement: item.quantity } },
        });

        if (updated.count !== 1) {
          throw new Error('A product in this order is no longer available in the requested quantity.');
        }
      }

      const displayId = await getNextOrderId();

      return tx.order.create({
        data: {
          displayId,
          gokwikOrderId: gokwikOrderId || null,
          razorpayOrderId: razorpayOrderId || null,
          razorpayPaymentId: razorpayPaymentId || null,
          paidAmount,
          codBalance,
          paymentStatus,
          customerEmail: checkout.customerEmail,
          customerPhone: checkout.customerPhone,
          customerFirstName: checkout.customerFirstName,
          customerLastName: checkout.customerLastName,
          addressNickname: checkout.addressNickname,
          customerAddress: checkout.customerAddress,
          customerCity: checkout.customerCity,
          customerState: checkout.customerState,
          customerZip: checkout.customerZip,
          subtotal: checkout.subtotal,
          shipping: checkout.shipping,
          total: checkout.total,
          status: 'LIVE',
          items: {
            create: checkout.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.price,
              customImageUrl: item.customImageUrl,
              customText: item.customText,
            })),
          },
        },
      });
    }, {
      maxWait: 10_000,
      timeout: 20_000,
    });
  } catch (error: any) {
    // Unique-constraint violation on razorpayOrderId/razorpayPaymentId/
    // gokwikOrderId means another request won the race and already created
    // this order. Return it instead of creating a duplicate.
    if (error?.code === 'P2002') {
      const winner = await findExisting();
      if (winner) return winner;
    }
    throw error;
  }

  const order = await prisma.order.findUnique({
    where: { id: created.id },
    include: orderInclude,
  });

  if (!order) {
    throw new Error('Order was created but could not be loaded.');
  }

  io.emit("new_order", order);
  io.emit("products_updated");
  return order;
}

async function verifyPaymentIsCaptured(razorpayOrderId: string, razorpayPaymentId: string): Promise<{ captured: boolean; amountPaise: number; error?: string }> {
  try {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const res = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpayPaymentId)}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) {
      return { captured: false, amountPaise: 0, error: `Razorpay payment lookup failed (${res.status}).` };
    }
    const payment = await res.json();
    const errorMessage = payment.status === 'captured' ? undefined : `Payment status is '${payment.status}', expected 'captured'.`;
    return {
      captured: payment.status === 'captured',
      amountPaise: Number(payment.amount) || 0,
      ...(errorMessage ? { error: errorMessage } : {}),
    };
  } catch (error: any) {
    return { captured: false, amountPaise: 0, error: `Could not confirm payment capture: ${error.message}` };
  }
}

// Deletes an order that was never actually paid (payment failed / abandoned)
// and restores the inventory units it had reserved at creation time.
async function deleteOrderAndRestoreInventory(orderId: string) {
  try {
    await prisma.$transaction(async (tx) => {
      // Delete first inside this transaction. A concurrent cleanup that loses
      // the delete race gets P2025 and cannot restore inventory a second time.
      const order = await tx.order.delete({
        where: { id: orderId },
        include: { items: true },
      });
      for (const item of order.items) {
        await tx.product.updateMany({
          where: { id: item.productId },
          data: { inventoryCount: { increment: item.quantity } },
        });
      }
    });
  } catch (error: any) {
    if (error?.code !== 'P2025') throw error; // already gone is fine
  }
}

// --- GoKwik Auth Middleware ---
// GoKwik sends gk-app-id and gk-app-secret headers on all cart/order API calls.
function gokwikAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const appId = req.headers['gk-app-id'] || req.headers['app-id'];
  const appSecret = req.headers['gk-app-secret'] || req.headers['app-secret'];

  if (!appId || !appSecret) {
    return res.status(401).json({ message: 'Missing GoKwik authentication headers' });
  }

  if (appId !== GOKWIK_APP_ID || appSecret !== GOKWIK_APP_SECRET) {
    return res.status(403).json({ message: 'Invalid GoKwik credentials' });
  }

  next();
}

// --- Routes ---

// Health Check
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw(Prisma.sql`SELECT 1`);
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check database query failed:', error);
    res.status(503).json({ status: 'unavailable', database: 'unavailable' });
  }
});

app.post('/api/auth/google', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, keyPrefix: 'auth-google' }), async (req, res) => {
  try {
    const user = await verifyGoogleCredential(req.body.credential);
    const [firstName = '', ...lastNameParts] = user.name.split(' ');
    res.json({
      token: signSession(user),
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
        firstName,
        lastName: lastNameParts.join(' '),
        phone: '',
      },
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Google sign-in failed.' });
  }
});

app.get('/api/account/me', (req, res) => {
  const user = requireAuthUser(req, res);
  if (!user) return;
  res.json({ user });
});

app.get('/api/account/orders', async (req, res) => {
  try {
    const user = requireAuthUser(req, res);
    if (!user) return;

    const orders = await prisma.order.findMany({
      where: {
        customerEmail: {
          equals: user.email,
          mode: 'insensitive' as const,
        },
      },
      select: {
        id: true, displayId: true, paymentStatus: true, paidAmount: true, codBalance: true,
        subtotal: true, shipping: true, total: true, status: true, createdAt: true,
        items: {
          select: {
            id: true, productId: true, quantity: true, priceAtPurchase: true, customText: true,
            product: { select: { id: true, name: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Historical product images can be legacy Base64 values. Do not send those
    // large payloads with account history; the card still shows a thumbnail
    // when the catalog uses a path or hosted URL.
    res.json(orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: item.product && {
          ...item.product,
          image: item.product.image.startsWith('data:') ? null : item.product.image,
        },
      })),
    })));
  } catch (error) {
    console.error('Failed to fetch account orders:', error);
    res.status(500).json({ error: 'Failed to fetch account orders.' });
  }
});

// Permanently (hard) deletes every piece of data tied to the signed-in user:
// all orders (cascading their items), and all saved addresses.
app.delete('/api/account/data', async (req, res) => {
  try {
    const user = requireAuthUser(req, res);
    if (!user) return;

    const emailFilter = { equals: user.email, mode: 'insensitive' as const };

    const orders = await prisma.order.deleteMany({ where: { customerEmail: emailFilter } });
    const addresses = await prisma.savedAddress.deleteMany({ where: { email: emailFilter } });

    res.json({
      message: 'All your data has been permanently deleted.',
      deletedOrders: orders.count,
      deletedAddresses: addresses.count,
    });
  } catch (error) {
    console.error('Failed to delete account data:', error);
    res.status(500).json({ error: 'Failed to delete your data. Please try again.' });
  }
});

app.get('/api/account/addresses', async (req, res) => {
  try {
    const user = requireAuthUser(req, res);
    if (!user) return;

    const addresses = await prisma.savedAddress.findMany({
      where: { email: user.email },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });
    res.json(addresses);
  } catch (error) {
    console.error('Failed to fetch saved addresses:', error);
    res.status(500).json({ error: 'Failed to fetch saved addresses.' });
  }
});

app.post('/api/account/addresses', async (req, res) => {
  try {
    const user = requireAuthUser(req, res);
    if (!user) return;

    const address = await saveAccountAddress({ ...req.body, email: user.email });
    res.status(201).json(address);
  } catch (error: any) {
    if (error.details) {
      return res.status(400).json({ error: 'Please correct the highlighted details.', details: error.details });
    }
    console.error('Failed to save address:', error);
    res.status(500).json({ error: 'Failed to save address.' });
  }
});

app.put('/api/account/addresses/:id', async (req, res) => {
  try {
    const user = requireAuthUser(req, res);
    if (!user) return;
    const addressId = routeParam(req.params.id);

    const { address, errors } = validateAccountAddress({ ...req.body, email: user.email });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Please correct the highlighted details.', details: errors });
    }

    const existing = await prisma.savedAddress.findUnique({ where: { id: addressId } });
    if (!existing || existing.email !== user.email) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (address.isDefault) {
        await tx.savedAddress.updateMany({
          where: { email: address.email, id: { not: addressId } },
          data: { isDefault: false },
        });
      }

      return tx.savedAddress.update({
        where: { id: addressId },
        data: address,
      });
    });

    res.json(updated);
  } catch (error) {
    console.error('Failed to update address:', error);
    res.status(500).json({ error: 'Failed to update address.' });
  }
});

app.delete('/api/account/addresses/:id', async (req, res) => {
  try {
    const user = requireAuthUser(req, res);
    if (!user) return;
    const addressId = routeParam(req.params.id);

    const existing = await prisma.savedAddress.findUnique({ where: { id: addressId } });
    if (!existing || existing.email !== user.email) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    await prisma.savedAddress.delete({ where: { id: addressId } });
    res.json({ success: true, id: addressId });
  } catch (error) {
    console.error('Failed to delete address:', error);
    res.status(500).json({ error: 'Failed to delete address.' });
  }
});

// --- Frontend Checkout Session Route ---
// The frontend calls this to create a cart session before initializing GoKwik SDK.
app.post('/api/checkout/session', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: 'checkout-session' }), async (req, res) => {
  try {
    const { items, subtotal, shipping, total } = req.body;

    const sessionId = 'sess_' + crypto.randomBytes(16).toString('hex');

    cartSessions.set(sessionId, {
      items: items || [],
      totals: {
        subtotal: subtotal || 0,
        shipping_total: shipping || 0,
        total: total || 0,
      },
      customer: {},
      createdAt: Date.now(),
    });

    console.log(`Created checkout session ${sessionId} with ${(items || []).length} items`);

    res.json({ success: true, sessionId });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.post('/api/checkout/razorpay-order', rateLimit({ windowMs: 15 * 60 * 1000, max: 20, keyPrefix: 'razorpay-order' }), async (req, res) => {
  try {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay is not configured on the server.' });
    }

    const checkout = await buildVerifiedCheckout(req.body);
    const receipt = 'tm_' + crypto.randomBytes(10).toString('hex');
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const payNowAmount = checkout.paymentMethod === 'prepaid' ? checkout.total : CHECKOUT_DEPOSIT_AMOUNT;
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(payNowAmount * 100),
        currency: 'INR',
        receipt,
        notes: {
          cart_total: checkout.total.toFixed(2),
          cod_balance: checkout.paymentMethod === 'prepaid' ? '0' : Math.max(0, checkout.total - CHECKOUT_DEPOSIT_AMOUNT).toFixed(2),
          payment_method: checkout.paymentMethod,
          customer_phone: checkout.customerPhone,
        },
      }),
    });

    const razorpayOrder = await razorpayRes.json();
    if (!razorpayRes.ok) {
      console.error('Razorpay order creation failed:', razorpayOrder);
      return res.status(502).json({ error: 'Unable to start Razorpay payment.' });
    }

    pendingCheckouts.set(razorpayOrder.id, checkout);
    await savePendingCheckout(razorpayOrder.id, checkout);

    res.json({
      key: RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: payNowAmount,
      currency: 'INR',
      total: checkout.total,
      codBalance: checkout.paymentMethod === 'prepaid' ? 0 : Math.max(0, checkout.total - CHECKOUT_DEPOSIT_AMOUNT),
    });
  } catch (error: any) {
    if (error.details) {
      return res.status(400).json({ error: 'Please correct the highlighted details.', details: error.details });
    }
    console.error('Failed to create Razorpay checkout:', error);
    res.status(500).json({ error: 'Failed to start checkout.' });
  }
});

app.post('/api/checkout/verify-razorpay', rateLimit({ windowMs: 15 * 60 * 1000, max: 30, keyPrefix: 'verify-razorpay' }), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay is not configured on the server.' });
    }
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing Razorpay payment verification details.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const receivedSignature = String(razorpay_signature);
    if (!/^[a-f0-9]{64}$/i.test(receivedSignature)
      || !crypto.timingSafeEqual(Buffer.from(expectedSignature, 'hex'), Buffer.from(receivedSignature, 'hex'))) {
      return res.status(400).json({ error: 'Payment verification failed.' });
    }

    // The browser callback is trustworthy for *authenticity* (HMAC above),
    // but not authoritative for *money movement*. Confirm with Razorpay that
    // the payment was actually captured, and create an admin-visible order:
    //   - confirmed capture  → order marked paid/partial immediately
    //   - any verification failure → order created as PENDING so admin can
    //     see it; the webhook / reconciliation then confirms it (marks paid)
    //     or, if the payment truly failed, deletes it.
    const checkout = await getPendingCheckout(razorpay_order_id);
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session expired. Please try again.' });
    }

    const capture = await verifyPaymentIsCaptured(razorpay_order_id, razorpay_payment_id);
    const payNowAmount = payoutAmountFor(checkout);
    const expectedAmountPaise = Math.round(payNowAmount * 100);
    const confirmed = capture.captured && capture.amountPaise === expectedAmountPaise;

    if (!confirmed) {
      console.warn('Payment not confirmed yet; creating PENDING order:', {
        razorpay_order_id,
        razorpay_payment_id,
        error: capture.error || 'amount mismatch',
      });
      const pendingOrder = await createOrderFromCheckout(checkout, {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        paymentStatus: 'pending',
      });
      // Keep the checkout so the webhook / reconciliation can still upgrade
      // or clean it up. The browser must show a pending state, not success.
      return res.status(202).json({
        order: pendingOrder,
        paidNow: 0,
        codBalance: 0,
        pending: true,
      });
    }

    const paidAmount = payoutAmountFor(checkout);
    const order = await createOrderFromCheckout(checkout, {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      paidAmount,
      codBalance: Math.max(0, checkout.total - paidAmount),
      paymentStatus: checkout.paymentMethod === 'prepaid' ? 'paid' : 'partial',
    });
    if (checkout.saveAddress) {
      try {
        await saveAccountAddress({
          email: checkout.accountEmail || checkout.customerEmail,
          nickname: checkout.addressNickname,
          firstName: checkout.customerFirstName,
          lastName: checkout.customerLastName,
          phone: checkout.customerPhone,
          address: checkout.customerAddress,
          city: checkout.customerCity,
          state: checkout.customerState,
          zip: checkout.customerZip,
        });
      } catch (addressError) {
        console.error('Order placed, but failed to save checkout address:', addressError);
      }
    }
    await deletePendingCheckout(razorpay_order_id);

    res.status(201).json({
      order,
      paidNow: paidAmount,
      codBalance: Math.max(0, checkout.total - paidAmount),
      pending: false,
    });
  } catch (error: any) {
    console.error('Failed to verify Razorpay payment:', error);
    res.status(500).json({ error: 'Failed to verify payment. Please check your order status before trying again.' });
  }
});

// --- Razorpay Webhook ---
// Authoritative recovery path. If the customer pays but the browser callback
// never reaches us (tab closed, network drop, crash), the webhook still lets
// us create the order. Idempotent with the frontend verify path via the
// unique razorpayOrderId/razorpayPaymentId indexes.
app.post('/api/webhooks/razorpay',
  async (req: Request, res: Response) => {
    const rawBody = (req as any).rawWebhookBody as Buffer | undefined;
    if (!rawBody || rawBody.length === 0) return res.status(400).json({ error: 'Empty webhook body.' });

    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error('Razorpay webhook received, but RAZORPAY_WEBHOOK_SECRET is not configured.');
      return res.status(503).json({ error: 'Webhook processing is not configured.' });
    }

    const signature = req.headers['x-razorpay-signature'] as string | undefined;
    if (!signature) return res.status(400).json({ error: 'Missing signature.' });

    const expected = crypto.createHmac('sha256', RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
    if (!/^[a-f0-9]{64}$/i.test(signature)) {
      return res.status(400).json({ error: 'Webhook signature mismatch.' });
    }
    const received = Buffer.from(signature, 'hex');
    const computed = Buffer.from(expected, 'hex');
    if (received.length !== computed.length || !crypto.timingSafeEqual(received, computed)) {
      return res.status(400).json({ error: 'Webhook signature mismatch.' });
    }

    try {
      const payload = JSON.parse(rawBody.toString('utf8'));
      const event = payload.event as string;
      const entity = payload.payload?.payment?.entity;

      if (event === 'payment.captured' && entity?.order_id && entity?.id) {
        const razorpayOrderId = String(entity.order_id);
        const razorpayPaymentId = String(entity.id);
        const capturedAmountPaise = Number(entity.amount) || 0;

        const checkout = await getPendingCheckout(razorpayOrderId);
        if (checkout) {
          const payNowAmount = payoutAmountFor(checkout);
          if (capturedAmountPaise === Math.round(payNowAmount * 100)) {
            try {
              const order = await createOrderFromCheckout(checkout, {
                razorpayOrderId,
                razorpayPaymentId,
                paidAmount: payNowAmount,
                codBalance: Math.max(0, checkout.total - payNowAmount),
                paymentStatus: checkout.paymentMethod === 'prepaid' ? 'paid' : 'partial',
              });
              console.log('Webhook created/confirmed order:', { orderId: order.id, razorpayOrderId, razorpayPaymentId });
              await deletePendingCheckout(razorpayOrderId);
            } catch (error: any) {
              console.error('Webhook failed to create order:', error);
            }
          } else {
            console.error('Webhook amount mismatch; leaving pending for reconciliation:', {
              razorpayOrderId,
              capturedAmountPaise,
              expectedAmountPaise: Math.round(payNowAmount * 100),
            });
          }
        } else {
          // No pending checkout (already consumed), but a PENDING order may
          // exist from a verify that couldn't confirm capture. Upgrade it.
          const pendingOrder = await prisma.order.findFirst({
            where: { razorpayOrderId, paymentStatus: 'pending' },
          });
          if (pendingOrder) {
            const totalPaise = Math.round(pendingOrder.total * 100);
            const depositPaise = Math.round(Math.min(CHECKOUT_DEPOSIT_AMOUNT, pendingOrder.total) * 100);
            if (capturedAmountPaise === totalPaise) {
              await prisma.order.update({
                where: { id: pendingOrder.id },
                data: {
                  razorpayPaymentId,
                  paidAmount: pendingOrder.total,
                  codBalance: 0,
                  paymentStatus: 'paid',
                },
              });
              console.log('Webhook upgraded pending order to paid:', pendingOrder.id);
            } else if (capturedAmountPaise === depositPaise) {
              await prisma.order.update({
                where: { id: pendingOrder.id },
                data: {
                  razorpayPaymentId,
                  paidAmount: Math.min(CHECKOUT_DEPOSIT_AMOUNT, pendingOrder.total),
                  codBalance: Math.max(0, pendingOrder.total - Math.min(CHECKOUT_DEPOSIT_AMOUNT, pendingOrder.total)),
                  paymentStatus: 'partial',
                },
              });
              console.log('Webhook upgraded pending order to partial:', pendingOrder.id);
            }
          } else {
            console.log('Webhook for order with no pending state; likely already handled:', razorpayOrderId);
          }
        }
      } else if (event === 'payment.failed' && entity?.order_id) {
        // The payment never went through — remove the pending checkout and any
        // PENDING order the verify path may have created for it, restoring
        // inventory.
        const razorpayOrderId = String(entity.order_id);
        await deletePendingCheckout(razorpayOrderId);
        const failedPendingOrders = await prisma.order.findMany({
          where: { razorpayOrderId, paymentStatus: 'pending' },
        });
        for (const failedOrder of failedPendingOrders) {
          await deleteOrderAndRestoreInventory(failedOrder.id);
          console.log('Webhook deleted pending order for failed payment:', failedOrder.id);
        }
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('Failed to process Razorpay webhook:', error);
      res.status(500).json({ error: 'Failed to process webhook.' });
    }
  }
);

async function getRazorpayOrderPayments(orderId: string): Promise<Array<{ id: string; status: string; amount: number }>> {
  try {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const res = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}/payments`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch (error) {
    console.error('Failed to list Razorpay order payments:', error);
    return [];
  }
}

const RECONCILE_INTERVAL_MS = Number(process.env.RECONCILE_INTERVAL_MS) || 5 * 60 * 1000;
const RECONCILE_STALE_MS = Number(process.env.RECONCILE_STALE_MS) || 10 * 60 * 1000;

// Payment reconciliation: periodically find persisted checkouts whose browser
// callback never arrived and confirm directly with Razorpay whether the money
// moved. If it did, create the order. Also confirm/clean up PENDING orders
// (created by a verification that couldn't confirm capture). Catches crashes,
// lost webhooks, and dropped callbacks without manual intervention.
async function reconcilePaidPayments() {
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) return;

  const stale = await findStalePendingCheckouts();
  for (const { id, data } of stale) {
    const ageMs = Date.now() - data.createdAt;
    if (ageMs < RECONCILE_STALE_MS) continue; // give the browser callback a window first

    const payments = await getRazorpayOrderPayments(id);
    const captured = payments.find((payment) => payment.status === 'captured');
    if (captured) {
      const payNowAmount = payoutAmountFor(data);
      if (Number(captured.amount) === Math.round(payNowAmount * 100)) {
        try {
          const order = await createOrderFromCheckout(data, {
            razorpayOrderId: id,
            razorpayPaymentId: String(captured.id),
            paidAmount: payNowAmount,
            codBalance: Math.max(0, data.total - payNowAmount),
            paymentStatus: data.paymentMethod === 'prepaid' ? 'paid' : 'partial',
          });
          console.log('Reconciliation recovered order:', { orderId: order.id, razorpayOrderId: id });
          await deletePendingCheckout(id);
        } catch (error: any) {
          console.error('Reconciliation failed to create order:', error);
        }
      }
    } else {
      await deletePendingCheckout(id);
    }
  }

  // Confirm or clean up PENDING orders whose payment can't be verified in the
  // grace window. These exist when the browser verify call reached us but the
  // real-time capture lookup failed (or Razorpay was still processing).
  const pendingOrders = await prisma.order.findMany({
    where: { paymentStatus: 'pending', razorpayOrderId: { not: null } },
    include: { items: true },
    orderBy: { createdAt: 'asc' },
  });

  for (const order of pendingOrders) {
    const ageMs = Date.now() - new Date(order.createdAt).getTime();
    if (ageMs < RECONCILE_STALE_MS) continue;

    const razorpayOrderId = order.razorpayOrderId!;
    const payments = await getRazorpayOrderPayments(razorpayOrderId);
    const captured = payments.find((payment) => payment.status === 'captured');

    if (captured) {
      const amountPaise = Number(captured.amount);
      const totalPaise = Math.round(order.total * 100);
      const depositPaise = Math.round(Math.min(CHECKOUT_DEPOSIT_AMOUNT, order.total) * 100);

      if (amountPaise === totalPaise) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            razorpayPaymentId: String(captured.id),
            paidAmount: order.total,
            codBalance: 0,
            paymentStatus: 'paid',
          },
        });
      } else if (amountPaise === depositPaise) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            razorpayPaymentId: String(captured.id),
            paidAmount: Math.min(CHECKOUT_DEPOSIT_AMOUNT, order.total),
            codBalance: Math.max(0, order.total - Math.min(CHECKOUT_DEPOSIT_AMOUNT, order.total)),
            paymentStatus: 'partial',
          },
        });
      } else {
        continue; // unusual amount — leave pending for manual review
      }
      await deletePendingCheckout(razorpayOrderId);
      continue;
    }

    // No captured payment after the grace window: the payment failed or was
    // abandoned. The user asked for no order to remain in that case.
    await deleteOrderAndRestoreInventory(order.id);
    await deletePendingCheckout(razorpayOrderId);
    console.log('Reconciliation deleted pending order (no captured payment):', order.id);
  }
}
const reconcileInterval = setInterval(reconcilePaidPayments, RECONCILE_INTERVAL_MS);
reconcilePaidPayments().catch(() => {});

// --- GoKwik Cart API Endpoints ---
// GoKwik servers call these endpoints to interact with our store.

// 1. Get Cart - GoKwik fetches cart data using session_key
app.post('/gokwik/v1/cart', gokwikAuthMiddleware, async (req, res) => {
  try {
    const sessionKey = req.body.session_key || req.query.session_key;

    if (!sessionKey) {
      return res.status(400).json({ message: 'session_key is required' });
    }

    const session = cartSessions.get(sessionKey);

    if (!session) {
      return res.status(404).json({ message: 'Cart session not found' });
    }

    // Fetch product details from DB for accurate data
    const productIds = session.items.map((item: any) => item.id || item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    const cartItems = session.items.map((item: any) => {
      const product = productMap.get(item.id || item.productId);
      return {
        product_id: item.id || item.productId,
        name: product?.name || item.name || 'Product',
        quantity: item.quantity || 1,
        price: product?.price || item.price || 0,
        image: product?.image || item.image || '',
        is_customizable: product?.isCustomizable || false,
        customization_category: product?.category || 'no customization',
        custom_image_url: item.customImageUrl || null,
        custom_text: item.customText || null,
      };
    });

    res.json({
      items: cartItems,
      totals: session.totals,
      coupon_applied: [],
      chosen_shipping_method: [],
      shipping_methods: [
        {
          method_id: 'flat_rate',
          rate_id: 'flat_rate',
          method_name: 'Standard Shipping',
          charge: session.totals.shipping_total,
          tax_cost: 0,
        }
      ],
    });
  } catch (error) {
    console.error('GoKwik getCart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 2. Set Address - GoKwik saves customer address during checkout
app.post('/gokwik/v1/cart/set-address', gokwikAuthMiddleware, (req, res) => {
  try {
    const sessionKey = req.body.session_key || req.query.session_key;
    const session = cartSessions.get(sessionKey);

    if (!session) {
      return res.status(404).json({ message: 'Cart session not found' });
    }

    session.customer = {
      ...session.customer,
      first_name: req.body.first_name || '',
      last_name: req.body.last_name || '',
      email: req.body.email || '',
      phone: req.body.phone || '',
      address_1: req.body.address_1 || '',
      city: req.body.city || '',
      state: req.body.state || '',
      postcode: req.body.postcode || '',
      country: req.body.country || 'IN',
    };

    res.json({ message: 'Address updated', cart: { items: session.items, totals: session.totals } });
  } catch (error) {
    console.error('GoKwik setAddress error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 3. Get Coupons
app.post('/gokwik/v1/cart/get-coupons', gokwikAuthMiddleware, (_req, res) => {
  res.json({ coupons: [] });
});

// 4. Apply Coupon
app.post('/gokwik/v1/cart/apply-coupon', gokwikAuthMiddleware, (_req, res) => {
  res.json({ message: 'No coupons available', cart: {} });
});

// 5. Remove Coupon
app.post('/gokwik/v1/cart/remove-coupon', gokwikAuthMiddleware, (_req, res) => {
  res.json({ message: 'No coupons to remove', cart: {} });
});

// 6. Set Shipping Method
app.post('/gokwik/v1/cart/set-shipping-method', gokwikAuthMiddleware, (req, res) => {
  try {
    const sessionKey = req.body.session_key || req.query.session_key;
    const session = cartSessions.get(sessionKey);
    if (!session) {
      return res.status(404).json({ message: 'Cart session not found' });
    }
    res.json({ message: 'Shipping method set', cart: { items: session.items, totals: session.totals } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 7. Place Order - GoKwik calls this after successful payment
app.post('/gokwik/v1/cart/place-order', gokwikAuthMiddleware, async (req, res) => {
  try {
    const sessionKey = req.body.session_key;
    const billing = req.body.billing || {};
    const shipping = req.body.shipping || {};
    const paymentMethod = req.body.payment_method || 'gokwik_prepaid';
    const orderTotal = parseFloat(req.body.order_total) || 0;
    const transactionId = req.body.transaction_id || null;

    console.log('GoKwik place-order called:', { sessionKey, paymentMethod, orderTotal });

    const session = cartSessions.get(sessionKey);
    if (!session) {
      console.error('GoKwik place-order: session not found:', sessionKey);
      return res.status(400).json({ message: 'Cart session not found' });
    }

    const checkout = await buildVerifiedCheckout({
      customerEmail: billing.email || shipping.email || session.customer.email,
      customerPhone: billing.phone || shipping.phone || session.customer.phone,
      customerFirstName: billing.first_name || shipping.first_name || session.customer.first_name,
      customerLastName: billing.last_name || shipping.last_name || session.customer.last_name,
      addressNickname: billing.address_nickname || shipping.address_nickname || session.customer.address_nickname || 'GoKwik Address',
      customerAddress: billing.address_1 || shipping.address_1 || session.customer.address_1,
      customerCity: billing.city || shipping.city || session.customer.city,
      customerState: billing.state || shipping.state || session.customer.state,
      customerZip: billing.postcode || shipping.postcode || session.customer.postcode,
      paymentMethod: String(paymentMethod).toLowerCase().includes('cod') ? 'cod' : 'prepaid',
      items: session.items,
    });

    if (orderTotal > 0 && Math.abs(orderTotal - checkout.total) > 1) {
      return res.status(400).json({ message: 'Order total does not match the verified cart total' });
    }

    const newOrder = await createOrderFromCheckout(checkout, {
      gokwikOrderId: String(req.body.gokwik_order_id || transactionId || `gk_${Date.now()}`),
      paidAmount: checkout.paymentMethod === 'prepaid' ? checkout.total : payoutAmountFor(checkout),
      codBalance: Math.max(0, checkout.total - payoutAmountFor(checkout)),
      paymentStatus: checkout.paymentMethod === 'prepaid' ? 'paid' : 'partial',
    });

    // Clean up session
    cartSessions.delete(sessionKey);

    console.log('GoKwik order created:', newOrder.id);

    // GoKwik expects the WooCommerce-compatible response format
    res.json({
      status: 'success',
      order_id: newOrder.id,
      redirect_url: null,
    });
  } catch (error) {
    console.error('GoKwik place-order error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// 8. Update Order Status - GoKwik calls this for status sync
app.post('/gokwik/v1/cart/update-order-status', gokwikAuthMiddleware, async (req, res) => {
  try {
    const merchantOrderId = req.body.merchant_order_id;
    const orderStatus = req.body.order_status;

    if (!merchantOrderId) {
      return res.status(400).json({ message: 'merchant_order_id is required' });
    }

    // Map GoKwik statuses to our OrderStatus enum
    const statusMap: Record<string, string> = {
      'pending': 'LIVE',
      'processing': 'LIVE',
      'created': 'LIVE',
      'confirmed': 'LIVE',
      'manifested': 'MANIFESTED',
      'shipped': 'SHIPPED',
      'out_for_delivery': 'DD',
      'ofd': 'DD',
      'dd': 'DD',
      'completed': 'DELIVER',
      'delivered': 'DELIVER',
      'deliver': 'DELIVER',
      'rto': 'RTO',
      'cancelled': 'CANCELLED',
      'canceled': 'CANCELLED',
      'ship_later': 'SHIP_LATER',
      'ship later': 'SHIP_LATER',
    };

    const mappedStatus = statusMap[String(orderStatus || '').toLowerCase()] || 'LIVE';

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: merchantOrderId },
          { gokwikOrderId: merchantOrderId },
        ],
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: mappedStatus as any },
      include: { items: { include: { product: true } } },
    });

    io.emit('order_updated', updatedOrder);

    res.json({ status: 'success', order_id: updatedOrder.id });
  } catch (error) {
    console.error('GoKwik update-order-status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 9. Payment Notification Webhook - GoKwik sends payment status updates here after payment
app.post('/gokwik/v1/payment-notification', gokwikAuthMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('[GoKwik] Payment notification received:', JSON.stringify(req.body).slice(0, 500));

    const {
      gokwik_order_id,
      merchant_order_id,
      order_id,
      payment_status,
      payment_method,
      transaction_id,
      amount,
      status,
    } = req.body;

    const orderId = merchant_order_id || order_id;
    const gokwikId = gokwik_order_id;
    const paymentStatus = (payment_status || status || '').toString().toLowerCase();

    if (!orderId && !gokwikId) {
      console.error('[GoKwik] Payment notification: no order identifier provided');
      return res.status(400).json({ message: 'order_id or gokwik_order_id is required' });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          orderId ? { id: orderId } : { id: '__none__' },
          gokwikId ? { gokwikOrderId: gokwikId } : { id: '__none__' },
        ],
      },
    });

    if (!order) {
      console.error('[GoKwik] Payment notification: order not found for', { orderId, gokwikId });
      return res.status(404).json({ message: 'Order not found' });
    }

    // Map GoKwik payment statuses to our OrderStatus
    const statusMap: Record<string, string> = {
      'success': 'LIVE',
      'completed': 'LIVE',
      'paid': 'LIVE',
      'captured': 'LIVE',
      'pending': 'LIVE',
      'processing': 'LIVE',
      'failed': 'CANCELLED',
      'cancelled': 'CANCELLED',
      'canceled': 'CANCELLED',
      'refunded': 'CANCELLED',
      'expired': 'CANCELLED',
    };

    const mappedStatus = statusMap[paymentStatus] || order.status;

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: mappedStatus as any,
        gokwikOrderId: order.gokwikOrderId || gokwikId || undefined,
      },
      include: { items: { include: { product: true } } },
    });

    io.emit('order_updated', updatedOrder);

    console.log(`[GoKwik] Payment notification processed: order ${order.id} -> ${mappedStatus}`);

    res.json({ status: 'success', order_id: order.id });
  } catch (error) {
    console.error('[GoKwik] Payment notification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 10. Health Check for GoKwik
app.post('/gokwik/v1/cart/health-check', gokwikAuthMiddleware, (_req, res) => {
  res.json({ status: 'ok' });
});

// 10. Check Order Exists
app.post('/gokwik/v1/cart/check-order-exists', gokwikAuthMiddleware, async (req, res) => {
  try {
    const merchantOrderId = req.body.merchant_order_id;
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: merchantOrderId },
          { gokwikOrderId: merchantOrderId },
        ],
      },
    });
    res.json({ exists: !!order, order_id: order?.id || null });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 11. Remove Out of Stock Items
app.post('/gokwik/v1/cart/remove-out-of-stock-items', gokwikAuthMiddleware, (_req, res) => {
  res.json({ removed_items: [] });
});

// --- Product Routes ---

const productCategoryInclude = {
  categoryLinks: {
    include: { category: { select: { id: true, name: true, slug: true, coverImage: true } } },
  },
} as const;
const adminProductSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  oldPrice: true,
  image: true,
  gallery: true,
  isCustomizable: true,
  label: true,
  category: true,
  inventoryCount: true,
  reviews: true,
  createdAt: true,
  updatedAt: true,
  categoryLinks: productCategoryInclude.categoryLinks,
} satisfies Prisma.ProductSelect;
const publicProductCardSelect = {
  id: true,
  name: true,
  price: true,
  oldPrice: true,
  image: true,
  isCustomizable: true,
  label: true,
  category: true,
  reviews: true,
} satisfies Prisma.ProductSelect;
const PRODUCT_PAGE_SIZE = 10;
const MAX_PRODUCT_PAGE_SIZE = 48;
const MAX_PAGE_NUMBER = 10_000;
const ORDER_PAGE_SIZE = 25;
const MAX_ORDER_PAGE_SIZE = 100;

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

function productCard(product: {
  id: string; name: string; price: number; oldPrice: number | null; image: string;
  isCustomizable: boolean; label: string; category: string; reviews?: number;
}) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice,
    image: product.image,
    isCustomizable: product.isCustomizable,
    label: product.label,
    category: product.category,
    reviews: Number.isInteger(product.reviews) && (product.reviews || 0) >= 0 ? product.reviews : 0,
  };
}

function paginationFromQuery(query: Request['query'], defaults: { pageSize: number; maxPageSize: number }) {
  const rawPage = query.page;
  const rawPageSize = query.pageSize;
  const parsePositiveInteger = (value: unknown, name: string, fallback: number) => {
    if (value === undefined) return fallback;
    if (Array.isArray(value) || !/^\d+$/.test(String(value))) throw new Error(`${name} must be a positive integer.`);
    const parsed = Number(value);
    if (!Number.isSafeInteger(parsed) || parsed < 1) throw new Error(`${name} must be a positive integer.`);
    return parsed;
  };
  const page = parsePositiveInteger(rawPage, 'page', 1);
  if (page > MAX_PAGE_NUMBER) throw new Error(`page must be ${MAX_PAGE_NUMBER} or fewer.`);
  const requestedPageSize = parsePositiveInteger(rawPageSize, 'pageSize', defaults.pageSize);
  if (requestedPageSize > defaults.maxPageSize) throw new Error(`pageSize must be ${defaults.maxPageSize} or fewer.`);
  return { page, pageSize: requestedPageSize };
}

function paginationMetadata(page: number, pageSize: number, total: number): Pagination {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return { page, pageSize, total, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 };
}

function productListWhere(query: Request['query']): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};
  const term = query.search ?? query.q;
  if (term !== undefined) {
    if (Array.isArray(term)) throw new Error('search must be a single value.');
    const search = String(term).trim();
    if (search.length > 100) throw new Error('search must be 100 characters or fewer.');
    if (search) where.OR = [{ name: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }];
  }

  const category = query.category;
  if (category !== undefined) {
    if (Array.isArray(category)) throw new Error('category must be a single value.');
    const value = String(category).trim().toLowerCase();
    if (value === 'uncategorized') where.categoryLinks = { none: {} };
    else if (value) where.categoryLinks = { some: { category: { slug: value } } };
  }

  const availability = query.availability;
  if (availability !== undefined) {
    if (availability !== 'all' && availability !== 'in-stock') throw new Error('availability must be all or in-stock.');
    if (availability === 'in-stock') where.inventoryCount = { gt: 0 };
  }

  const rawIds = query.ids;
  if (rawIds !== undefined) {
    if (Array.isArray(rawIds)) throw new Error('ids must be a comma-separated value.');
    const ids = String(rawIds).split(',').map((id) => id.trim()).filter(Boolean);
    if (!ids.length || ids.length > MAX_PRODUCT_PAGE_SIZE || ids.some((id) => id.length > 100)) throw new Error(`ids must contain between 1 and ${MAX_PRODUCT_PAGE_SIZE} product IDs.`);
    where.id = { in: [...new Set(ids)] };
  }
  return where;
}

function productListOrder(query: Request['query']): Prisma.ProductOrderByWithRelationInput[] {
  const sort = query.sort === undefined ? 'newest' : query.sort;
  if (Array.isArray(sort)) throw new Error('sort must be a single value.');
  switch (sort) {
    case 'newest': return [{ createdAt: 'desc' }, { id: 'asc' }];
    case 'oldest': return [{ createdAt: 'asc' }, { id: 'asc' }];
    case 'price-asc': return [{ price: 'asc' }, { id: 'asc' }];
    case 'price-desc': return [{ price: 'desc' }, { id: 'asc' }];
    case 'name-asc': return [{ name: 'asc' }, { id: 'asc' }];
    default: throw new Error('sort must be newest, oldest, price-asc, price-desc, or name-asc.');
  }
}

// Public category navigation and detail routes. The slug is deliberately
// stable after creation; a rename changes only the display name.
app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { productLinks: true } } },
    });
    res.json(categories.map(categorySummary));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories.' });
  }
});

app.get('/api/categories/:slug', async (req, res) => {
  try {
    const slug = routeParam(req.params.slug).toLowerCase();
    const { page, pageSize } = paginationFromQuery(req.query, { pageSize: PRODUCT_PAGE_SIZE, maxPageSize: MAX_PRODUCT_PAGE_SIZE });
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { productLinks: true } } },
    });
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    const [total, productLinks] = await prisma.$transaction([
      prisma.productCategory.count({ where: { categoryId: category.id } }),
      prisma.productCategory.findMany({
        where: { categoryId: category.id },
        orderBy: [{ product: { createdAt: 'desc' } }, { productId: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { product: { select: publicProductCardSelect } },
      }),
    ]);
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      ...categorySummary(category),
      // Category pages render the same compact cards as the catalog. Do not
      // include descriptions, galleries, assignments, or admin-only fields.
      products: productLinks.map((link) => productCard(link.product)),
      pagination: paginationMetadata(page, pageSize, total),
    });
  } catch (error) {
    console.error('Failed to fetch category:', error);
    res.status(500).json({ error: 'Failed to fetch category.' });
  }
});

app.post('/api/categories', requireAdmin, async (req, res) => {
  try {
    const name = normalizeCategoryName(req.body?.name);
    const duplicate = await prisma.category.findFirst({ where: { name: { equals: name, mode: 'insensitive' } }, select: { id: true } });
    if (duplicate) return res.status(409).json({ error: 'A category with this name already exists.' });
    const coverImage = await uploadCategoryImage(req.body?.imageData);
    const slug = await getAvailableCategorySlug(name);
    const category = await prisma.category.create({ data: { name, slug, coverImage }, include: { _count: { select: { productLinks: true } } } });
    io.emit('categories_updated');
    res.status(201).json(categorySummary(category));
  } catch (error: any) {
    const status = error?.status || (error?.code === 'P2002' ? 409 : 400);
    console.error('Failed to create category:', error);
    res.status(status).json({ error: error?.message || 'Failed to create category.' });
  }
});

app.put('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Category not found.' });
    const name = normalizeCategoryName(req.body?.name);
    const duplicate = await prisma.category.findFirst({ where: { name: { equals: name, mode: 'insensitive' }, NOT: { id } }, select: { id: true } });
    if (duplicate) return res.status(409).json({ error: 'A category with this name already exists.' });
    const coverImage = req.body?.imageData ? await uploadCategoryImage(req.body.imageData) : existing.coverImage;
    const category = await prisma.category.update({
      where: { id },
      data: { name, coverImage },
      include: { _count: { select: { productLinks: true } } },
    });
    if (coverImage !== existing.coverImage) await removeCategoryImage(existing.coverImage);
    io.emit('categories_updated');
    res.json(categorySummary(category));
  } catch (error: any) {
    const status = error?.status || (error?.code === 'P2002' ? 409 : 400);
    console.error('Failed to update category:', error);
    res.status(status).json({ error: error?.message || 'Failed to update category.' });
  }
});

app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  try {
    const id = routeParam(req.params.id);
    const category = await prisma.category.findUnique({ where: { id }, select: { id: true, coverImage: true } });
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    // The join FK cascades only assignments; products and historical order data remain untouched.
    await prisma.category.delete({ where: { id } });
    await removeCategoryImage(category.coverImage);
    io.emit('categories_updated');
    io.emit('products_updated');
    res.json({ success: true, id });
  } catch (error) {
    console.error('Failed to delete category:', error);
    res.status(500).json({ error: 'Failed to delete category.' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    if (req.query.include !== undefined) {
      return res.status(400).json({ error: 'Product galleries are available only from /api/products/:id.' });
    }
    const { page, pageSize } = paginationFromQuery(req.query, { pageSize: PRODUCT_PAGE_SIZE, maxPageSize: MAX_PRODUCT_PAGE_SIZE });
    const where = productListWhere(req.query);
    const orderBy = productListOrder(req.query);
    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: publicProductCardSelect,
      }),
    ]);
    // Product prices and inventory must never be shared from a stale public
    // cache. The client has an in-flight GET de-duplicator instead.
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      items: products.map(productCard),
      pagination: paginationMetadata(page, pageSize, total),
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    const message = error instanceof Error ? error.message : 'Product catalog is temporarily unavailable. Please try again.';
    const status = /must be|pageSize|search|sort|availability|category|ids/.test(message) ? 400 : 503;
    res.status(status).json({ error: status === 400 ? message : 'Product catalog is temporarily unavailable. Please try again.' });
  }
});

// Inventory, category assignments, and the full product gallery are admin
// data. Keep the broader list behind the existing admin token rather than
// exposing it through a public query parameter.
app.get('/api/admin/products', requireAdmin, async (req, res) => {
  try {
    const { page, pageSize } = paginationFromQuery(req.query, { pageSize: 24, maxPageSize: MAX_PRODUCT_PAGE_SIZE });
    const where = productListWhere(req.query);
    const orderBy = productListOrder(req.query);
    const [total, products] = await prisma.$transaction([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: adminProductSelect,
      }),
    ]);
    res.setHeader('Cache-Control', 'private, no-store');
    res.json({ items: products.map(productWithCategoriesAndReviews), pagination: paginationMetadata(page, pageSize, total) });
  } catch (error) {
    console.error('Failed to fetch admin products:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch products.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const productId = routeParam(req.params.id);
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true, name: true, description: true, price: true, oldPrice: true,
        image: true, gallery: true, isCustomizable: true, label: true, category: true,
        reviews: true,
        categoryLinks: productCategoryInclude.categoryLinks,
      },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(productWithCategoriesAndReviews(product));
  } catch (error) {
    console.error("Failed to fetch product:", error);
    const product = FALLBACK_PRODUCTS.find((fallbackProduct) => fallbackProduct.id === routeParam(req.params.id));
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  }
});

app.post('/api/products', requireAdmin, async (req, res) => {
  try {
    const data = req.body || {};
    const values = validateAdminProductInput(data);
    const categoryIds = await validatedCategoryIds(data.categoryIds);
    const category = normalizeProductCategory(data.category);
    const reviews = normalizeProductReviewCount(data.reviews);
    const images = prepareProductImages(data.image || '/images/product_mockup.png', data.gallery);
    const product = await prisma.product.create({
      data: {
        name: values.name,
        description: values.description,
        price: values.price,
        oldPrice: values.oldPrice,
        image: images!.image,
        gallery: images!.gallery,
        isCustomizable: category !== 'no customization',
        label: normalizeProductLabel(data.label || data.category),
        category,
        inventoryCount: values.inventoryCount,
        reviews,
        ...(categoryIds ? { categoryLinks: { create: categoryIds.map((categoryId) => ({ categoryId })) } } : {}),
      },
      include: productCategoryInclude,
    });
    io.emit("products_updated");
    io.emit("categories_updated");
    res.status(201).json(productWithCategoriesAndReviews(product));
  } catch (error: any) {
    console.error("Failed to create product:", error);
    res.status(error?.status || (error?.code === 'P2002' ? 409 : 400)).json({ error: error?.message || "Failed to create product" });
  }
});

app.put('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const productId = routeParam(req.params.id);
    const data = req.body || {};
    const values = validateAdminProductInput(data);
    const existing = await prisma.product.findUnique({ where: { id: productId }, select: { id: true, image: true, gallery: true } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    const categoryIds = await validatedCategoryIds(data.categoryIds);
    const category = normalizeProductCategory(data.category);
    const reviews = normalizeProductReviewCount(data.reviews);
    const images = prepareProductImages(data.image || existing.image, data.gallery === undefined ? existing.gallery : data.gallery);
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        name: values.name,
        description: values.description,
        price: values.price,
        oldPrice: values.oldPrice,
        image: images!.image,
        gallery: images!.gallery,
        isCustomizable: category !== 'no customization',
        label: normalizeProductLabel(data.label || data.category),
        category,
        inventoryCount: values.inventoryCount,
        reviews,
        ...(categoryIds !== undefined ? { categoryLinks: { deleteMany: {}, create: categoryIds.map((categoryId) => ({ categoryId })) } } : {}),
      },
      include: productCategoryInclude,
    });
    io.emit("products_updated");
    io.emit("categories_updated");
    res.json(productWithCategoriesAndReviews(product));
  } catch (error: any) {
    console.error("Failed to update product:", error);
    res.status(error?.status || (error?.code === 'P2002' ? 409 : 400)).json({ error: error?.message || "Failed to update product" });
  }
});

app.delete('/api/products/:id', requireAdmin, async (req, res) => {
  try {
    const productId = routeParam(req.params.id);
    const existing = await prisma.product.findUnique({ where: { id: productId }, select: { image: true, gallery: true } });
    if (!existing) return res.status(404).json({ error: 'Product not found' });
    await prisma.product.delete({ where: { id: productId } });
    io.emit("products_updated");
    io.emit("categories_updated");
    res.json({ success: true, id: productId });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// --- Order Routes ---

app.get('/api/orders', requireAdmin, async (req, res) => {
  try {
    const { page, pageSize } = paginationFromQuery(req.query, { pageSize: ORDER_PAGE_SIZE, maxPageSize: MAX_ORDER_PAGE_SIZE });
    const [total, orders] = await prisma.$transaction([
      prisma.order.count(),
      prisma.order.findMany({
      include: {
        items: {
          include: { product: { select: { id: true, name: true, image: true } } }
        }
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    ]);
    res.setHeader('Cache-Control', 'private, no-store');
    res.json({ items: orders, pagination: paginationMetadata(page, pageSize, total) });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to fetch orders' });
  }
});

app.post('/api/orders', requireAdmin, (_req, res) => {
  res.status(405).json({ error: 'Orders must be created through verified checkout payment.' });
});

app.put('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const orderId = routeParam(req.params.id);
    const { status, displayId } = req.body;
    const updateData: Record<string, unknown> = {};

    if (status !== undefined) {
      const normalizedStatus = normalizeOrderStatus(status);
      if (!normalizedStatus) {
        return res.status(400).json({
          error: 'Invalid order status.',
          allowedStatuses: ORDER_STATUSES,
        });
      }
      updateData.status = normalizedStatus;
    }

    if (displayId !== undefined) {
      const trimmed = String(displayId).trim();
      if (!/^\d{6}$/.test(trimmed)) {
        return res.status(400).json({ error: 'Display ID must be exactly 6 digits.' });
      }
      const existing = await prisma.order.findFirst({
        where: { displayId: trimmed, NOT: { id: orderId } },
        select: { id: true },
      });
      if (existing) {
        return res.status(409).json({ error: `Display ID ${trimmed} is already in use.` });
      }
      updateData.displayId = trimmed;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update.' });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    io.emit("order_updated", order);
    res.json(order);
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.delete('/api/orders/:id', requireAdmin, async (req, res) => {
  try {
    const orderId = routeParam(req.params.id);
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.delete({ where: { id: orderId }, include: { items: true } });
      for (const item of order.items) {
        await tx.product.updateMany({ where: { id: item.productId }, data: { inventoryCount: { increment: item.quantity } } });
      }
    });

    io.emit("order_deleted", orderId);
    res.json({ success: true, id: orderId });
  } catch (error) {
    console.error("Failed to delete order:", error);
    const status = (error as { code?: string }).code === 'P2025' ? 404 : 500;
    res.status(status).json({ error: status === 404 ? 'Order not found.' : 'Failed to delete order' });
  }
});

// --- Admin Dashboard Stats ---

const ADMIN_LOGIN_RATE_MAX = Number(process.env.ADMIN_LOGIN_RATE_MAX) || 8;
app.post('/api/admin/login', rateLimit({ windowMs: 15 * 60 * 1000, max: ADMIN_LOGIN_RATE_MAX, keyPrefix: 'admin-login' }), async (req, res) => {
  const password = req.body?.password;
  if (!process.env.ADMIN_PASSWORD_HASH) {
    res.status(503).json({ error: 'Admin access is not configured.' });
    return;
  }
  if (!verifyAdminPassword(password)) {
    // slow brute-force attempts slightly
    await new Promise((resolve) => setTimeout(resolve, 700));
    res.status(401).json({ error: 'Incorrect password' });
    return;
  }
  res.json({ token: signAdminToken() });
});

app.get('/api/admin/stats', requireAdmin, async (_req, res) => {
  try {
    const [totalOrders, revenueResult, activeProducts] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: 'DELIVER' } }),
      prisma.product.count(),
    ]);

    res.json({
      totalOrders,
      totalRevenue: revenueResult._sum.total || 0,
      activeProducts,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    res.status(500).json({ error: "Failed to fetch admin stats" });
  }
});

app.get('/api/admin/revenue-chart', requireAdmin, async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { status: 'DELIVER' },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyRevenue: Record<string, number> = {};
    for (const order of orders) {
      const dateStr = order.createdAt.toISOString();
      const date = dateStr.split('T')[0] ?? dateStr.slice(0, 10);
      dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
    }

    const chartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }));

    res.json(chartData);
  } catch (error) {
    console.error("Failed to fetch revenue chart:", error);
    res.status(500).json({ error: "Failed to fetch revenue chart" });
  }
});

app.get('/api/admin/orders', requireAdmin, async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch admin orders:', error);
    res.status(500).json({ error: 'Failed to fetch admin orders' });
  }
});

// Start Server
httpServer.listen(port, () => {
  console.log(`Backend server running on port ${port} with Socket.IO enabled`);
  console.log(`GoKwik environment: ${process.env.GOKWIK_ENV || 'not set'}`);
});

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; closing server connections.`);
  clearInterval(rateLimitCleanupInterval);
  clearInterval(checkoutCleanupInterval);
  clearInterval(reconcileInterval);
  io.close();
  httpServer.close(async () => {
    try {
      await prisma.$disconnect();
      process.exit(0);
    } catch (error) {
      console.error('Failed to disconnect Prisma during shutdown:', error);
      process.exit(1);
    }
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.once('SIGTERM', () => { void shutdown('SIGTERM'); });
process.once('SIGINT', () => { void shutdown('SIGINT'); });
