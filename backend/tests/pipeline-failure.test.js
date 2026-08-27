"use strict";
/**
 * Pipeline failure-path tests. Exercises each failure point in the payment
 * pipeline against a local backend and verifies the resulting DB state.
 * Run locally only; creates disposable Razorpay orders and cleans up after.
 *
 * Usage: node tests/pipeline-failure.test.js [baseUrl]
 */
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { PrismaClient } = require("../node_modules/@prisma/client");

const prisma = new PrismaClient();
const BASE = process.argv[2] || "http://localhost:4010";
const WEBHOOK_SECRET = "totemood-local-webhook-secret";
const TEST_IMAGE = "data:image/png;base64,AAAA";

let product;
let failed = 0;
const createdOrders = [];

function hmac(secret, body) {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

async function send(path, init) {
  const res = await fetch(`${BASE}${path}`, init);
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch {}
  return { res, text, data };
}

async function createRazorpayOrder(paymentMethod) {
  const body = {
    customerEmail: `pipeline-fail-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@example.com`,
    customerPhone: "9876543210",
    customerFirstName: "Pipeline",
    customerLastName: "Fail",
    addressNickname: "Home",
    saveAddress: false,
    accountToken: null,
    customerAddress: "1 Test Lane",
    customerCity: "Mumbai",
    customerState: "Maharashtra",
    customerZip: "400001",
    paymentMethod,
    items: [
      {
        productId: product.id,
        quantity: 1,
        price: product.price,
        customImageUrl: TEST_IMAGE,
        customImageUrls: [TEST_IMAGE],
        customTexts: ["Probe"],
      },
    ],
  };
  const { res, data } = await send("/api/checkout/razorpay-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  assert.equal(res.status, 200, `razorpay-order expected 200, got ${res.status}: ${JSON.stringify(data)}`);
  return data.razorpayOrderId;
}

function orderBody(orderId, paymentId, status, amount) {
  return Buffer.from(
    JSON.stringify({
      event: status === "captured" ? "payment.captured" : "payment.failed",
      payload: { payment: { entity: { id: paymentId, order_id: orderId, status, amount } } },
    }),
    "utf8"
  );
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

async function deletePendingCheckout(orderId) {
  await prisma.$executeRawUnsafe(`DELETE FROM "PendingCheckout" WHERE "id" = $1`, orderId);
}

function webhook(res, entity, signature) {
  return send("/api/webhooks/razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-razorpay-signature": signature },
    body: entity,
  });
}

async function main() {
  const products = await (await fetch(`${BASE}/api/products`)).json();
  product = products.find((p) => p.category === "image") || products[0];

  // ---- 1. verify-razorpay input rejection --------------------------------
  const v1 = await send("/api/checkout/verify-razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ razorpay_order_id: "order_x", razorpay_payment_id: "pay_x" }),
  });
  assert.equal(v1.res.status, 400, "missing signature should 400");

  const v2 = await send("/api/checkout/verify-razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ razorpay_order_id: "order_x", razorpay_payment_id: "pay_x", razorpay_signature: "deadbeef" }),
  });
  assert.equal(v2.res.status, 400, "bad verify signature should 400");

  // ---- 2. webhook raw-input rejection ------------------------------------
  const w1 = await send("/api/webhooks/razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "",
  });
  assert.equal(w1.res.status, 400, "empty webhook body should 400");

  const fakeBody = orderBody("order_noexist", "pay_noexist", "captured", 100);
  const w2 = await webhook(fakeBody, fakeBody, hmac("wrong-secret", fakeBody));
  assert.equal(w2.res.status, 400, "bad webhook signature should 400");

  // ---- 3. verify cannot confirm capture -> PENDING order created ----------
  const orderIdA = await createRazorpayOrder("prepaid");
  createdOrders.push(orderIdA);
  const fakePayment = `pay_fake_${Date.now()}`;
  const sigForVerify = hmac(process.env.RZP_SECRET || readSecret(), `${orderIdA}|${fakePayment}`);
  const v3 = await send("/api/checkout/verify-razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ razorpay_order_id: orderIdA, razorpay_payment_id: fakePayment, razorpay_signature: sigForVerify }),
  });
  assert.equal(v3.res.status, 201, `pending verify expected 201, got ${v3.res.status}`);
  assert.equal(v3.data.pending, true, "unconfirmed verify should return pending flag");
  assert.equal(v3.data.order.paymentStatus, "pending", "order should be created as pending");
  assert.equal(v3.data.order.razorpayPaymentId, fakePayment, "pending order must keep the payment id");

  const pendingInDb = await prisma.order.findUnique({ where: { razorpayOrderId: orderIdA } });
  assert.ok(pendingInDb && pendingInDb.paymentStatus === "pending", "pending order should exist in DB");
  console.log(`PASS pending order created for unconfirmed payment`);

  // ---- 4. duplicate pending verify is idempotent --------------------------
  const v3b = await send("/api/checkout/verify-razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ razorpay_order_id: orderIdA, razorpay_payment_id: fakePayment, razorpay_signature: sigForVerify }),
  });
  assert.equal(v3b.res.status, 201, "duplicate pending verify should still 201");
  const dupCount = await prisma.order.count({ where: { razorpayOrderId: orderIdA } });
  assert.equal(dupCount, 1, "duplicate verify must not create a second order");

  // ---- 5. captured webhook upgrades pending order (idempotent) ------------
  const payNowA = product.price * 100;
  const capBody = orderBody(orderIdA, fakePayment, "captured", payNowA);
  const capSig = hmac(WEBHOOK_SECRET, capBody);
  const whCap = await webhook(capBody, capBody, capSig);
  assert.equal(whCap.res.status, 200, "captured webhook should 200");

  const upgraded = await prisma.order.findUnique({ where: { razorpayOrderId: orderIdA } });
  assert.ok(upgraded, "order should still exist");
  assert.equal(upgraded.paymentStatus, "paid", "pending order should be upgraded to paid");
  assert.equal(upgraded.paidAmount, product.price, "paid amount should be full price");
  assert.equal(upgraded.codBalance, 0, "no COD balance for prepaid");

  // repeat webhook -> still one order
  const whCap2 = await webhook(capBody, capBody, capSig);
  assert.equal(whCap2.res.status, 200, "duplicate captured webhook should 200");
  const afterDup = await prisma.order.count({ where: { razorpayOrderId: orderIdA } });
  assert.equal(afterDup, 1, "duplicate captured webhook must not duplicate order");
  console.log(`PASS captured webhook upgraded pending order (idempotent)`);

  // ---- 6. failed webhook deletes pending order + restores inventory -------
  const orderIdB = await createRazorpayOrder("prepaid");
  createdOrders.push(orderIdB);
  const beforeInv = (await prisma.product.findUnique({ where: { id: product.id } })).inventoryCount;
  const sigB = hmac(process.env.RZP_SECRET || readSecret(), `${orderIdB}|pay_fake_b`);
  const vB = await send("/api/checkout/verify-razorpay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ razorpay_order_id: orderIdB, razorpay_payment_id: "pay_fake_b", razorpay_signature: sigB }),
  });
  assert.equal(vB.res.status, 201, "verify for failed-payment test should 201");
  assert.equal(vB.data.order.paymentStatus, "pending", "should be pending before failed webhook");
  const invAfterPending = (await prisma.product.findUnique({ where: { id: product.id } })).inventoryCount;
  assert.equal(invAfterPending, beforeInv - 1, "pending order should reserve one unit");

  const failBody = orderBody(orderIdB, "pay_fake_b", "failed", 0);
  const failSig = hmac(WEBHOOK_SECRET, failBody);
  const whFail = await webhook(failBody, failBody, failSig);
  assert.equal(whFail.res.status, 200, "failed webhook should 200");

  const gone = await prisma.order.count({ where: { razorpayOrderId: orderIdB } });
  assert.equal(gone, 0, "failed payment must delete the order");
  const invRestored = (await prisma.product.findUnique({ where: { id: product.id } })).inventoryCount;
  assert.equal(invRestored, beforeInv, "inventory must be restored after order deletion");
  const checkoutGone = await prisma.$queryRawUnsafe(`SELECT count(*)::int AS c FROM "PendingCheckout" WHERE "id" = $1`, orderIdB);
  assert.equal(checkoutGone[0].c, 0, "pending checkout should be deleted for failed payment");
  console.log(`PASS failed webhook deleted order + restored inventory`);
}

function readSecret() {
  const text = require("fs").readFileSync(`${__dirname}/../.env`, "utf8");
  const match = text.match(/^RAZORPAY_KEY_SECRET=(.*)$/m);
  if (!match) throw new Error("RAZORPAY_KEY_SECRET missing from backend/.env");
  return match[1].trim();
}

main()
  .then(async () => {
    for (const id of createdOrders) {
      await deleteOrderIfExists(id);
      await deletePendingCheckout(id);
    }
    console.log(failed === 0 ? "ALL PIPELINE FAILURE-PATH TESTS PASSED" : `${failed} ASSERTION GROUP(S) FAILED`);
    process.exit(failed === 0 ? 0 : 1);
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