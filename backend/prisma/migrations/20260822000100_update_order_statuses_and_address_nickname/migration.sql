ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "addressNickname" TEXT NOT NULL DEFAULT 'Other';

ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;

ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";

CREATE TYPE "OrderStatus" AS ENUM (
  'LIVE',
  'MANIFESTED',
  'SHIPPED',
  'DD',
  'DELIVER',
  'RTO',
  'CANCELLED',
  'SHIP_LATER'
);

ALTER TABLE "Order"
  ALTER COLUMN "status" TYPE "OrderStatus"
  USING CASE "status"::text
    WHEN 'PENDING' THEN 'LIVE'::"OrderStatus"
    WHEN 'PROCESSING' THEN 'LIVE'::"OrderStatus"
    WHEN 'COMPLETED' THEN 'DELIVER'::"OrderStatus"
    WHEN 'CANCELLED' THEN 'CANCELLED'::"OrderStatus"
    WHEN 'LIVE' THEN 'LIVE'::"OrderStatus"
    WHEN 'MANIFESTED' THEN 'MANIFESTED'::"OrderStatus"
    WHEN 'SHIPPED' THEN 'SHIPPED'::"OrderStatus"
    WHEN 'DD' THEN 'DD'::"OrderStatus"
    WHEN 'DELIVER' THEN 'DELIVER'::"OrderStatus"
    WHEN 'RTO' THEN 'RTO'::"OrderStatus"
    WHEN 'SHIP_LATER' THEN 'SHIP_LATER'::"OrderStatus"
    ELSE 'LIVE'::"OrderStatus"
  END;

ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'LIVE';

DROP TYPE "OrderStatus_old";
