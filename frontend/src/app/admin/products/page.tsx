"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, X, Upload } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [category, setCategory] = useState("Custom Totes");
  const [inventoryCount, setInventoryCount] = useState("0");
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [image, setImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = () => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setOldPrice("");
    setCategory("Custom Totes");
    setInventoryCount("0");
    setIsCustomizable(false);
    setImage("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setOldPrice(product.oldPrice ? product.oldPrice.toString() : "");
    setCategory(product.category);
    setInventoryCount(product.inventoryCount.toString());
    setIsCustomizable(product.isCustomizable);
    setImage(product.image);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name,
      description,
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      category,
      inventoryCount: parseInt(inventoryCount, 10),
      isCustomizable,
      image: image || "/images/product_mockup.png" // fallback
    };

    try {
      // If editingProduct exists, we would PUT, else POST. 
      // For now, our backend only has POST /api/products implemented for creation.
      // We will assume creation for this step, or implement PUT if needed.
      const res = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-[#5A5A55]">Loading products...</div>;
  }

  return (
    <div className="space-y-8 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#1C1C1A]">Products</h1>
          <p className="text-[#5A5A55] mt-2">Manage your catalog, prices, and inventory.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#1C1C1A] text-white px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-black transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white border border-[#1C1C1A]/10 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#1C1C1A]/10 bg-[#F8F6EF]/50">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Product</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Price</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Inventory</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55]">Customizable</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-[#5A5A55] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[#1C1C1A]/5 hover:bg-[#F8F6EF]/20 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative rounded-lg bg-[#EAECE3] overflow-hidden shrink-0 border border-[#1C1C1A]/5">
                      <Image src={product.image} alt={product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1C1C1A]">{product.name}</div>
                      <div className="text-xs text-[#5A5A55]">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1C1C1A]">₹{product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="text-xs text-[#5A5A55] line-through">₹{product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    product.inventoryCount > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inventoryCount} in stock
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    product.isCustomizable ? 'bg-[#757D5C]/20 text-[#757D5C]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.isCustomizable ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => openEditModal(product)}
                      className="p-2 text-[#5A5A55] hover:text-[#1C1C1A] hover:bg-[#F8F6EF] rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[#5A5A55]">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-[#1C1C1A]/10 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-serif text-[#1C1C1A]">{editingProduct ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#F8F6EF] rounded-full text-[#5A5A55]">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Product Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Category</label>
                    <input type="text" required value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Price (₹)</label>
                      <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Old Price (₹)</label>
                      <input type="number" step="0.01" value={oldPrice} onChange={e => setOldPrice(e.target.value)} placeholder="Optional" className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Inventory</label>
                      <input type="number" required value={inventoryCount} onChange={e => setInventoryCount(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                    </div>
                    <div className="flex-1 flex items-end pb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isCustomizable} onChange={e => setIsCustomizable(e.target.checked)} className="w-5 h-5 accent-[#757D5C]" />
                        <span className="text-sm font-bold text-[#1C1C1A]">Is Customizable?</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Product Image (URL)</label>
                    <div className="flex items-center gap-4">
                      {image ? (
                        <div className="w-24 h-24 relative rounded-xl border border-[#1C1C1A]/10 overflow-hidden bg-[#EAECE3]">
                          <Image src={image} alt="Preview" fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-xl border-2 border-dashed border-[#1C1C1A]/20 flex items-center justify-center text-[#5A5A55]">
                          <Upload className="w-6 h-6" />
                        </div>
                      )}
                      <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="/images/product_mockup.png" className="flex-1 bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-[#5A5A55] block mb-2">Description</label>
                    <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white border border-[#1C1C1A]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm focus:outline-none focus:border-[#757D5C] resize-none"></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#1C1C1A]/10 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest text-[#5A5A55] hover:bg-[#F8F6EF] transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-[#757D5C] text-white px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#5C6348] transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
