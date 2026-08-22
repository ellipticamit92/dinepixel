-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "menuId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "orderCount" INTEGER NOT NULL DEFAULT 1,
    "lastOrderAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Customer_menuId_idx" ON "Customer"("menuId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_menuId_phone_key" ON "Customer"("menuId", "phone");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
