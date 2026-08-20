ALTER TABLE "Order"
ADD COLUMN "addressNickname" TEXT NOT NULL DEFAULT 'Other';

CREATE TABLE "SavedAddress" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "nickname" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "zip" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SavedAddress_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "SavedAddress_email_idx" ON "SavedAddress"("email");
