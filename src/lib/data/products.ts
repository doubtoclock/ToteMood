export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isCustomizable: boolean;
  category: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "tote-classic-custom",
    name: "The Timeless Tote (Custom)",
    description: "Our signature tote featuring your custom artwork. Printed with fade-resistant inks on premium organic canvas.",
    price: 850.00,
    image: "/images/product_mockup.png",
    isCustomizable: true,
    category: "Custom Totes",
    rating: 4.9,
    reviews: 128
  },
  {
    id: "tote-mini-custom",
    name: "The Mini Tote (Custom)",
    description: "A compact version of our signature custom tote. Perfect for essentials and a bold personal statement.",
    price: 750.00,
    image: "/images/feature_premium_canvas.png",
    isCustomizable: true,
    category: "Custom Totes",
    rating: 4.8,
    reviews: 96
  },
  {
    id: "tote-weekend-custom",
    name: "The Weekender (Custom)",
    description: "Oversized and incredibly durable. Bring your favorite memories on all your weekend getaways.",
    price: 900.00,
    image: "/images/collection_weekend.png",
    isCustomizable: true,
    category: "Custom Totes",
    rating: 5.0,
    reviews: 64
  },
  {
    id: "tote-classic-plain",
    name: "The Classic Everyday",
    description: "A beautifully constructed, unprinted canvas tote. Minimalist, durable, and ready for daily use.",
    price: 700.00,
    image: "/images/collection_everyday.png",
    isCustomizable: false,
    category: "Essentials",
    rating: 4.7,
    reviews: 82
  },
  {
    id: "tote-leather-trim-custom",
    name: "Leather Trim Tote (Custom)",
    description: "Elevate your custom artwork with premium vegan leather straps and reinforced bottom.",
    price: 890.00,
    image: "/images/product_mockup.png",
    isCustomizable: true,
    category: "Premium Leather",
    rating: 4.9,
    reviews: 45
  },
  {
    id: "tote-market",
    name: "The Market Tote",
    description: "Lightweight, breathable mesh-lined tote designed specifically for farmers markets and quick errands.",
    price: 720.00,
    image: "/images/feature_photo_art.png",
    isCustomizable: false,
    category: "Essentials",
    rating: 4.6,
    reviews: 112
  },
  {
    id: "tote-artist-series-1",
    name: "Artist Series: Botanical",
    description: "A limited edition print featuring original botanical artwork by local artists.",
    price: 780.00,
    image: "/images/collection_weekend.png",
    isCustomizable: false,
    category: "Artist Series",
    rating: 5.0,
    reviews: 34
  },
  {
    id: "tote-artist-series-2",
    name: "Artist Series: Abstract City",
    description: "Geometric and bold. A limited edition print inspired by urban architecture.",
    price: 780.00,
    image: "/images/feature_premium_canvas.png",
    isCustomizable: false,
    category: "Artist Series",
    rating: 4.8,
    reviews: 56
  },
  {
    id: "tote-blackout-custom",
    name: "The Midnight Tote (Custom)",
    description: "A sleek, all-black heavy canvas tote. Your custom artwork printed in high-contrast vivid color.",
    price: 850.00,
    image: "/images/product_mockup.png",
    isCustomizable: true,
    category: "Custom Totes",
    rating: 4.9,
    reviews: 88
  },
  {
    id: "pouch-custom",
    name: "Companion Pouch (Custom)",
    description: "A small zipper pouch featuring your custom art. Perfect for organizing inside your larger tote.",
    price: 700.00,
    image: "/images/feature_photo_art.png",
    isCustomizable: true,
    category: "Accessories",
    rating: 4.7,
    reviews: 145
  },
  {
    id: "pouch-plain",
    name: "Companion Pouch (Natural)",
    description: "Unprinted canvas zipper pouch. Simple, durable, and highly functional.",
    price: 700.00,
    image: "/images/collection_everyday.png",
    isCustomizable: false,
    category: "Accessories",
    rating: 4.8,
    reviews: 210
  },
  {
    id: "tote-reversible",
    name: "The Reversible Tote",
    description: "Two looks in one. Natural canvas on one side, olive green on the other.",
    price: 820.00,
    image: "/images/collection_weekend.png",
    isCustomizable: false,
    category: "Premium Leather",
    rating: 4.9,
    reviews: 42
  },
  {
    id: "tote-heavy-duty-custom",
    name: "The Heavy Duty (Custom)",
    description: "Constructed with 24oz duck canvas. Built to carry everything, showcasing your art beautifully.",
    price: 880.00,
    image: "/images/product_mockup.png",
    isCustomizable: true,
    category: "Custom Totes",
    rating: 5.0,
    reviews: 73
  },
  {
    id: "strap-leather-upgrade",
    name: "Leather Strap Upgrade Kit",
    description: "Swap out your canvas straps for premium, aged leather straps.",
    price: 700.00,
    image: "/images/feature_premium_canvas.png",
    isCustomizable: false,
    category: "Accessories",
    rating: 4.7,
    reviews: 89
  },
  {
    id: "tote-gift-card",
    name: "ToteMood Gift Card",
    description: "Give the gift of a custom memory. Delivered instantly via email.",
    price: 750.00,
    image: "/images/collection_everyday.png",
    isCustomizable: false,
    category: "Gifts",
    rating: 5.0,
    reviews: 25
  }
];
