# Product-image migration review guide

The catalog migration is intentionally separated from uploads of customer artwork. It only inventories `Product.image` and every element of `Product.gallery`. It never reads, changes, or reports `OrderItem.customImageUrl` or `PendingCheckout.data` beyond marking them out of scope.

## Safe dry run

Run from `backend/` with server-side database access configured:

```bash
npx tsx src/migrate-product-images.ts
```

The default manifest is `backend/reports/product-image-migration-manifest.json`. To write a reviewed copy elsewhere:

```bash
npx tsx src/migrate-product-images.ts --output /secure/review/product-image-manifest.json
```

The manifest contains product IDs, field locations, hashes, image metadata, proposed paths, and duplicate references. It never contains base64 image contents, database URLs, or credentials. The manifest mapping is deterministic: the same catalog values and bucket setting yield the same canonical JSON, hashes, and proposed paths. Its default behavior is dry-run.

To independently validate the checked-in manifest against the live catalog without writing anything, run:

```bash
npx tsx src/migrate-product-images.ts --verify-manifest reports/product-image-migration-manifest.json
```

This command rebuilds the inventory in memory and byte-compares it with the reviewed manifest. It performs database reads only and has no Storage calls.

## Later bucket provisioning — review, do not run now

After approval, create the `product-images` bucket as **public** with a 5 MiB file-size limit and only `image/jpeg`, `image/png`, and `image/webp` allowed. A Supabase SQL-editor command suitable for review is:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);
```

Do not make this idempotent with `on conflict do nothing`: an existing bucket must be inspected instead of silently accepting unknown settings. After creation, verify the exact row with:

```sql
select id, name, public, file_size_limit, allowed_mime_types
from storage.buckets
where id = 'product-images';
```

Do not add any `storage.objects` INSERT, UPDATE, or DELETE policies for `anon` or `authenticated`; public read is supplied by the public bucket. The server's service-role key bypasses Storage RLS and remains the only upload/delete authority. Confirm no broad, pre-existing object-write policy applies to this bucket. Frontend image configuration already permits `https://*.supabase.co`, including `/storage/v1/object/public/product-images/**`.

## Reviewed apply procedure — implemented but not authorized or executed

1. Export an encrypted, access-controlled backup of every original `Product.id`, `image`, and `gallery` value before any write. Store its checksum separately and restrict access because it contains image data URLs. The decrypted input to the migration must be JSON in this exact shape: `{"schemaVersion":1,"type":"product-image-migration-backup","manifestSha256":"<reviewed manifest file digest>","records":[{"productId":"...","image":"...","gallery":["..."]}]}`. Create and encrypt this file outside the repository; do not commit it.
2. Freeze the reviewed dry-run manifest alongside the encrypted backup. Record the SHA-256 of the manifest file. Before doing any Storage or database write, the apply tool validates every manifest mapping and every backup image's hash, format, byte count, and dimensions against that exact manifest.
3. The apply command is deliberately hard to invoke and is not approved for use yet. It requires all of: `--apply`, an explicit manifest path, a separately prepared backup path, the exact manifest-file SHA-256 in `--confirm-manifest-sha256`, and `--confirm MIGRATE_PRODUCT_IMAGES`. It also defaults to ten-product transactions and limits a batch to 25. Do not run it until a change window has been approved.
4. It uploads each of the 123 content-addressed objects with `upsert: false`. A pre-existing object is downloaded and verified by MIME type, byte count, and SHA-256; a raced upload is verified rather than overwritten. No database references are updated until all required objects have been verified.
5. It updates only `Product.image` and `Product.gallery`, preserving gallery order and duplicate positions, in serializable transactions. Before every product update it requires the live values to be either the backed-up originals or exactly the expected migrated values. This makes reruns resumable and rejects a concurrent content edit rather than overwriting it. Partial upload failures leave no database updates; partial database failures leave verified, migration-owned objects and can be safely resumed.
6. Keep the encrypted backup and the old data URL values in it until independent storefront, admin, API, and browser verification is complete. Roll back in similarly guarded transactions by restoring the backup's `image` and `gallery` values; do not delete objects during rollback.
7. After an approved retention period, calculate references from the live `Product` table before removing only unreferenced paths below `products/migration/`. Never delete shared or referenced objects; produce a reviewed orphan report first.

No migration-tracking table is proposed: a durable versioned manifest plus secured backup is sufficient for this one-time, externally reviewed, idempotent migration. Resume state is derived from the live references, not a mutable tracking record. If operations require concurrent long-running runs or an audit trail beyond the manifest, present a tracking-table schema for approval first.

The guarded apply command is present for review only. Do not substitute an ad-hoc script, create the bucket, or run apply without explicit approval.
