ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "label" TEXT NOT NULL DEFAULT 'new';

UPDATE "Product"
SET "label" = lower("category")
WHERE lower("category") IN ('bestseller', 'new', 'premium');

UPDATE "Product"
SET "category" = CASE
  WHEN lower("category") = 'no customization' OR "isCustomizable" = false THEN 'no customization'
  WHEN lower("category") = 'image + text' OR lower("category") = 'image+text' THEN 'image+text'
  WHEN lower("name") LIKE '%text%' OR lower("name") LIKE '%emoji%' OR lower("description") LIKE '%text%' THEN 'image+text'
  ELSE 'image'
END;

UPDATE "Product" SET "isCustomizable" = "category" <> 'no customization';

ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "customText" TEXT;
