"use strict";
/**
 * Reconcile failure-path test. Requires a backend running with a short
 * RECONCILE_STALE_MS / RECONCILE_INTERVAL_MS. Verifies that a PENDING order
 * whose payment never arrives (and a stale unpaid checkout) are cleaned up /
 * confirmed after the grace window.
 */
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { PrismaClient } = require("../node_modules/@prisma/client");

const prisma = new PrismaClient();
const BASE = process.argv[2] || "http://localhost:4030";
const WEBHOOK_SECRET = "totemood-local-webhook-secret";
const TEST_IMAGE = "data:image/png;base64,AAAA";

const createdOrders = [];

function readSecret() {
  const text = require("fs").readFileSync(`${__dirname}/../.env`, "utf8");
  return text.match(/^RAZORPAY_KEY_SECRET=(.*)$/m)[1].trim();
}

async function send(path, init) {
  const res = await fetch(`${BASE}${path}`, init);
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}
  return { res, data };
}

async function deletePendingCheckout(orderId) {
  await prisma.$executeRawUnsafe(`DELETE FROM "PendingCheckout" WHERE "id" = $1`, orderId);
}

async function deleteOrderIfExists(orderId) {
  const order = await prisma.order.findUnique({ where: { razorpayOrderId: orderId }, include: { items: true } });
  if (!order) return;
  for (const item of order.items) {
    await prisma.product.update({ where: { id: item.productId }, data: { inventoryCount: { increment: item.quantity } } });
  }
  await prisma.$executeRawUnsafe(`DELETE FROM "OrderItem" WHERE "orderId" = $1`, order.id);
  await prisma.order.delete({ where: { id: order.id } });
}

async function main() {
  const products = await (await fetch(`${BASE}/api/products`)).json();
  const product = products.find((p) => p.category === "image") || products[0];

  // Create an order + pending checkout, then build a PENDING order via verify
  const body = {
    customerEmail: `pipeline-reconcile-${Date.now()}@example.com`,
    customerPhone: "9876543210",
    customerFirstName: "Pipeline",
    customerLastName: "Reconcile",
    addressNickname: "Home",
    saveAddress: false,
    accountToken: null,
    customerAddress: "1 Test Lane",
    customerCity: "Mumbai",
    customerState: "Maharashtra",
    customerZip: "400001",
    paymentMethod: "prepaid",
    items: [
      { productId: product.id, quantity: 1, price: product.price, customImageUrl: TEST_IMAGE, customImageUrls: [TEST_IMAGE], customTexts: ["Probe"] },
    ],
  };
  const { data: orderResp } = await send("/api/checkout/razorpay-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const orderId = orderResp.razorpayOrderId;
  createdOrders.push(orderId);
  const fakePayment = `pay_reconcile_${Date.now()}`;
  const sig = crypto.createHmac("sha256", readSecret()).update(`${orderId}|${fakePayment}`).digest("hex");
  const { res, data } = await send("/api/checkout/verify-razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ razorpay_order_id: orderId, razorpay_payment_id: fakePayment, razorpay_signature: sig }),
  });
  assert.equal(res.status, 201, `verify expected 201, got ${res.status}`);
  assert.equal(data.order.paymentStatus, "pending", "order should be pending before reconcile");

  // Backdate both rows so reconcile treats them as stale
  const old = new Date(Date.now() - 5 * 60 * 1000);
  await prisma.$executeRawUnsafe(`UPDATE "PendingCheckout" SET "createdAt" = $2 WHERE "id" = $1`, orderId, old);
  await prisma.order.updateMany({
    where: { razorpayOrderId: orderId },
    data: { createdAt: old },
  });

  const beforeInv = (await prisma.product.findUnique({ where: { id: product.id } })).inventoryCount;

  // Wait for reconcile ticks (interval ~1.5s) + a margin for Razorpay lookup
  console.log("waiting for reconcile to sweep the stale pending order...");
  await new Promise((r) => setTimeout(r, 6000));

  const remainingOrders = await prisma.order.count({ where: { razorpayOrderId: orderId } });
  assert.equal(remainingOrders, 0, "reconcile should delete an unpaid pending order");

  const remainingCheckout = await prisma.$queryRawUnsafe(`SELECT count(*)::int AS c FROM "PendingCheckout" WHERE "id" = $1`, orderId);
  assert.equal(remainingCheckout[0].c, 0, "reconcile should delete the stale pending checkout");

  const afterInv = (await prisma.product.findUnique({ where: { id: product.id } })).inventoryCount;
  assert.equal(afterInv, beforeInv, "reconcile should restore reserved inventory");
  console.log("PASS reconcile deleted unpaid pending order + restored inventory");
}

main()
  .then(async () => {
    for (const id of createdOrders) {
      await deleteOrderIfExists(id);
      await deletePendingCheckout(id);
    }
    console.log("RECONCILE TEST PASSED");
    process.exit(0);
  })
  .catch(async (error) => {
    for (const id of createdOrders) {
      await deleteOrderIfExists(id);
      await deletePendingCheckout(id);
    }
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());