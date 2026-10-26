-- Payment persistence formerly relied on application-startup DDL. Keep this
-- migration additive and idempotent so it can be reviewed and deployed with
-- `prisma migrate deploy`; do not run it against production without checking
-- the existing schema first.
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "razorpayOrderId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "razorpayPaymentId" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "codBalance" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT NOT NULL DEFAULT 'pending';

CREATE UNIQUE INDEX IF NOT EXISTS "Order_razorpayPaymentId_key"
  ON "Order"("razorpayPaymentId") WHERE "razorpayPaymentId" IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS "Order_razorpayOrderId_key"
  ON "Order"("razorpayOrderId") WHERE "razorpayOrderId" IS NOT NULL;

CREATE TABLE IF NOT EXISTS "PendingCheckout" (
  "id" TEXT NOT NULL,
  "data" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "processedAt" TIMESTAMP(3),
  CONSTRAINT "PendingCheckout_pkey" PRIMARY KEY ("id")
);

-- Earlier runtime DDL created JSONB. If an older local schema instead has a
-- TEXT payload, convert it explicitly. SQL NULL becomes the JSON `null`
-- value so the required Prisma field remains non-null; valid JSON strings and
-- objects are preserved exactly. Invalid non-JSON text aborts safely rather
-- than discarding a checkout record.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'PendingCheckout'
      AND column_name = 'data' AND data_type <> 'jsonb'
  ) THEN
    ALTER TABLE "PendingCheckout"
      ALTER COLUMN "data" TYPE JSONB USING COALESCE("data"::jsonb, 'null'::jsonb);
  END IF;
END $$;

UPDATE "PendingCheckout" SET "data" = 'null'::jsonb WHERE "data" IS NULL;
ALTER TABLE "PendingCheckout" ALTER COLUMN "data" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "PendingCheckout_createdAt_idx" ON "PendingCheckout"("createdAt");
