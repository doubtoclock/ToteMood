ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "gallery" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

UPDATE "Product"
SET "gallery" = ARRAY["image"]
WHERE cardinality("gallery") = 0 AND COALESCE("image", '') <> '';

UPDATE "Product" SET "gallery" = ARRAY['/images/product/W1.png', '/images/product/W2.png', '/images/product/W3.png', '/images/product/W4.png', '/images/size.jpeg'] WHERE "id" = 'ghibli-art-tote';
UPDATE "Product" SET "gallery" = ARRAY['/images/product/W5.png', '/images/product/W6.png', '/images/product/W7.png', '/images/product/W8.png', '/images/size.jpeg'] WHERE "id" = 'ghibli-text-tote';
UPDATE "Product" SET "gallery" = ARRAY['/images/product/W9.png', '/images/product/W10.png', '/images/product/W11.png', '/images/product/W12.png', '/images/size.jpeg'] WHERE "id" = 'emoji-ghibli-tote';
UPDATE "Product" SET "gallery" = ARRAY['/images/product/W13.png', '/images/product/W14.png', '/images/product/W15.png', '/images/product/W16.png', '/images/size.jpeg'] WHERE "id" = 'polaroid-tote';
UPDATE "Product" SET "gallery" = ARRAY['/images/product/W17.png', '/images/product/W18.png', '/images/product/W19.png', '/images/product/W20.png', '/images/size.jpeg'] WHERE "id" = 'any-design-tote';
