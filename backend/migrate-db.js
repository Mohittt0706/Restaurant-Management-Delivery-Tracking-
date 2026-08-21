const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addColumn(table, column, type, def) {
  try {
    const defaultClause = def ? ` DEFAULT ${def}` : '';
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "${column}" ${type}${defaultClause}`
    );
    console.log(`  + ${table}.${column}`);
  } catch (e) {
    console.log(`  ! ${table}.${column}: ${e.message.substring(0, 80)}`);
  }
}

async function main() {
  console.log('Adding missing columns to match Prisma schema...\n');

  // Category: missing 'image'
  console.log('Category:');
  await addColumn('Category', 'image', 'TEXT');

  // MenuItem: missing 'availability', 'preparationTime'
  console.log('MenuItem:');
  await addColumn('MenuItem', 'availability', 'BOOLEAN', 'true');
  await addColumn('MenuItem', 'preparationTime', 'INTEGER');

  // Cart: need unique on userId
  console.log('Cart:');
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Cart" ADD CONSTRAINT IF NOT EXISTS "Cart_userId_key" UNIQUE ("userId")'
    );
    console.log('  + Cart.userId unique constraint');
  } catch (e) {
    console.log(`  ! Cart.userId unique: ${e.message.substring(0, 80)}`);
  }

  // CartItem: missing 'notes'
  console.log('CartItem:');
  await addColumn('CartItem', 'notes', 'TEXT');

  // Order: add all Prisma-required columns
  console.log('Order:');
  await addColumn('Order', 'userId', 'TEXT');
  await addColumn('Order', 'orderNumber', 'TEXT');
  await addColumn('Order', 'status', "TEXT DEFAULT 'PLACED'");
  await addColumn('Order', 'totalAmount', 'DOUBLE PRECISION', '0');
  await addColumn('Order', 'deliveryAddressId', 'TEXT');
  await addColumn('Order', 'addressText', 'TEXT');
  await addColumn('Order', 'notes', 'TEXT');
  await addColumn('Order', 'preparationStartedAt', 'TIMESTAMP');
  await addColumn('Order', 'preparationCompletedAt', 'TIMESTAMP');

  // Migrate existing Order data
  console.log('  Migrating Order data...');
  try {
    await prisma.$executeRawUnsafe(
      'UPDATE "Order" SET "totalAmount" = "amount" WHERE "totalAmount" = 0 AND "amount" IS NOT NULL'
    );
    await prisma.$executeRawUnsafe(
      'UPDATE "Order" SET "status" = "orderStatus"::text WHERE "status" = \'PLACED\' AND "orderStatus" IS NOT NULL'
    );
    await prisma.$executeRawUnsafe(
      'UPDATE "Order" SET "addressText" = "address" WHERE "addressText" IS NULL AND "address" IS NOT NULL'
    );
    console.log('  + Order data migrated');
  } catch (e) {
    console.log(`  ! Order data migration: ${e.message.substring(0, 80)}`);
  }

  // Add foreign key for Order.userId -> User.id (only if userId has data)
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE'
    );
    console.log('  + Order.userId foreign key');
  } catch (e) {
    console.log(`  ! Order.userId FK: ${e.message.substring(0, 80)}`);
  }

  // Add unique constraint on Order.orderNumber
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Order" ADD CONSTRAINT "Order_orderNumber_key" UNIQUE ("orderNumber")'
    );
    console.log('  + Order.orderNumber unique');
  } catch (e) {
    console.log(`  ! Order.orderNumber unique: ${e.message.substring(0, 80)}`);
  }

  // OrderStatusHistory: missing 'changedByUserId', 'createdAt'
  console.log('OrderStatusHistory:');
  await addColumn('OrderStatusHistory', 'changedByUserId', 'TEXT');
  await addColumn('OrderStatusHistory', 'createdAt', "TIMESTAMP DEFAULT NOW()");
  try {
    await prisma.$executeRawUnsafe(
      'UPDATE "OrderStatusHistory" SET "createdAt" = "changedAt" WHERE "createdAt" IS NULL OR "createdAt" = \'1970-01-01T00:00:00\''
    );
    await prisma.$executeRawUnsafe(
      'UPDATE "OrderStatusHistory" SET "changedByUserId" = "changedBy" WHERE "changedByUserId" IS NULL'
    );
    console.log('  + OrderStatusHistory data migrated');
  } catch (e) {
    console.log(`  ! OrderStatusHistory migration: ${e.message.substring(0, 80)}`);
  }

  // Payment: missing 'provider'
  console.log('Payment:');
  await addColumn('Payment', 'provider', 'TEXT');

  // Invoice: add Prisma-required columns
  console.log('Invoice:');
  await addColumn('Invoice', 'invoiceNumber', 'TEXT');
  await addColumn('Invoice', 'subtotal', 'DOUBLE PRECISION', '0');
  await addColumn('Invoice', 'tax', 'DOUBLE PRECISION', '0');
  await addColumn('Invoice', 'deliveryFee', 'DOUBLE PRECISION', '0');
  await addColumn('Invoice', 'totalAmount', 'DOUBLE PRECISION', '0');
  await addColumn('Invoice', 'pdfPath', 'TEXT');
  try {
    await prisma.$executeRawUnsafe(
      'UPDATE "Invoice" SET "totalAmount" = "amount" WHERE "totalAmount" = 0 AND "amount" IS NOT NULL'
    );
    await prisma.$executeRawUnsafe(
      'UPDATE "Invoice" SET "subtotal" = "amount" WHERE "subtotal" = 0 AND "amount" IS NOT NULL'
    );
    console.log('  + Invoice data migrated');
  } catch (e) {
    console.log(`  ! Invoice migration: ${e.message.substring(0, 80)}`);
  }

  // Add unique constraints for Invoice
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_key" UNIQUE ("orderId")'
    );
    console.log('  + Invoice.orderId unique');
  } catch (e) {
    console.log(`  ! Invoice.orderId unique: ${e.message.substring(0, 80)}`);
  }
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_invoiceNumber_key" UNIQUE ("invoiceNumber")'
    );
    console.log('  + Invoice.invoiceNumber unique');
  } catch (e) {
    console.log(`  ! Invoice.invoiceNumber unique: ${e.message.substring(0, 80)}`);
  }

  // InventoryItem: missing 'isActive'
  console.log('InventoryItem:');
  await addColumn('InventoryItem', 'isActive', 'BOOLEAN', 'true');

  // Delivery: add missing columns, fix column names
  console.log('Delivery:');
  await addColumn('Delivery', 'deliveryPartnerId', 'TEXT');
  await addColumn('Delivery', 'estimatedDistance', 'DOUBLE PRECISION');
  await addColumn('Delivery', 'estimatedDuration', 'INTEGER');
  try {
    await prisma.$executeRawUnsafe(
      'UPDATE "Delivery" SET "deliveryPartnerId" = "partnerId" WHERE "deliveryPartnerId" IS NULL AND "partnerId" IS NOT NULL'
    );
    await prisma.$executeRawUnsafe(
      'UPDATE "Delivery" SET "estimatedDistance" = CAST("distance" AS DOUBLE PRECISION) WHERE "estimatedDistance" IS NULL AND "distance" IS NOT NULL'
    );
    await prisma.$executeRawUnsafe(
      'UPDATE "Delivery" SET "estimatedDuration" = CAST(NULLIF(regexp_replace("eta", \'[^0-9]\', \'\', \'g\'), \'\') AS INTEGER) WHERE "estimatedDuration" IS NULL AND "eta" IS NOT NULL'
    );
    console.log('  + Delivery data migrated');
  } catch (e) {
    console.log(`  ! Delivery migration: ${e.message.substring(0, 80)}`);
  }
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_orderId_key" UNIQUE ("orderId")'
    );
    console.log('  + Delivery.orderId unique');
  } catch (e) {
    console.log(`  ! Delivery.orderId unique: ${e.message.substring(0, 80)}`);
  }
  try {
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE'
    );
    console.log('  + Delivery.deliveryPartnerId foreign key');
  } catch (e) {
    console.log(`  ! Delivery.deliveryPartnerId FK: ${e.message.substring(0, 80)}`);
  }

  console.log('\nDone!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => { console.error(e); return prisma.$disconnect(); });
