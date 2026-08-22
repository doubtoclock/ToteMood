import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto';
import path from 'path';

dotenv.config({ quiet: true });
dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const app = express();
const port = process.env.PORT || 4000;

const GOKWIK_APP_ID = process.env.GOKWIK_APP_ID || '';
const GOKWIK_APP_SECRET = process.env.GOKWIK_APP_SECRET || '';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const SESSION_SECRET = process.env.SESSION_SECRET || RAZORPAY_KEY_SECRET || GOKWIK_APP_SECRET || 'totemood-dev-session-secret';
const CHECKOUT_DEPOSIT_AMOUNT = 49;
const defaultAllowedOrigins = [
  'https://totemood.mywire.org',
  'https://www.totemood.mywire.org',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:4010',
];
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
    .concat(defaultAllowedOrigins)
);
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
  allowedHeaders: ['Content-Type', 'Authorization', 'gk-app-id', 'gk-app-secret', 'app-id', 'app-secret'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '4mb' }));
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error && typeof error === 'object' && 'type' in error && error.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Uploaded image is too large. Please choose a smaller image and try again.',
    });
  }

  next(error);
});

// Log GoKwik incoming requests for debugging
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.startsWith('/gokwik/')) {
    console.log(`[GoKwik] ${req.method} ${req.path}`, JSON.stringify(req.body).slice(0, 200));
  }
  next();
});

function getPrismaDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }

  try {
    const url = new URL(databaseUrl);
    const usesPooler = url.hostname.includes('pooler.supabase.com') || url.port === '6543';
    if (usesPooler && !url.searchParams.has('pgbouncer')) {
      url.searchParams.set('pgbouncer', 'true');
    }
    if (usesPooler && !url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', '1');
    }
    return url.toString();
  } catch {
    return databaseUrl;
  }
}

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
    isCustomizable: true,
    label: 'bestseller',
    category: 'image',
    inventoryCount: 50,
  },
  {
    id: 'ghibli-text-tote',
    name: 'CUSTOM GHIBLI TOTE BAG WITH TEXT',
    description: 'Custom Ghibli image + custom text. Add size and approval on WhatsApp after placing orders.',
    price: 599,
    oldPrice: 749,
    image: '/images/product/W5.png',
    isCustomizable: true,
    label: 'bestseller',
    category: 'image+text',
    inventoryCount: 30,
  },
  {
    id: 'emoji-ghibli-tote',
    name: 'CUTE EMOJI WITH GHIBLI TOTE',
    description: 'Emoji and text around Ghibli bags. Add size and approval on WhatsApp after placing orders.',
    price: 599,
    oldPrice: 719,
    image: '/images/product/W9.png',
    isCustomizable: true,
    label: 'bestseller',
    category: 'image+text',
    inventoryCount: 20,
  },
  {
    id: 'polaroid-tote',
    name: 'POLAROID TOTE BAG',
    description: 'Old vintage type Polaroid design. Add size and approval on WhatsApp after placing orders.',
    price: 499,
    oldPrice: 599,
    image: '/images/product/W13.png',
    isCustomizable: true,
    label: 'new',
    category: 'image',
    inventoryCount: 100,
  },
  {
    id: 'any-design-tote',
    name: 'ANY DESIGN TOTE BAG',
    description: 'Customer can customise any ready to print design. Add size and approval on WhatsApp after placing orders.',
    price: 499,
    oldPrice: 599,
    image: '/images/product/W17.png',
    isCustomizable: true,
    label: 'new',
    category: 'image',
    inventoryCount: 85,
  },
];
const MAX_RESPONSE_DATA_IMAGE_LENGTH = 350_000;

function sanitizeProductForResponse<T extends { image: string }>(product: T): T {
  if (product.image.startsWith('data:image/') && product.image.length > MAX_RESPONSE_DATA_IMAGE_LENGTH) {
    return {
      ...product,
      image: '/images/product_mockup.png',
    };
  }

  return product;
}

function sanitizeProductsForResponse<T extends { image: string }>(products: T[]): T[] {
  return products.map(sanitizeProductForResponse);
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

// Cleanup stale sessions every 30 minutes
setInterval(() => {
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
  return image.startsWith('data:image/') || image.startsWith('http://') || image.startsWith('https://');
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

function validateCustomer(data: any) {
  const errors: Record<string, string> = {};
  const customer = {
    customerEmail: String(data.customerEmail || '').trim(),
    customerPhone: normalizePhone(data.customerPhone),
    customerFirstName: String(data.customerFirstName || '').trim(),
    customerLastName: String(data.customerLastName || '').trim(),
    addressNickname: String(data.addressNickname || data.nickname || 'Other').trim() || 'Other',
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
    nickname: String(data.nickname || 'Other').trim() || 'Other',
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
  if (address.nickname.length < 1) errors.nickname = 'Nickname is required.';
  if (address.firstName.length < 2) errors.firstName = 'First name is required.';
  if (address.lastName.length < 1) errors.lastName = 'Last name is required.';
  if (!/^[6-9]\d{9}$/.test(address.phone)) errors.phone = 'Enter a valid 10 digit WhatsApp number.';
  if (address.address.length < 8) errors.address = 'Enter a complete delivery address.';
  if (address.city.length < 2) errors.city = 'City is required.';
  if (address.state.length < 2) errors.state = 'State is required.';
  if (!/^\d{6}$/.test(address.zip)) errors.zip = 'Enter a valid 6 digit PIN code.';

  return { address, errors };
}

function isMissingSavedAddressTableError(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const prismaError = error as { code?: string; meta?: { table?: string } };
  return prismaError.code === 'P2021' && String(prismaError.meta?.table || '').includes('SavedAddress');
}

function normalizeProductLabel(value: unknown) {
  const label = String(value || '').trim().toLowerCase();
  return ['bestseller', 'new', 'premium'].includes(label) ? label : 'new';
}

function normalizeProductCategory(value: unknown) {
  const category = String(value || '').trim().toLowerCase().replace(/\s*\+\s*/g, '+');
  return ['image', 'image+text', 'no customization'].includes(category) ? category : 'image';
}

let catalogCustomizationColumnsReady = false;

function isMissingCatalogCustomizationColumnError(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const prismaError = error as { code?: string; message?: string; meta?: { column?: string } };
  const message = String(prismaError.message || '').toLowerCase();
  const column = String(prismaError.meta?.column || '').toLowerCase();

  return prismaError.code === 'P2022'
    || column === 'label'
    || column === 'customtext'
    || message.includes('product.label')
    || message.includes('orderitem.customtext')
    || message.includes('column "label" does not exist')
    || message.includes('column "customtext" does not exist');
}

async function ensureCatalogCustomizationColumns() {
  if (catalogCustomizationColumnsReady) return;

  await prisma.$executeRawUnsafe(`ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "label" TEXT NOT NULL DEFAULT 'new';`);
  await prisma.$executeRawUnsafe(`
    UPDATE "Product"
    SET "label" = lower("category")
    WHERE lower("category") IN ('bestseller', 'new', 'premium');
  `);
  await prisma.$executeRawUnsafe(`
    UPDATE "Product"
    SET "category" = CASE
      WHEN lower("category") = 'no customization' OR "isCustomizable" = false THEN 'no customization'
      WHEN lower("category") = 'image + text' OR lower("category") = 'image+text' THEN 'image+text'
      WHEN lower("name") LIKE '%text%' OR lower("name") LIKE '%emoji%' OR lower("description") LIKE '%text%' THEN 'image+text'
      ELSE 'image'
    END
    WHERE lower("category") NOT IN ('image', 'image+text', 'no customization');
  `);
  await prisma.$executeRawUnsafe(`UPDATE "Product" SET "isCustomizable" = "category" <> 'no customization';`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "customText" TEXT;`);

  catalogCustomizationColumnsReady = true;
}

async function ensureSavedAddressTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SavedAddress" (
      "id" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "nickname" TEXT NOT NULL,
      "firstName" TEXT NOT NULL,
      "lastName" TEXT NOT NULL,
      "phone" TEXT NOT NULL,
      "address" TEXT NOT NULL,
      "city" TEXT NOT NULL,
      "state" TEXT NOT NULL,
      "zip" TEXT NOT NULL,
      "isDefault" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "SavedAddress_pkey" PRIMARY KEY ("id")
    );
  `);
  await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "SavedAddress_email_idx" ON "SavedAddress"("email");`);
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

async function buildVerifiedCheckout(data: any): Promise<PendingCheckout> {
  await ensureCatalogCustomizationColumns();

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
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });
  const productMap = new Map(products.map((product) => [product.id, product]));

  const verifiedItems = incomingItems.map((item: any) => {
    const productId = String(item.productId || item.id || '');
    const product = productMap.get(productId);
    const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));

    if (!product) {
      errors.items = 'One or more products are no longer available.';
      return null;
    }
    if (product.inventoryCount < quantity) {
      errors.items = `${product.name} has only ${product.inventoryCount} left in stock.`;
      return null;
    }
    const category = normalizeProductCategory(product.category);
    const requiresImage = category === 'image' || category === 'image+text';
    const requiresText = category === 'image+text';

    if (requiresImage && !hasAllCheckoutImages(item, quantity)) {
      errors.items = 'Please upload artwork for every custom tote before placing your order.';
      return null;
    }
    if (requiresText && !hasAllCheckoutTexts(item, quantity)) {
      errors.items = 'Please add custom text for every image + text tote before placing your order.';
      return null;
    }

    const customImageUrl = Array.isArray(item.customImageUrls)
      ? item.customImageUrls.find(hasCheckoutImage)
      : item.customImageUrl;

    return {
      productId,
      quantity,
      price: product.price,
      customImageUrl: String(customImageUrl || '').trim(),
      customText: firstCheckoutText(item) || null,
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

async function createOrderFromCheckout(checkout: PendingCheckout, razorpayPaymentId?: string) {
  const existingOrder = razorpayPaymentId
    ? await prisma.order.findFirst({
        where: { gokwikOrderId: razorpayPaymentId },
        include: {
          items: {
            include: { product: true },
          },
        },
      })
    : null;

  if (existingOrder) {
    return existingOrder;
  }

  const createdOrder = await prisma.$transaction(async (tx) => {
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

    return tx.order.create({
      data: {
        gokwikOrderId: razorpayPaymentId || null,
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

  const order = await prisma.order.findUnique({
    where: { id: createdOrder.id },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

  if (!order) {
    throw new Error('Order was created but could not be loaded.');
  }

  io.emit("new_order", order);
  io.emit("products_updated");
  return order;
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
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/google', async (req, res) => {
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
          mode: 'insensitive',
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Failed to fetch account orders:', error);
    res.status(500).json({ error: 'Failed to fetch account orders.' });
  }
});

app.get('/api/account/addresses', async (req, res) => {
  try {
    const user = requireAuthUser(req, res);
    if (!user) return;

    let addresses: Awaited<ReturnType<typeof prisma.savedAddress.findMany>>;
    try {
      addresses = await prisma.savedAddress.findMany({
        where: { email: user.email },
        orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
      });
    } catch (error) {
      if (!isMissingSavedAddressTableError(error)) throw error;
      await ensureSavedAddressTable();
      addresses = [];
    }
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

    let address: Awaited<ReturnType<typeof saveAccountAddress>>;
    try {
      address = await saveAccountAddress({ ...req.body, email: user.email });
    } catch (error) {
      if (!isMissingSavedAddressTableError(error)) throw error;
      await ensureSavedAddressTable();
      address = await saveAccountAddress({ ...req.body, email: user.email });
    }
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

    const { address, errors } = validateAccountAddress({ ...req.body, email: user.email });
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ error: 'Please correct the highlighted details.', details: errors });
    }

    let existing: Awaited<ReturnType<typeof prisma.savedAddress.findUnique>>;
    try {
      existing = await prisma.savedAddress.findUnique({ where: { id: req.params.id } });
    } catch (error) {
      if (!isMissingSavedAddressTableError(error)) throw error;
      await ensureSavedAddressTable();
      existing = null;
    }
    if (!existing || existing.email !== user.email) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (address.isDefault) {
        await tx.savedAddress.updateMany({
          where: { email: address.email, id: { not: req.params.id } },
          data: { isDefault: false },
        });
      }

      return tx.savedAddress.update({
        where: { id: req.params.id },
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

    let existing: Awaited<ReturnType<typeof prisma.savedAddress.findUnique>>;
    try {
      existing = await prisma.savedAddress.findUnique({ where: { id: req.params.id } });
    } catch (error) {
      if (!isMissingSavedAddressTableError(error)) throw error;
      await ensureSavedAddressTable();
      existing = null;
    }
    if (!existing || existing.email !== user.email) {
      return res.status(404).json({ error: 'Address not found.' });
    }

    await prisma.savedAddress.delete({ where: { id: req.params.id } });
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error('Failed to delete address:', error);
    res.status(500).json({ error: 'Failed to delete address.' });
  }
});

// --- Frontend Checkout Session Route ---
// The frontend calls this to create a cart session before initializing GoKwik SDK.
app.post('/api/checkout/session', async (req, res) => {
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

app.post('/api/checkout/razorpay-order', async (req, res) => {
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

app.post('/api/checkout/verify-razorpay', async (req, res) => {
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

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed.' });
    }

    const checkout = pendingCheckouts.get(razorpay_order_id);
    if (!checkout) {
      return res.status(404).json({ error: 'Checkout session expired. Please try again.' });
    }

    const order = await createOrderFromCheckout(checkout, razorpay_payment_id);
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
    pendingCheckouts.delete(razorpay_order_id);

    res.status(201).json({
      order,
      paidNow: checkout.paymentMethod === 'prepaid' ? checkout.total : CHECKOUT_DEPOSIT_AMOUNT,
      codBalance: checkout.paymentMethod === 'prepaid' ? 0 : Math.max(0, checkout.total - CHECKOUT_DEPOSIT_AMOUNT),
    });
  } catch (error: any) {
    console.error('Failed to verify Razorpay payment:', error);
    res.status(500).json({ error: error.message || 'Failed to place order.' });
  }
});

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

    // Build order items from session
    const orderItems = session.items.map((item: any) => ({
      productId: item.id || item.productId,
      quantity: item.quantity || 1,
      priceAtPurchase: item.price || 0,
      customImageUrl: item.customImageUrl || null,
      customText: item.customText || null,
    }));

    // Create order in Prisma
    const newOrder = await prisma.order.create({
      data: {
        gokwikOrderId: req.body.gokwik_order_id || `gk_${Date.now()}`,
        customerFirstName: billing.first_name || session.customer.first_name || 'Customer',
        customerLastName: billing.last_name || session.customer.last_name || '',
        addressNickname: billing.address_nickname || session.customer.address_nickname || 'Other',
        customerEmail: billing.email || session.customer.email || 'customer@example.com',
        customerPhone: billing.phone || session.customer.phone || '9999999999',
        customerAddress: billing.address_1 || session.customer.address_1 || '123 Main St',
        customerCity: billing.city || session.customer.city || 'Mumbai',
        customerState: billing.state || session.customer.state || 'MH',
        customerZip: billing.postcode || session.customer.postcode || '400001',
        subtotal: session.totals.subtotal,
        shipping: session.totals.shipping_total,
        total: orderTotal || session.totals.total,
        status: 'LIVE',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Clean up session
    cartSessions.delete(sessionKey);

    // Notify admin panel via WebSocket
    io.emit('new_order', newOrder);

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

app.get('/api/products', async (_req, res) => {
  try {
    let products;
    try {
      products = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' }
      });
    } catch (error) {
      if (!isMissingCatalogCustomizationColumnError(error)) throw error;
      await ensureCatalogCustomizationColumns();
      products = await prisma.product.findMany({
        orderBy: { createdAt: 'asc' }
      });
    }
    res.json(sanitizeProductsForResponse(products));
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.json(FALLBACK_PRODUCTS);
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    await ensureCatalogCustomizationColumns();
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(sanitizeProductForResponse(product));
  } catch (error) {
    console.error("Failed to fetch product:", error);
    const product = FALLBACK_PRODUCTS.find((fallbackProduct) => fallbackProduct.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  }
});

app.post('/api/products', async (req, res) => {
  try {
    await ensureCatalogCustomizationColumns();
    const data = req.body;
    const category = normalizeProductCategory(data.category);
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || '',
        price: data.price,
        oldPrice: data.oldPrice || null,
        image: data.image,
        isCustomizable: category !== 'no customization',
        label: normalizeProductLabel(data.label || data.category),
        category,
        inventoryCount: data.inventoryCount || 0,
      }
    });
    io.emit("products_updated");
    res.status(201).json(product);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    await ensureCatalogCustomizationColumns();
    const data = req.body;
    const category = normalizeProductCategory(data.category);
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        description: data.description || '',
        price: data.price,
        oldPrice: data.oldPrice || null,
        image: data.image,
        isCustomizable: category !== 'no customization',
        label: normalizeProductLabel(data.label || data.category),
        category,
        inventoryCount: data.inventoryCount || 0,
      }
    });
    io.emit("products_updated");
    res.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    io.emit("products_updated");
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// --- Order Routes ---

app.get('/api/orders', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const checkout = await buildVerifiedCheckout(req.body);
    const order = await createOrderFromCheckout(checkout);
    res.status(201).json(order);
  } catch (error: any) {
    if (error.details) {
      return res.status(400).json({ error: 'Please correct the highlighted details.', details: error.details });
    }
    console.error("Failed to create order:", error);
    res.status(500).json({ error: error.message || "Failed to create order" });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const status = normalizeOrderStatus(req.body.status);
    if (!status) {
      return res.status(400).json({
        error: 'Invalid order status.',
        allowedStatuses: ORDER_STATUSES,
      });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
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

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await prisma.orderItem.deleteMany({ where: { orderId: req.params.id } });
    await prisma.order.delete({ where: { id: req.params.id } });

    io.emit("order_deleted", req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// --- Admin Dashboard Stats ---

app.get('/api/admin/stats', async (_req, res) => {
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

app.get('/api/admin/revenue-chart', async (_req, res) => {
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

// Start Server
httpServer.listen(port, () => {
  console.log(`Backend server running on port ${port} with Socket.IO enabled`);
  console.log(`GoKwik environment: ${process.env.GOKWIK_ENV || 'not set'}`);
});
