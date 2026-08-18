import fetch from 'node-fetch';

async function testOrder() {
  // Get a product first
  const prodRes = await fetch('http://localhost:4000/api/products');
  const products = await prodRes.json();
  const product = products[0];

  const payload = {
    customerEmail: "test@example.com",
    customerPhone: "1234567890",
    customerFirstName: "Test",
    customerLastName: "User",
    customerAddress: "123 Test St",
    customerCity: "Test City",
    customerState: "TS",
    customerZip: "12345",
    subtotal: 100,
    shipping: 15,
    total: 115,
    items: [
      {
        productId: product.id,
        quantity: 1,
        price: product.price,
        customImageUrl: null
      }
    ]
  };

  const res = await fetch('http://localhost:4000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", data);
}

testOrder();
