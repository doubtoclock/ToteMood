import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Initialize clients
const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Setup Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // allow frontend access
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on("connection", (socket) => {
  console.log("Client connected via WebSocket:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// --- Routes ---

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get Products
app.get('/api/products', async (req, res) => {
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

// Create Product
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

// Update Product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await prisma.product.update({
      where: { id },
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

// Delete Product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Note: If cascade isn't set, we might need to delete OrderItems first if we allow deleting products that have orders.
    // Assuming cascade is true or products with orders shouldn't be deleted.
    await prisma.product.delete({
      where: { id }
    });
    res.json({ success: true, id });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Get Orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
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

// Create Order
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
          include: {
            product: true
          }
        }
      }
    });

    // Emit live update
    io.emit("new_order", order);

    res.status(201).json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Update Order Status
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    // Emit live update
    io.emit("order_updated", order);

    res.json(order);
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Delete Order
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prisma cascade deletes order items if configured in schema.
    // Let's manually delete items first to be safe, if cascade isn't on.
    await prisma.orderItem.deleteMany({
      where: { orderId: id }
    });
    
    await prisma.order.delete({
      where: { id }
    });

    // Emit live update
    io.emit("order_deleted", id);

    res.json({ success: true, id });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Start Server
httpServer.listen(port, () => {
  console.log(`Backend server running on port ${port} with Socket.IO enabled`);
});
