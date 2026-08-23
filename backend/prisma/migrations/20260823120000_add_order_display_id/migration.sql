-- AlterTable: Add displayId column (auto-increment 6-digit order IDs)
ALTER TABLE "Order" ADD COLUMN "displayId" TEXT DEFAULT '';

-- Backfill existing orders with sequential displayIds ordered by createdAt
WITH numbered AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "createdAt" ASC) AS rn
  FROM "Order"
  WHERE "displayId" IS NULL OR "displayId" = ''
)
UPDATE "Order" o
SET "displayId" = LPAD(n.rn::TEXT, 6, '0')
FROM numbered n
WHERE o."id" = n."id";

-- Make NOT NULL
ALTER TABLE "Order" ALTER COLUMN "displayId" SET NOT NULL;

-- Add unique constraint
CREATE UNIQUE INDEX "Order_displayId_key" ON "Order"("displayId");
