ALTER TABLE "Product"
  ADD COLUMN IF NOT EXISTS "reviews" INTEGER NOT NULL DEFAULT 0;

UPDATE "Product"
SET "reviews" = CASE "id"
  WHEN 'ghibli-art-tote' THEN 142
  WHEN 'ghibli-text-tote' THEN 215
  WHEN 'emoji-ghibli-tote' THEN 89
  WHEN 'polaroid-tote' THEN 34
  WHEN 'any-design-tote' THEN 76
  ELSE "reviews"
END
WHERE "reviews" = 0
  AND "id" IN ('ghibli-art-tote', 'ghibli-text-tote', 'emoji-ghibli-tote', 'polaroid-tote', 'any-design-tote');
