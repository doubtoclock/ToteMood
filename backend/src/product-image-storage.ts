import crypto from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

export const PRODUCT_IMAGE_BUCKET = process.env.PRODUCT_IMAGE_BUCKET || 'product-images';
export const PRODUCT_IMAGE_MAX_BYTES = Number(process.env.PRODUCT_IMAGE_MAX_BYTES || 5 * 1024 * 1024);
export const PRODUCT_IMAGE_MAX_DIMENSION = Number(process.env.PRODUCT_IMAGE_MAX_DIMENSION || 10_000);
export const PRODUCT_IMAGE_MAX_PIXELS = Number(process.env.PRODUCT_IMAGE_MAX_PIXELS || 40_000_000);

type SupportedMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export type DecodedProductImage = {
  bytes: Buffer;
  mimeType: SupportedMimeType;
  extension: 'jpg' | 'png' | 'webp';
  width: number;
  height: number;
  sha256: string;
};

export type StoredProductImage = DecodedProductImage & {
  objectName: string;
  publicUrl: string;
};

export type MigratedProductImage = {
  objectName: string;
  publicUrl: string;
};

export class ProductImageStorageError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = 'ProductImageStorageError';
  }
}

const DATA_URL = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/;
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readUInt24LE(bytes: Buffer, offset: number) {
  return bytes[offset]! | (bytes[offset + 1]! << 8) | (bytes[offset + 2]! << 16);
}

function jpegDimensions(bytes: Buffer) {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null;
    while (bytes[offset] === 0xff) offset += 1;
    const marker = bytes[offset]!;
    offset += 1;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 1 >= bytes.length) return null;
    const length = bytes.readUInt16BE(offset);
    if (length < 2 || offset + length > bytes.length) return null;
    // Baseline/progressive/lossless SOF markers, excluding non-SOF control markers.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      if (length < 7) return null;
      return { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  return null;
}

function webpDimensions(bytes: Buffer) {
  if (bytes.length < 30 || bytes.subarray(0, 4).toString('ascii') !== 'RIFF' || bytes.subarray(8, 12).toString('ascii') !== 'WEBP') return null;
  const chunk = bytes.subarray(12, 16).toString('ascii');
  if (chunk === 'VP8X' && bytes.length >= 30) {
    return { width: 1 + readUInt24LE(bytes, 24), height: 1 + readUInt24LE(bytes, 27) };
  }
  if (chunk === 'VP8 ' && bytes.length >= 30 && bytes[23] === 0x9d && bytes[24] === 0x01 && bytes[25] === 0x2a) {
    return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
  }
  if (chunk === 'VP8L' && bytes.length >= 25 && bytes[20] === 0x2f) {
    const bits = bytes.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function imageDimensions(mimeType: SupportedMimeType, bytes: Buffer) {
  if (mimeType === 'image/png') {
    if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE) || bytes.subarray(12, 16).toString('ascii') !== 'IHDR') return null;
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  return mimeType === 'image/jpeg' ? jpegDimensions(bytes) : webpDimensions(bytes);
}

/** Decode and verify a browser-produced image data URL without trusting its declared MIME type. */
export function decodeProductImageDataUrl(value: unknown): DecodedProductImage {
  if (typeof value !== 'string') throw new ProductImageStorageError('Product images must be JPEG, PNG, or WebP data URLs.');
  const match = value.match(DATA_URL);
  if (!match) throw new ProductImageStorageError('Product images must be JPEG, PNG, or WebP data URLs.');
  const declaredMimeType = match[1] as SupportedMimeType;
  const encoded = match[2]!;
  // Buffer.from is permissive, so require a canonical base64 length before decoding.
  if (encoded.length % 4 !== 0) throw new ProductImageStorageError('The image data is not valid base64.');
  const bytes = Buffer.from(encoded, 'base64');
  if (!bytes.length || bytes.length > PRODUCT_IMAGE_MAX_BYTES) {
    throw new ProductImageStorageError(`Product images must be ${Math.floor(PRODUCT_IMAGE_MAX_BYTES / (1024 * 1024))} MB or smaller.`, 413);
  }

  const actualMimeType: SupportedMimeType | null = bytes.subarray(0, 8).equals(PNG_SIGNATURE)
    ? 'image/png'
    : bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
      ? 'image/jpeg'
      : bytes.length >= 12 && bytes.subarray(0, 4).toString('ascii') === 'RIFF' && bytes.subarray(8, 12).toString('ascii') === 'WEBP'
        ? 'image/webp'
        : null;
  if (!actualMimeType || actualMimeType !== declaredMimeType) {
    throw new ProductImageStorageError('The image file signature does not match its declared image type.');
  }

  const dimensions = imageDimensions(actualMimeType, bytes);
  if (!dimensions || !dimensions.width || !dimensions.height) {
    throw new ProductImageStorageError('The image dimensions could not be read safely.');
  }
  if (dimensions.width > PRODUCT_IMAGE_MAX_DIMENSION || dimensions.height > PRODUCT_IMAGE_MAX_DIMENSION || dimensions.width * dimensions.height > PRODUCT_IMAGE_MAX_PIXELS) {
    throw new ProductImageStorageError(`Product images must be at most ${PRODUCT_IMAGE_MAX_DIMENSION} pixels on either side and ${PRODUCT_IMAGE_MAX_PIXELS.toLocaleString()} pixels total.`, 413);
  }

  return {
    bytes,
    mimeType: actualMimeType,
    extension: actualMimeType === 'image/jpeg' ? 'jpg' : actualMimeType.slice('image/'.length) as 'png' | 'webp',
    ...dimensions,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };
}

export function isProductImageDataUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('data:image/');
}

function storageConfig() {
  const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '');
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
  if (!supabaseUrl || !serviceRoleKey) {
    throw new ProductImageStorageError('Product image storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on the server.', 503);
  }
  return { supabaseUrl, serviceRoleKey };
}

function missingBucketError() {
  return new ProductImageStorageError(`Product image storage bucket "${PRODUCT_IMAGE_BUCKET}" is not configured. Create the public bucket with JPEG, PNG, and WebP allowed before uploading product images.`, 503);
}

function migrationObjectNameIsSafe(objectName: string, sha256: string, extension: DecodedProductImage['extension']) {
  return objectName === `products/migration/${sha256.slice(0, 2)}/${sha256}.${extension}`;
}

function isMissingObjectError(message: string) {
  return /object.*not found|not found.*object|404/i.test(message);
}

/**
 * Ensure one content-addressed migration object exists without ever
 * overwriting it. Existing objects are downloaded and hashed before they are
 * trusted, which makes retrying an interrupted migration safe.
 */
export async function ensureMigratedProductImage(input: {
  objectName: string;
  bytes: Buffer;
  sha256: string;
  mimeType: DecodedProductImage['mimeType'];
  extension: DecodedProductImage['extension'];
}): Promise<MigratedProductImage> {
  if (!/^[a-f0-9]{64}$/.test(input.sha256) || !migrationObjectNameIsSafe(input.objectName, input.sha256, input.extension)) {
    throw new ProductImageStorageError('Invalid content-addressed product migration object path.', 400);
  }
  const actualHash = crypto.createHash('sha256').update(input.bytes).digest('hex');
  if (actualHash !== input.sha256) throw new ProductImageStorageError('Migration source bytes do not match their reviewed SHA-256.', 400);

  const { supabaseUrl, serviceRoleKey } = storageConfig();
  const storage = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const bucketCheck = await storage.storage.getBucket(PRODUCT_IMAGE_BUCKET);
  if (bucketCheck.error || !bucketCheck.data) throw missingBucketError();
  const bucket = storage.storage.from(PRODUCT_IMAGE_BUCKET);

  const verify = async () => {
    const downloaded = await bucket.download(input.objectName);
    if (downloaded.error || !downloaded.data) {
      throw new ProductImageStorageError(`Could not verify migrated product image: ${downloaded.error?.message || 'object download failed'}`, 502);
    }
    const bytes = Buffer.from(await downloaded.data.arrayBuffer());
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    if (hash !== input.sha256 || bytes.length !== input.bytes.length || downloaded.data.type !== input.mimeType) {
      throw new ProductImageStorageError(`Existing migration object ${input.objectName} does not match the reviewed content.`, 409);
    }
  };

  const existing = await bucket.download(input.objectName);
  if (existing.data && !existing.error) {
    // Download it once more through the common verification path so the
    // comparison remains identical after a newly-created object race.
    await verify();
  } else {
    if (existing.error && !isMissingObjectError(existing.error.message)) {
      throw new ProductImageStorageError(`Could not inspect migrated product image: ${existing.error.message}`, 502);
    }
    const upload = await bucket.upload(input.objectName, input.bytes, {
      contentType: input.mimeType,
      cacheControl: '31536000',
      upsert: false,
      metadata: { sha256: input.sha256, migration: 'product-image-v1' },
    });
    // A concurrent retry may have uploaded the same object. Never overwrite;
    // instead verify the object that won the race.
    if (upload.error && !/already exists|duplicate|resource already exists/i.test(upload.error.message)) {
      throw new ProductImageStorageError(`Could not upload migrated product image: ${upload.error.message}`, 502);
    }
    await verify();
  }

  const { data } = bucket.getPublicUrl(input.objectName);
  if (!data.publicUrl) throw new ProductImageStorageError('Product image storage did not return a public URL.', 502);
  return { objectName: input.objectName, publicUrl: data.publicUrl };
}

export async function uploadProductImageDataUrl(value: string): Promise<StoredProductImage> {
  const image = decodeProductImageDataUrl(value);
  const { supabaseUrl, serviceRoleKey } = storageConfig();
  const storage = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const bucket = storage.storage.from(PRODUCT_IMAGE_BUCKET);
  const bucketCheck = await storage.storage.getBucket(PRODUCT_IMAGE_BUCKET);
  if (bucketCheck.error || !bucketCheck.data) throw missingBucketError();

  const objectName = `products/${crypto.randomUUID()}.${image.extension}`;
  const { error } = await bucket.upload(objectName, image.bytes, {
    contentType: image.mimeType,
    cacheControl: '31536000',
    upsert: false,
  });
  if (error) {
    if (/bucket.*not found|not found.*bucket/i.test(error.message)) throw missingBucketError();
    throw new ProductImageStorageError(`Could not upload product image: ${error.message}`, 502);
  }
  const { data } = bucket.getPublicUrl(objectName);
  if (!data.publicUrl) throw new ProductImageStorageError('Product image storage did not return a public URL.', 502);
  return { ...image, objectName, publicUrl: data.publicUrl };
}

export function productImageObjectName(publicUrl: string) {
  // Editing non-image fields must still work before product storage is
  // configured. A missing configuration simply means this cannot be one of
  // our managed object URLs.
  const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '');
  if (!supabaseUrl) return null;
  try {
    const url = new URL(publicUrl);
    if (url.origin !== new URL(supabaseUrl).origin) return null;
    const prefix = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;
    const name = url.pathname.startsWith(prefix) ? decodeURIComponent(url.pathname.slice(prefix.length)) : null;
    return name?.startsWith('products/') ? name : null;
  } catch {
    return null;
  }
}

/** Callers must verify references before asking to remove managed object names. */
export async function removeProductImageObjects(objectNames: string[]) {
  if (!objectNames.length) return;
  const { supabaseUrl, serviceRoleKey } = storageConfig();
  const storage = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { error } = await storage.storage.from(PRODUCT_IMAGE_BUCKET).remove([...new Set(objectNames)]);
  if (error) throw new ProductImageStorageError(`Could not clean up newly uploaded product images: ${error.message}`, 502);
}
