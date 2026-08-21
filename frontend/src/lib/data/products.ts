export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  isCustomizable: boolean;
  label: "bestseller" | "new" | "premium";
  category: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "ghibli-art-tote",
    name: "CUSTOM GHIBLI ART TOTE BAG",
    description: `Get your favorite Ghibli art printed on a strong, high-quality canvas tote bag.
It is perfect for daily use, college, shopping, or as a gift for anime lovers.
The fabric is easy to wash and the beautiful print stays bright for a long time.
Carry this bag everywhere and show off a cute design that is made just for you.

Add size and approval on WhatsApp after placing orders.`,
    price: 499,
    oldPrice: 599,
    originalPrice: 599,
    image: "/images/product/W1.png",
    gallery: [
      "/images/product/W1.png",
      "/images/product/W2.png",
      "/images/product/W3.png",
      "/images/product/W4.png",
    ],
    isCustomizable: true,
    label: "bestseller",
    category: "image",
    rating: 4.8,
    reviews: 142
  },
  {
    id: "ghibli-text-tote",
    name: "CUSTOM GHIBLI TOTE BAG WITH TEXT",
    description: `Get your favorite Ghibli art and custom text printed on a strong canvas tote bag.
It is perfect for daily use, college, shopping, or as a gift for anime lovers.
The fabric is easy to wash and the beautiful print stays bright for a long time.
Add your own name or quote to make this cute bag totally unique to you.

Add size and approval on WhatsApp after placing orders.`,
    price: 599,
    oldPrice: 749,
    originalPrice: 749,
    image: "/images/product/W5.png",
    gallery: [
      "/images/product/W5.png",
      "/images/product/W6.png",
      "/images/product/W7.png",
      "/images/product/W8.png",
    ],
    isCustomizable: true,
    label: "bestseller",
    category: "image+text",
    rating: 4.9,
    reviews: 215
  },
  {
    id: "emoji-ghibli-tote",
    name: "CUTE EMOJI WITH GHIBLI TOTE",
    description: `Mix your favorite Ghibli art with cute emojis on a strong canvas tote bag.
It is perfect for daily use, college, shopping, or as a gift for anime lovers.
The fabric is easy to wash and the beautiful print stays bright for a long time.
Carry this bag everywhere and show off a fun design that is made just for you.

Add size and approval on WhatsApp after placing orders.`,
    price: 599,
    oldPrice: 719,
    originalPrice: 719,
    image: "/images/product/W9.png",
    gallery: [
      "/images/product/W9.png",
      "/images/product/W10.png",
      "/images/product/W11.png",
      "/images/product/W12.png",
    ],
    isCustomizable: true,
    label: "bestseller",
    category: "image+text",
    rating: 4.7,
    reviews: 89
  },
  {
    id: "polaroid-tote",
    name: "POLAROID TOTE BAG",
    description: `Print your own photos in a cool vintage Polaroid style on a strong canvas tote bag.
It is perfect for daily use, college, shopping, or gifting memories to loved ones.
The fabric is easy to wash and your photos will stay clear for a long time.
Carry this bag everywhere and keep your favorite moments close to you.

Add size and approval on WhatsApp after placing orders.`,
    price: 499,
    oldPrice: 599,
    originalPrice: 599,
    image: "/images/product/W13.png",
    gallery: [
      "/images/product/W13.png",
      "/images/product/W14.png",
      "/images/product/W15.png",
      "/images/product/W16.png",
    ],
    isCustomizable: true,
    label: "new",
    category: "image",
    rating: 5.0,
    reviews: 34
  },
  {
    id: "any-design-tote",
    name: "ANY DESIGN TOTE BAG",
    description: `Print absolutely any picture, design, or logo you want on a strong canvas tote bag.
It is perfect for daily use, college, small businesses, or a special custom gift.
The fabric is easy to wash and your custom print stays bright for a long time.
Carry this bag everywhere and wear a design that you created yourself.

Add size and approval on WhatsApp after placing orders.`,
    price: 499,
    oldPrice: 599,
    originalPrice: 599,
    image: "/images/product/W17.png",
    gallery: [
      "/images/product/W17.png",
      "/images/product/W18.png",
      "/images/product/W19.png",
      "/images/product/W20.png",
    ],
    isCustomizable: true,
    label: "new",
    category: "image",
    rating: 4.9,
    reviews: 76
  }
];
