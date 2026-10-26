/**
 * Product image migration inventory and explicitly-confirmed apply tool.
 * Default mode is read-only. Apply needs a reviewed digest, secure backup,
 * and literal confirmation, so it cannot be run accidentally.
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { decodeProductImageDataUrl, ensureMigratedProductImage, isProductImageDataUrl } from './product-image-storage';
import { getPrismaDatabaseUrl } from './database-url';

dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const DEFAULT_OUTPUT = path.resolve(__dirname, '../reports/product-image-migration-manifest.json');
const APPLY_CONFIRMATION = 'MIGRATE_PRODUCT_IMAGES';
type Field = 'image' | 'gallery';
type ManifestImage = {
  productId: string; field: Field; galleryIndex: number | null; sha256: string; bytes: number;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp'; width: number; height: number;
  proposedObjectPath: string; duplicateOf: string | null;
};
type InvalidImage = { productId: string; field: Field; galleryIndex: number | null; reason: string };
type Manifest = {
  schemaVersion: 1; mode: 'dry-run'; source: string; targetBucket: string;
  summary: { totalRecords: number; examinedImageValues: number; dataUrlValues: number; validImages: number; totalBytes: number; invalidValues: number; duplicateImages: number; uniqueObjects: number };
  records: Array<{ productId: string; status: 'no-data-urls' | 'ready' | 'invalid'; imageCount: number; invalidCount: number }>;
  images: ManifestImage[]; invalid: InvalidImage[]; safeguards: Record<string, unknown>;
};
type Backup = { schemaVersion: 1; type: 'product-image-migration-backup'; manifestSha256: string; records: Array<{ productId: string; image: string; gallery: string[] }> };
type Command =
  | { mode: 'dry-run'; output: string }
  | { mode: 'verify'; manifest: string }
  | { mode: 'apply'; manifest: string; backup: string; expectedManifestSha256: string; batchSize: number };

function option(argv: string[], name: string) {
  const index = argv.indexOf(name);
  if (index === -1) return null;
  const value = argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value.`);
  return value;
}

function parseArguments(argv: string[]): Command {
  const apply = argv.includes('--apply');
  const verify = argv.includes('--verify-manifest');
  if (apply && verify) throw new Error('Choose either --apply or --verify-manifest, not both.');
  if (apply) {
    const manifest = option(argv, '--manifest');
    const backup = option(argv, '--backup');
    const expectedManifestSha256 = option(argv, '--confirm-manifest-sha256');
    const confirmation = option(argv, '--confirm');
    const batchSize = Number(option(argv, '--batch-size') || '10');
    if (!manifest || !backup || !expectedManifestSha256 || confirmation !== APPLY_CONFIRMATION) {
      throw new Error(`Apply is blocked. It requires --manifest FILE --backup FILE --confirm-manifest-sha256 SHA256 --confirm ${APPLY_CONFIRMATION}.`);
    }
    if (!/^[a-f0-9]{64}$/.test(expectedManifestSha256)) throw new Error('--confirm-manifest-sha256 must be a lowercase SHA-256 digest.');
    if (!Number.isSafeInteger(batchSize) || batchSize < 1 || batchSize > 25) throw new Error('--batch-size must be an integer from 1 to 25.');
    return { mode: 'apply', manifest: path.resolve(process.cwd(), manifest), backup: path.resolve(process.cwd(), backup), expectedManifestSha256, batchSize };
  }
  if (verify) {
    const manifest = option(argv, '--verify-manifest');
    if (!manifest) throw new Error('Usage: --verify-manifest FILE');
    return { mode: 'verify', manifest: path.resolve(process.cwd(), manifest) };
  }
  const output = option(argv, '--output');
  return { mode: 'dry-run', output: output ? path.resolve(process.cwd(), output) : DEFAULT_OUTPUT };
}

function sourceKey(productId: string, field: Field, galleryIndex: number | null) {
  return `${productId}:${field}:${galleryIndex ?? 'cover'}`;
}

function proposedObjectPath(sha256: string, extension: string) {
  return `products/migration/${sha256.slice(0, 2)}/${sha256}.${extension}`;
}

function canonicalManifestDigest(manifestBytes: Buffer) {
  return crypto.createHash('sha256').update(manifestBytes).digest('hex');
}

async function readJson<T>(file: string): Promise<{ parsed: T; bytes: Buffer }> {
  const bytes = await fs.readFile(file);
  try { return { parsed: JSON.parse(bytes.toString('utf8')) as T, bytes }; }
  catch { throw new Error(`Could not parse JSON file: ${file}`); }
}

function assertManifest(manifest: Manifest) {
  if (manifest.schemaVersion !== 1 || manifest.mode !== 'dry-run' || !Array.isArray(manifest.records) || !Array.isArray(manifest.images) || !Array.isArray(manifest.invalid)) throw new Error('Manifest has an unsupported schema or is not a dry-run manifest.');
  if (manifest.invalid.length !== 0 || manifest.summary.invalidValues !== 0) throw new Error('Manifest contains invalid image values and cannot be applied.');
  const recordIds = new Set<string>();
  for (const record of manifest.records) {
    if (!record.productId || recordIds.has(record.productId)) throw new Error('Manifest has duplicate or invalid product records.');
    recordIds.add(record.productId);
  }
  if (manifest.summary.totalRecords !== manifest.records.length || manifest.summary.validImages !== manifest.images.length) throw new Error('Manifest summary does not match its records.');
  const firstByHash = new Map<string, string>();
  const seenSources = new Set<string>();
  let bytes = 0;
  for (const image of manifest.images) {
    const key = sourceKey(image.productId, image.field, image.galleryIndex);
    if (!recordIds.has(image.productId) || seenSources.has(key)) throw new Error(`Manifest has a duplicate or orphan image mapping: ${key}`);
    seenSources.add(key);
    const extension = image.mimeType === 'image/jpeg' ? 'jpg' : image.mimeType === 'image/png' ? 'png' : image.mimeType === 'image/webp' ? 'webp' : null;
    if (!extension || !/^[a-f0-9]{64}$/.test(image.sha256) || !Number.isSafeInteger(image.bytes) || image.bytes < 1 || !Number.isSafeInteger(image.width) || image.width < 1 || !Number.isSafeInteger(image.height) || image.height < 1 || image.proposedObjectPath !== proposedObjectPath(image.sha256, extension)) throw new Error(`Manifest has invalid metadata for ${key}.`);
    const expectedDuplicate = firstByHash.get(image.sha256) || null;
    if (image.duplicateOf !== expectedDuplicate) throw new Error(`Manifest has an incorrect duplicate mapping for ${key}.`);
    if (!expectedDuplicate) firstByHash.set(image.sha256, key);
    bytes += image.bytes;
  }
  if (manifest.summary.totalBytes !== bytes || manifest.summary.duplicateImages !== manifest.images.length - firstByHash.size || manifest.summary.uniqueObjects !== firstByHash.size) throw new Error('Manifest aggregate counts do not match image mappings.');
  if (/data:image\//i.test(JSON.stringify(manifest))) throw new Error('Manifest contains a prohibited image data URL.');
}

function assertBackup(backup: Backup, manifest: Manifest, manifestDigest: string) {
  if (backup.schemaVersion !== 1 || backup.type !== 'product-image-migration-backup' || backup.manifestSha256 !== manifestDigest || !Array.isArray(backup.records)) throw new Error('Backup is not a version-1 backup bound to this exact manifest.');
  const records = new Map(backup.records.map((record) => [record.productId, record]));
  if (records.size !== backup.records.length || records.size !== manifest.records.length) throw new Error('Backup does not contain exactly one record per manifest product.');
  const imageBySource = new Map(manifest.images.map((image) => [sourceKey(image.productId, image.field, image.galleryIndex), image]));
  for (const product of manifest.records) {
    const backupRecord = records.get(product.productId);
    if (!backupRecord || !Array.isArray(backupRecord.gallery)) throw new Error(`Backup is missing product ${product.productId}.`);
    const values: Array<{ value: string; field: Field; galleryIndex: number | null }> = [{ value: backupRecord.image, field: 'image', galleryIndex: null }, ...backupRecord.gallery.map((value, galleryIndex) => ({ value, field: 'gallery' as const, galleryIndex }))];
    for (const value of values) {
      const mapping = imageBySource.get(sourceKey(product.productId, value.field, value.galleryIndex));
      if (mapping) {
        const decoded = decodeProductImageDataUrl(value.value);
        if (decoded.sha256 !== mapping.sha256 || decoded.bytes.length !== mapping.bytes || decoded.mimeType !== mapping.mimeType || decoded.width !== mapping.width || decoded.height !== mapping.height) throw new Error(`Backup image bytes do not match the manifest at ${sourceKey(product.productId, value.field, value.galleryIndex)}.`);
      } else if (isProductImageDataUrl(value.value)) throw new Error(`Backup has an unmanifested image data URL at ${sourceKey(product.productId, value.field, value.galleryIndex)}.`);
    }
  }
  return records;
}

function desiredReferences(record: { productId: string; image: string; gallery: string[] }, manifest: Manifest, publicUrls: Map<string, string>) {
  const mapping = new Map(manifest.images.map((image) => [sourceKey(image.productId, image.field, image.galleryIndex), image]));
  const replace = (value: string, field: Field, galleryIndex: number | null) => {
    const image = mapping.get(sourceKey(record.productId, field, galleryIndex));
    if (!image) return value;
    const publicUrl = publicUrls.get(image.proposedObjectPath);
    if (!publicUrl) throw new Error(`No verified storage URL for ${image.proposedObjectPath}.`);
    return publicUrl;
  };
  return { image: replace(record.image, 'image', null), gallery: record.gallery.map((value, index) => replace(value, 'gallery', index)) };
}

function referencesEqual(a: { image: string; gallery: string[] }, b: { image: string; gallery: string[] }) {
  return a.image === b.image && a.gallery.length === b.gallery.length && a.gallery.every((value, index) => value === b.gallery[index]);
}

async function buildManifest(prisma: PrismaClient): Promise<Manifest> {
  const products = await prisma.product.findMany({ select: { id: true, image: true, gallery: true }, orderBy: { id: 'asc' } });
  const images: ManifestImage[] = [];
  const invalid: InvalidImage[] = [];
  const records: Manifest['records'] = [];
  const firstByHash = new Map<string, string>();
  let examinedImageValues = 0; let dataUrlValues = 0; let totalBytes = 0;
  for (const product of products) {
    const values: Array<{ value: string; field: Field; galleryIndex: number | null }> = [{ value: product.image, field: 'image', galleryIndex: null }, ...product.gallery.map((value, galleryIndex) => ({ value, field: 'gallery' as const, galleryIndex }))];
    let validForRecord = 0; let invalidForRecord = 0;
    for (const input of values) {
      examinedImageValues += 1;
      if (!isProductImageDataUrl(input.value)) continue;
      dataUrlValues += 1;
      try {
        const image = decodeProductImageDataUrl(input.value);
        const key = sourceKey(product.id, input.field, input.galleryIndex);
        const duplicateOf = firstByHash.get(image.sha256) || null;
        firstByHash.set(image.sha256, duplicateOf || key);
        images.push({ productId: product.id, field: input.field, galleryIndex: input.galleryIndex, sha256: image.sha256, bytes: image.bytes.length, mimeType: image.mimeType, width: image.width, height: image.height, proposedObjectPath: proposedObjectPath(image.sha256, image.extension), duplicateOf });
        totalBytes += image.bytes.length; validForRecord += 1;
      } catch (error) {
        invalid.push({ productId: product.id, field: input.field, galleryIndex: input.galleryIndex, reason: error instanceof Error ? error.message : 'Image validation failed.' });
        invalidForRecord += 1;
      }
    }
    records.push({ productId: product.id, status: invalidForRecord ? 'invalid' : validForRecord ? 'ready' : 'no-data-urls', imageCount: validForRecord, invalidCount: invalidForRecord });
  }
  return { schemaVersion: 1, mode: 'dry-run', source: 'Product.image and Product.gallery only', targetBucket: process.env.PRODUCT_IMAGE_BUCKET || 'product-images', summary: { totalRecords: products.length, examinedImageValues, dataUrlValues, validImages: images.length, totalBytes, invalidValues: invalid.length, duplicateImages: images.length - firstByHash.size, uniqueObjects: firstByHash.size }, records, images, invalid, safeguards: { databaseWrites: false, storageWrites: false, deletions: false, excluded: ['OrderItem.customImageUrl', 'PendingCheckout.data'] } };
}

async function applyManifest(prisma: PrismaClient, manifest: Manifest, backup: Backup, digest: string, batchSize: number) {
  const backupRecords = assertBackup(backup, manifest, digest);
  const current = await prisma.product.findMany({ select: { id: true }, orderBy: { id: 'asc' } });
  if (current.length !== backupRecords.size || current.some((product) => !backupRecords.has(product.id))) throw new Error('Live Product IDs differ from the reviewed backup; regenerate and review the manifest.');
  const unique = new Map<string, { image: ManifestImage; source: string }>();
  for (const image of manifest.images) if (!unique.has(image.proposedObjectPath)) {
    const backupRecord = backupRecords.get(image.productId)!;
    const source = image.field === 'image' ? backupRecord.image : backupRecord.gallery[image.galleryIndex!];
    if (!source) throw new Error(`Backup lacks source bytes for ${sourceKey(image.productId, image.field, image.galleryIndex)}.`);
    unique.set(image.proposedObjectPath, { image, source });
  }
  const publicUrls = new Map<string, string>();
  for (const { image, source } of unique.values()) {
    const decoded = decodeProductImageDataUrl(source);
    const stored = await ensureMigratedProductImage({ objectName: image.proposedObjectPath, bytes: decoded.bytes, sha256: image.sha256, mimeType: image.mimeType, extension: decoded.extension });
    publicUrls.set(image.proposedObjectPath, stored.publicUrl);
  }
  let updated = 0; let alreadyMigrated = 0;
  const ordered = [...backupRecords.values()].sort((a, b) => a.productId.localeCompare(b.productId));
  for (let start = 0; start < ordered.length; start += batchSize) {
    const batch = ordered.slice(start, start + batchSize);
    const outcome = await prisma.$transaction(async (tx) => {
      let applied = 0; let skipped = 0;
      for (const original of batch) {
        const live = await tx.product.findUnique({ where: { id: original.productId }, select: { image: true, gallery: true } });
        if (!live) throw new Error(`Product ${original.productId} was removed during migration.`);
        const desired = desiredReferences(original, manifest, publicUrls);
        if (referencesEqual(live, desired)) { skipped += 1; continue; }
        if (!referencesEqual(live, original)) throw new Error(`Product ${original.productId} image values changed after the reviewed backup; aborting without overwriting them.`);
        await tx.product.update({ where: { id: original.productId }, data: desired });
        applied += 1;
      }
      return { applied, skipped };
    }, { isolationLevel: 'Serializable' });
    updated += outcome.applied; alreadyMigrated += outcome.skipped;
    console.log(JSON.stringify({ phase: 'database-batch', start, size: batch.length, ...outcome }));
  }
  // A transaction result alone is not the final proof: re-read every cover
  // and gallery position after the last batch and compare it to the reviewed
  // mapping, including legacy non-data-URL entries that must remain unchanged.
  const finalProducts = await prisma.product.findMany({ select: { id: true, image: true, gallery: true }, orderBy: { id: 'asc' } });
  if (finalProducts.length !== backupRecords.size) throw new Error('Product count changed during migration; post-migration verification failed.');
  for (const live of finalProducts) {
    const original = backupRecords.get(live.id);
    if (!original || !referencesEqual(live, desiredReferences(original, manifest, publicUrls))) {
      throw new Error(`Post-migration verification failed for product ${live.id}.`);
    }
  }
  console.log(JSON.stringify({ phase: 'complete', updated, alreadyMigrated, verifiedObjects: unique.size, verifiedProducts: finalProducts.length, verifiedImageMappings: manifest.images.length }));
}

async function main() {
  const command = parseArguments(process.argv.slice(2));
  const prisma = new PrismaClient({ datasources: { db: { url: getPrismaDatabaseUrl() } } });
  try {
    if (command.mode === 'dry-run') {
      const manifest = await buildManifest(prisma);
      assertManifest(manifest);
      await fs.mkdir(path.dirname(command.output), { recursive: true });
      await fs.writeFile(command.output, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', flag: 'w' });
      console.log(JSON.stringify({ output: command.output, ...manifest.summary }, null, 2));
      return;
    }
    const manifestInput = await readJson<Manifest>(command.manifest);
    assertManifest(manifestInput.parsed);
    if (command.mode === 'verify') {
      const regenerated = await buildManifest(prisma);
      const expected = `${JSON.stringify(regenerated, null, 2)}\n`;
      if (manifestInput.bytes.toString('utf8') !== expected) throw new Error('Manifest differs from a freshly regenerated inventory; it is stale or has been modified.');
      console.log(JSON.stringify({ verified: command.manifest, manifestSha256: canonicalManifestDigest(manifestInput.bytes), ...manifestInput.parsed.summary }, null, 2));
      return;
    }
    const digest = canonicalManifestDigest(manifestInput.bytes);
    if (digest !== command.expectedManifestSha256) throw new Error('Reviewed manifest digest does not match --confirm-manifest-sha256.');
    const backupInput = await readJson<Backup>(command.backup);
    await applyManifest(prisma, manifestInput.parsed, backupInput.parsed, digest, command.batchSize);
  } finally { await prisma.$disconnect(); }
}

main().catch((error) => { console.error(`Product image migration failed: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
