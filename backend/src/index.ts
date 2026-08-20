import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server } from 'socket.io';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const GOKWIK_APP_ID = process.env.GOKWIK_APP_ID || '';
const GOKWIK_APP_SECRET = process.env.GOKWIK_APP_SECRET || '';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Log GoKwik incoming requests for debugging
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.path.startsWith('/gokwik/')) {
    console.log(`[GoKwik] ${req.method} ${req.path}`, JSON.stringify(req.body).slice(0, 200));
  }
  next();
});

// Initialize clients
const prisma = new PrismaClient();

// Setup Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected via WebSocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- In-Memory Cart Session Store ---
// GoKwik calls our backend with a session_key to fetch cart data.
// The frontend creates a session and populates it before calling GoKwik SDK.
interface CartSessionData {
  items: any[];
  totals: {
    subtotal: number;
    shipping_total: number;
    total: number;
  };
  customer: Record<string, any>;
  createdAt: number;
}

const cartSessions = new Map<string, CartSessionData>();

// Cleanup stale sessions every 30 minutes
setInterval(() => {
  const now = Date.now();
  const THIRTY_MIN = 30 * 60 * 1000;
  for (const [key, session] of cartSessions) {
    if (now - session.createdAt > THIRTY_MIN) {
      cartSessions.delete(key);
    }
  }
}, 30 * 60 * 1000);

// --- GoKwik Auth Middleware ---
// GoKwik sends gk-app-id and gk-app-secret headers on all cart/order API calls.
function gokwikAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const appId = req.headers['gk-app-id'] || req.headers['app-id'];
  const appSecret = req.headers['gk-app-secret'] || req.headers['app-secret'];

  if (!appId || !appSecret) {
    return res.status(401).json({ message: 'Missing GoKwik authentication headers' });
  }

  if (appId !== GOKWIK_APP_ID || appSecret !== GOKWIK_APP_SECRET) {
    return res.status(403).json({ message: 'Invalid GoKwik credentials' });
  }

  next();
}

// --- Routes ---

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// --- Frontend Checkout Session Route ---
// The frontend calls this to create a cart session before initializing GoKwik SDK.
app.post('/api/checkout/session', async (req, res) => {
  try {
    const { items, subtotal, shipping, total } = req.body;

    const sessionId = 'sess_' + crypto.randomBytes(16).toString('hex');

    cartSessions.set(sessionId, {
      items: items || [],
      totals: {
        subtotal: subtotal || 0,
        shipping_total: shipping || 0,
        total: total || 0,
      },
      customer: {},
      createdAt: Date.now(),
    });

    console.log(`Created checkout session ${sessionId} with ${(items || []).length} items`);

    res.json({ success: true, sessionId });
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// --- GoKwik Cart API Endpoints ---
// GoKwik servers call these endpoints to interact with our store.

// 1. Get Cart - GoKwik fetches cart data using session_key
app.post('/gokwik/v1/cart', gokwikAuthMiddleware, async (req, res) => {
  try {
    const sessionKey = req.body.session_key || req.query.session_key;

    if (!sessionKey) {
      return res.status(400).json({ message: 'session_key is required' });
    }

    const session = cartSessions.get(sessionKey);

    if (!session) {
      return res.status(404).json({ message: 'Cart session not found' });
    }

    // Fetch product details from DB for accurate data
    const productIds = session.items.map((item: any) => item.id || item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    const productMap = new Map(products.map(p => [p.id, p]));

    const cartItems = session.items.map((item: any) => {
      const product = productMap.get(item.id || item.productId);
      return {
        product_id: item.id || item.productId,
        name: product?.name || item.name || 'Product',
        quantity: item.quantity || 1,
        price: product?.price || item.price || 0,
        image: product?.image || item.image || '',
        is_customizable: product?.isCustomizable || false,
        custom_image_url: item.customImageUrl || null,
      };
    });

    res.json({
      items: cartItems,
      totals: session.totals,
      coupon_applied: [],
      chosen_shipping_method: [],
      shipping_methods: [
        {
          method_id: 'flat_rate',
          rate_id: 'flat_rate',
          method_name: 'Standard Shipping',
          charge: session.totals.shipping_total,
          tax_cost: 0,
        }
      ],
    });
  } catch (error) {
    console.error('GoKwik getCart error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 2. Set Address - GoKwik saves customer address during checkout
app.post('/gokwik/v1/cart/set-address', gokwikAuthMiddleware, (req, res) => {
  try {
    const sessionKey = req.body.session_key || req.query.session_key;
    const session = cartSessions.get(sessionKey);

    if (!session) {
      return res.status(404).json({ message: 'Cart session not found' });
    }

    session.customer = {
      ...session.customer,
      first_name: req.body.first_name || '',
      last_name: req.body.last_name || '',
      email: req.body.email || '',
      phone: req.body.phone || '',
      address_1: req.body.address_1 || '',
      city: req.body.city || '',
      state: req.body.state || '',
      postcode: req.body.postcode || '',
      country: req.body.country || 'IN',
    };

    res.json({ message: 'Address updated', cart: { items: session.items, totals: session.totals } });
  } catch (error) {
    console.error('GoKwik setAddress error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 3. Get Coupons
app.post('/gokwik/v1/cart/get-coupons', gokwikAuthMiddleware, (_req, res) => {
  res.json({ coupons: [] });
});

// 4. Apply Coupon
app.post('/gokwik/v1/cart/apply-coupon', gokwikAuthMiddleware, (_req, res) => {
  res.json({ message: 'No coupons available', cart: {} });
});

// 5. Remove Coupon
app.post('/gokwik/v1/cart/remove-coupon', gokwikAuthMiddleware, (_req, res) => {
  res.json({ message: 'No coupons to remove', cart: {} });
});

// 6. Set Shipping Method
app.post('/gokwik/v1/cart/set-shipping-method', gokwikAuthMiddleware, (req, res) => {
  try {
    const sessionKey = req.body.session_key || req.query.session_key;
    const session = cartSessions.get(sessionKey);
    if (!session) {
      return res.status(404).json({ message: 'Cart session not found' });
    }
    res.json({ message: 'Shipping method set', cart: { items: session.items, totals: session.totals } });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 7. Place Order - GoKwik calls this after successful payment
app.post('/gokwik/v1/cart/place-order', gokwikAuthMiddleware, async (req, res) => {
  try {
    const sessionKey = req.body.session_key;
    const billing = req.body.billing || {};
    const shipping = req.body.shipping || {};
    const paymentMethod = req.body.payment_method || 'gokwik_prepaid';
    const orderTotal = parseFloat(req.body.order_total) || 0;
    const transactionId = req.body.transaction_id || null;

    console.log('GoKwik place-order called:', { sessionKey, paymentMethod, orderTotal });

    const session = cartSessions.get(sessionKey);
    if (!session) {
      console.error('GoKwik place-order: session not found:', sessionKey);
      return res.status(400).json({ message: 'Cart session not found' });
    }

    // Build order items from session
    const orderItems = session.items.map((item: any) => ({
      productId: item.id || item.productId,
      quantity: item.quantity || 1,
      priceAtPurchase: item.price || 0,
      customImageUrl: item.customImageUrl || null,
    }));

    // Create order in Prisma
    const newOrder = await prisma.order.create({
      data: {
        gokwikOrderId: req.body.gokwik_order_id || `gk_${Date.now()}`,
        customerFirstName: billing.first_name || session.customer.first_name || 'Customer',
        customerLastName: billing.last_name || session.customer.last_name || '',
        customerEmail: billing.email || session.customer.email || 'customer@example.com',
        customerPhone: billing.phone || session.customer.phone || '9999999999',
        customerAddress: billing.address_1 || session.customer.address_1 || '123 Main St',
        customerCity: billing.city || session.customer.city || 'Mumbai',
        customerState: billing.state || session.customer.state || 'MH',
        customerZip: billing.postcode || session.customer.postcode || '400001',
        subtotal: session.totals.subtotal,
        shipping: session.totals.shipping_total,
        total: orderTotal || session.totals.total,
        status: paymentMethod === 'cod' ? 'PENDING' : 'PROCESSING',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Clean up session
    cartSessions.delete(sessionKey);

    // Notify admin panel via WebSocket
    io.emit('new_order', newOrder);

    console.log('GoKwik order created:', newOrder.id);

    // GoKwik expects the WooCommerce-compatible response format
    res.json({
      status: 'success',
      order_id: newOrder.id,
      redirect_url: null,
    });
  } catch (error) {
    console.error('GoKwik place-order error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

// 8. Update Order Status - GoKwik calls this for status sync
app.post('/gokwik/v1/cart/update-order-status', gokwikAuthMiddleware, async (req, res) => {
  try {
    const merchantOrderId = req.body.merchant_order_id;
    const orderStatus = req.body.order_status;

    if (!merchantOrderId) {
      return res.status(400).json({ message: 'merchant_order_id is required' });
    }

    // Map GoKwik statuses to our OrderStatus enum
    const statusMap: Record<string, string> = {
      'pending': 'PENDING',
      'processing': 'PROCESSING',
      'completed': 'COMPLETED',
      'cancelled': 'CANCELLED',
      'delivered': 'COMPLETED',
    };

    const mappedStatus = statusMap[orderStatus?.toLowerCase()] || 'PENDING';

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: merchantOrderId },
          { gokwikOrderId: merchantOrderId },
        ],
      },
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: mappedStatus as any },
      include: { items: { include: { product: true } } },
    });

    io.emit('order_updated', updatedOrder);

    res.json({ status: 'success', order_id: updatedOrder.id });
  } catch (error) {
    console.error('GoKwik update-order-status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 9. Payment Notification Webhook - GoKwik sends payment status updates here after payment
app.post('/gokwik/v1/payment-notification', gokwikAuthMiddleware, async (req: Request, res: Response) => {
  try {
    console.log('[GoKwik] Payment notification received:', JSON.stringify(req.body).slice(0, 500));

    const {
      gokwik_order_id,
      merchant_order_id,
      order_id,
      payment_status,
      payment_method,
      transaction_id,
      amount,
      status,
    } = req.body;

    const orderId = merchant_order_id || order_id;
    const gokwikId = gokwik_order_id;
    const paymentStatus = (payment_status || status || '').toString().toLowerCase();

    if (!orderId && !gokwikId) {
      console.error('[GoKwik] Payment notification: no order identifier provided');
      return res.status(400).json({ message: 'order_id or gokwik_order_id is required' });
    }

    // Find the order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          orderId ? { id: orderId } : { id: '__none__' },
          gokwikId ? { gokwikOrderId: gokwikId } : { id: '__none__' },
        ],
      },
    });

    if (!order) {
      console.error('[GoKwik] Payment notification: order not found for', { orderId, gokwikId });
      return res.status(404).json({ message: 'Order not found' });
    }

    // Map GoKwik payment statuses to our OrderStatus
    const statusMap: Record<string, string> = {
      'success': 'PROCESSING',
      'completed': 'PROCESSING',
      'paid': 'PROCESSING',
      'captured': 'PROCESSING',
      'pending': 'PENDING',
      'processing': 'PROCESSING',
      'failed': 'CANCELLED',
      'cancelled': 'CANCELLED',
      'canceled': 'CANCELLED',
      'refunded': 'CANCELLED',
      'expired': 'CANCELLED',
    };

    const mappedStatus = statusMap[paymentStatus] || order.status;

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: mappedStatus as any,
        gokwikOrderId: order.gokwikOrderId || gokwikId || undefined,
      },
      include: { items: { include: { product: true } } },
    });

    io.emit('order_updated', updatedOrder);

    console.log(`[GoKwik] Payment notification processed: order ${order.id} -> ${mappedStatus}`);

    res.json({ status: 'success', order_id: order.id });
  } catch (error) {
    console.error('[GoKwik] Payment notification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 10. Health Check for GoKwik
app.post('/gokwik/v1/cart/health-check', gokwikAuthMiddleware, (_req, res) => {
  res.json({ status: 'ok' });
});

// 10. Check Order Exists
app.post('/gokwik/v1/cart/check-order-exists', gokwikAuthMiddleware, async (req, res) => {
  try {
    const merchantOrderId = req.body.merchant_order_id;
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: merchantOrderId },
          { gokwikOrderId: merchantOrderId },
        ],
      },
    });
    res.json({ exists: !!order, order_id: order?.id || null });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 11. Remove Out of Stock Items
app.post('/gokwik/v1/cart/remove-out-of-stock-items', gokwikAuthMiddleware, (_req, res) => {
  res.json({ removed_items: [] });
});

// --- Product Routes ---

app.get('/api/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const data = req.body;
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description || '',
        price: data.price,
        oldPrice: data.oldPrice || null,
        image: data.image,
        isCustomizable: data.isCustomizable || false,
        category: data.category,
        inventoryCount: data.inventoryCount || 0,
      }
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const data = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        description: data.description || '',
        price: data.price,
        oldPrice: data.oldPrice || null,
        image: data.image,
        isCustomizable: data.isCustomizable || false,
        category: data.category,
        inventoryCount: data.inventoryCount || 0,
      }
    });
    res.json(product);
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// --- Order Routes ---

app.get('/api/orders', async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const data = req.body;
    const order = await prisma.order.create({
      data: {
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        customerFirstName: data.customerFirstName,
        customerLastName: data.customerLastName,
        customerAddress: data.customerAddress,
        customerCity: data.customerCity,
        customerState: data.customerState,
        customerZip: data.customerZip,
        subtotal: data.subtotal,
        shipping: data.shipping,
        total: data.total,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.price,
            customImageUrl: item.customImageUrl || null
          }))
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    io.emit("new_order", order);
    res.status(201).json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    io.emit("order_updated", order);
    res.json(order);
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await prisma.orderItem.deleteMany({ where: { orderId: req.params.id } });
    await prisma.order.delete({ where: { id: req.params.id } });

    io.emit("order_deleted", req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Start Server
httpServer.listen(port, () => {
  console.log(`Backend server running on port ${port} with Socket.IO enabled`);
  console.log(`GoKwik environment: ${process.env.GOKWIK_ENV || 'not set'}`);
});
