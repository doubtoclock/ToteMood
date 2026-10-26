import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

const apiBase = (process.env.CATEGORY_TEST_API_URL || `http://localhost:${process.env.PORT || '4010'}`).replace(/\/$/, '');
const supabaseUrl = String(process.env.SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '';
const sessionSecret = process.env.SESSION_SECRET || '';
const bucketName = 'category-images';
const runId = `category-storage-test-${crypto.randomUUID()}`;
const pngDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WlF8u0AAAAASUVORK5CYII=';
const createdCategoryIds: string[] = [];
const createdImageUrls: string[] = [];
let createdProductId: string | undefined;
let firstCategory: { id: string; slug: string; coverImage: string } | undefined;
let secondCategory: { id: string; slug: string; coverImage: string } | undefined;

function adminToken() {
  assert.ok(sessionSecret, 'SESSION_SECRET is required for the authenticated integration test.');
  const payload = Buffer.from(JSON.stringify({ role: 'admin', exp: Date.now() + 5 * 60 * 1000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', sessionSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

async function request(pathname: string, init: RequestInit = {}, authenticated = false) {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (authenticated) headers.set('x-admin-auth', adminToken());
  const response = await fetch(`${apiBase}${pathname}`, { ...init, headers });
  const data = await response.json().catch(() => null);
  return { response, data };
}

async function databaseRequest(pathname: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('apikey', serviceRoleKey);
  headers.set('Authorization', `Bearer ${serviceRoleKey}`);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(`${supabaseUrl}/rest/v1/${pathname}`, { ...init, headers });
  const data = await response.json().catch(() => null);
  return { response, data };
}

function expectStatus(response: Response, expected: number, label: string) {
  assert.equal(response.status, expected, `${label}: expected ${expected}, got ${response.status}`);
}

function objectName(publicUrl: string) {
  const url = new URL(publicUrl);
  const prefix = `/storage/v1/object/public/${bucketName}/`;
  assert.ok(url.pathname.startsWith(prefix), 'Category image must use the public category-images bucket path.');
  return decodeURIComponent(url.pathname.slice(prefix.length));
}

async function run(name: string, work: () => Promise<void>) {
  try {
    await work();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.log(`FAIL ${name}: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

async function cleanup() {
  if (createdProductId) await databaseRequest(`Product?id=eq.${encodeURIComponent(createdProductId)}`, { method: 'DELETE' }).catch(() => undefined);
  for (const id of [...createdCategoryIds].reverse()) {
    await request(`/api/categories/${id}`, { method: 'DELETE' }, true).catch(() => undefined);
  }
  // Category deletion above owns storage cleanup. Each URL in this array came
  // from the test API, so no non-test object can be selected for deletion.
}

async function main() {
  assert.ok(supabaseUrl && serviceRoleKey, 'Server-only Supabase credentials are required for bucket verification.');
  const storage = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  await run('bucket configuration', async () => {
    const { data, error } = await storage.storage.getBucket(bucketName);
    assert.equal(error, null, error?.message || 'Bucket lookup failed.');
    assert.equal(data?.public, true);
    assert.equal(Number(data?.file_size_limit), 2 * 1024 * 1024);
    assert.deepEqual([...data!.allowed_mime_types!].sort(), ['image/jpeg', 'image/png', 'image/webp']);
  });

  await run('unauthenticated category mutations are rejected', async () => {
    const { response } = await request('/api/categories', { method: 'POST', body: JSON.stringify({ name: `${runId}-unauthorized`, imageData: pngDataUrl }) });
    expectStatus(response, 401, 'unauthenticated category creation');
  });

  await run('category creation persists a valid image and public URL', async () => {
    const { response, data } = await request('/api/categories', { method: 'POST', body: JSON.stringify({ name: `${runId}-one`, imageData: pngDataUrl }) }, true);
    expectStatus(response, 201, 'category creation');
    assert.equal(typeof data?.coverImage, 'string');
    assert.equal(new URL(data.coverImage).origin, new URL(supabaseUrl).origin);
    objectName(data.coverImage);
    firstCategory = data;
    createdCategoryIds.push(data.id);
    createdImageUrls.push(data.coverImage);
  });

  await run('category retrieval and public image loading', async () => {
    assert.ok(firstCategory);
    const { response, data } = await request(`/api/categories/${firstCategory.slug}`);
    expectStatus(response, 200, 'public category retrieval');
    assert.equal(data.coverImage, firstCategory.coverImage);
    const imageResponse = await fetch(firstCategory.coverImage);
    assert.equal(imageResponse.status, 200, 'public category image retrieval must succeed');
    assert.match(imageResponse.headers.get('content-type') || '', /^image\/png/);
  });

  await run('category editing replaces its stored image', async () => {
    assert.ok(firstCategory);
    const { response, data } = await request(`/api/categories/${firstCategory.id}`, { method: 'PUT', body: JSON.stringify({ name: `${runId}-one-renamed`, imageData: pngDataUrl }) }, true);
    expectStatus(response, 200, 'category replacement');
    assert.notEqual(data.coverImage, firstCategory.coverImage, 'replacement must receive a new immutable storage object name');
    createdImageUrls.push(data.coverImage);
    const oldImageResponse = await fetch(firstCategory.coverImage);
    assert.notEqual(oldImageResponse.status, 200, 'the replaced test image must be removed');
    firstCategory = data;
  });

  await run('second category creation', async () => {
    const { response, data } = await request('/api/categories', { method: 'POST', body: JSON.stringify({ name: `${runId}-two`, imageData: pngDataUrl }) }, true);
    expectStatus(response, 201, 'second category creation');
    secondCategory = data;
    createdCategoryIds.push(data.id);
    createdImageUrls.push(data.coverImage);
  });

  await run('multiple category assignments and assignment removal', async () => {
    assert.ok(firstCategory && secondCategory);
    const productId = `${runId}-product`;
    const now = new Date().toISOString();
    const product = await databaseRequest('Product', {
      method: 'POST', headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ id: productId, name: productId, description: 'Disposable integration test product.', price: 1, image: '/images/product_mockup.png', gallery: ['/images/product_mockup.png'], category: 'no customization', label: 'new', isCustomizable: false, inventoryCount: 1, createdAt: now, updatedAt: now }),
    });
    expectStatus(product.response, 201, 'disposable test product creation');
    const testProductId = String(product.data?.[0]?.id || '');
    assert.ok(testProductId, 'The disposable test product must return an ID.');
    createdProductId = testProductId;
    const assignment = await databaseRequest('ProductCategory', {
      method: 'POST', headers: { Prefer: 'return=representation' },
      body: JSON.stringify([{ productId: testProductId, categoryId: firstCategory.id }, { productId: testProductId, categoryId: secondCategory.id }]),
    });
    expectStatus(assignment.response, 201, 'multiple category assignment');
    assert.deepEqual(assignment.data.map((link: { categoryId: string }) => link.categoryId).sort(), [firstCategory.id, secondCategory.id].sort());
    const removal = await databaseRequest(`ProductCategory?productId=eq.${encodeURIComponent(testProductId)}&categoryId=eq.${encodeURIComponent(secondCategory.id)}`, { method: 'DELETE' });
    expectStatus(removal.response, 204, 'category assignment removal');
    const remaining = await databaseRequest(`ProductCategory?productId=eq.${encodeURIComponent(testProductId)}&select=categoryId`);
    expectStatus(remaining.response, 200, 'remaining category assignment lookup');
    assert.deepEqual(remaining.data.map((link: { categoryId: string }) => link.categoryId), [firstCategory.id]);
  });

  await run('unsupported image formats are rejected', async () => {
    const { response } = await request('/api/categories', { method: 'POST', body: JSON.stringify({ name: `${runId}-gif`, imageData: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' }) }, true);
    expectStatus(response, 400, 'GIF category image rejection');
  });

  await run('images over 2 MiB are rejected', async () => {
    const bytes = Buffer.alloc(2 * 1024 * 1024 + 1);
    bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const imageData = `data:image/png;base64,${bytes.toString('base64')}`;
    const { response } = await request('/api/categories', { method: 'POST', body: JSON.stringify({ name: `${runId}-large`, imageData }) }, true);
    assert.ok([400, 413].includes(response.status), `large image must be rejected, got ${response.status}`);
  });

  await run('public users cannot upload, overwrite, or delete storage objects', async () => {
    const object = `categories/${runId}-public-write.png`;
    const endpoint = `${supabaseUrl}/storage/v1/object/${bucketName}/${object}`;
    const body = Buffer.from(pngDataUrl.split(',')[1]!, 'base64');
    const upload = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'image/png' }, body });
    const overwrite = await fetch(endpoint, { method: 'PUT', headers: { 'Content-Type': 'image/png' }, body });
    const deletion = await fetch(endpoint, { method: 'DELETE' });
    for (const [label, response] of [['upload', upload], ['overwrite', overwrite], ['delete', deletion]] as const) {
      assert.ok(!response.ok, `unauthenticated storage ${label} unexpectedly succeeded`);
    }
  });

  await run('category deletion cleans up only its associated test image', async () => {
    assert.ok(firstCategory);
    const deletedUrl = firstCategory.coverImage;
    const { response } = await request(`/api/categories/${firstCategory.id}`, { method: 'DELETE' }, true);
    expectStatus(response, 200, 'category deletion');
    createdCategoryIds.splice(createdCategoryIds.indexOf(firstCategory.id), 1);
    const imageResponse = await fetch(deletedUrl);
    assert.notEqual(imageResponse.status, 200, 'deleted category image must not remain publicly retrievable');
    firstCategory = undefined;
  });
}

main().then(async () => {
  await cleanup();
  console.log('PASS test data cleanup');
}).catch(async (error) => {
  await cleanup();
  console.error(`FAIL category storage integration: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
