CREATE TABLE "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "coverImage" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProductCategory" (
  "productId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId", "categoryId")
);

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE INDEX "Category_createdAt_idx" ON "Category"("createdAt");
CREATE INDEX "ProductCategory_categoryId_idx" ON "ProductCategory"("categoryId");

ALTER TABLE "ProductCategory"
  ADD CONSTRAINT "ProductCategory_productId_fkey"
  FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProductCategory"
  ADD CONSTRAINT "ProductCategory_categoryId_fkey"
  FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
