import assert from 'node:assert/strict';
import { decodeProductImageDataUrl, ProductImageStorageError } from '../src/product-image-storage';

const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WlF8u0AAAAASUVORK5CYII=';

function expectInvalid(value: string, pattern: RegExp) {
  assert.throws(() => decodeProductImageDataUrl(value), (error: unknown) => error instanceof ProductImageStorageError && pattern.test(error.message));
}

const decoded = decodeProductImageDataUrl(png);
assert.equal(decoded.mimeType, 'image/png');
assert.equal(decoded.extension, 'png');
assert.equal(decoded.width, 1);
assert.equal(decoded.height, 1);
assert.equal(decoded.sha256.length, 64);

expectInvalid(png.replace('image/png', 'image/jpeg'), /signature/);
expectInvalid('data:image/png;base64,AAAA', /signature/);
expectInvalid('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///w==', /JPEG, PNG, or WebP/);

const webp = Buffer.alloc(30);
webp.write('RIFF', 0, 'ascii');
webp.writeUInt32LE(22, 4);
webp.write('WEBPVP8X', 8, 'ascii');
webp.writeUIntLE(1, 24, 3); // width = 2
webp.writeUIntLE(2, 27, 3); // height = 3
const decodedWebp = decodeProductImageDataUrl(`data:image/webp;base64,${webp.toString('base64')}`);
assert.equal(decodedWebp.width, 2);
assert.equal(decodedWebp.height, 3);

console.log('PASS product image signature, MIME, dimension, and WebP validation');
