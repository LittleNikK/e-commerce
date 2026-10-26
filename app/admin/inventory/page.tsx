import React from 'react';
import Link from 'next/link';
import { getInventoryMovements } from '@/lib/services/inventory.service';
import { getDb } from '@/lib/db/mongodb';
import { Boxes, AlertTriangle, ArrowRight, History } from 'lucide-react';

export default async function AdminInventoryPage() {
  const db = await getDb();

  const [movements, lowStockProducts] = await Promise.all([
    getInventoryMovements(undefined, 40),
    db.collection('products')
      .find({ status: 'published', stock: { $lte: 2 } })
      .sort({ stock: 1 })
      .limit(30)
      .toArray(),
  ]);

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-[#E8E2D8]">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#3D4A3C]">
          Operations & Audits
        </span>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816] mt-0.5">
          Inventory Movements & Stock Audit
        </h1>
        <p className="text-xs text-[#5C564E] mt-1">
          Every stock decrement, order reservation, and manual adjustment is tracked in an append-only audit log.
        </p>
      </div>

      {/* Low Stock Watchlist */}
      <div className="bg-white rounded-sm border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#A34E36]" />
            <h2 className="font-serif-editorial text-xl text-[#1A1816]">
              Low Stock & Sold-Out Watchlist
            </h2>
          </div>
          <span className="text-xs text-[#7A7268]">
            {lowStockProducts.length} Pieces
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5C564E]">
            <thead className="bg-[#FAF7F2] text-[#1A1816] uppercase text-[10px] tracking-wider border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-6">Garment</th>
                <th className="py-3 px-6">Brand</th>
                <th className="py-3 px-6">Size</th>
                <th className="py-3 px-6">Stock Status</th>
                <th className="py-3 px-6 text-right">Price</th>
                <th className="py-3 px-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {lowStockProducts.map(p => (
                <tr key={p._id.toString()} className="hover:bg-[#FAF7F2]/60 transition">
                  <td className="py-3 px-6 font-serif-editorial font-medium text-[#1A1816]">
                    {p.name}
                  </td>
                  <td className="py-3 px-6">{p.brand}</td>
                  <td className="py-3 px-6">{p.sizeLabel}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                      p.stock === 0
                        ? 'bg-[#F9ECE6] text-[#8C402B]'
                        : 'bg-[#FFF9EB] text-[#7A5722]'
                    }`}>
                      {p.stock === 0 ? 'SOLD OUT' : `${p.stock} Unit Left (1-of-1)`}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right font-serif-editorial font-semibold text-[#1A1816]">
                    ₹{p.sellingPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <Link
                      href={`/product/${p.slug}`}
                      target="_blank"
                      className="text-xs text-[#3D4A3C] hover:underline font-medium"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Inventory Movements Stream */}
      <div className="bg-white rounded-sm border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#3D4A3C]" />
            <h2 className="font-serif-editorial text-xl text-[#1A1816]">
              Stock Movement History
            </h2>
          </div>
          <span className="text-xs text-[#7A7268]">Recent 40 movements</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5C564E]">
            <thead className="bg-[#FAF7F2] text-[#1A1816] uppercase text-[10px] tracking-wider border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Garment</th>
                <th className="py-3 px-6">Type</th>
                <th className="py-3 px-6">Delta</th>
                <th className="py-3 px-6">Reference / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {movements.map(m => (
                <tr key={m._id.toString()} className="hover:bg-[#FAF7F2]/60 transition">
                  <td className="py-3 px-6 text-stone-500 font-mono text-[11px]">
                    {new Date(m.createdAt).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-6 font-medium text-[#1A1816]">
                    {m.productName || 'Garment'}
                  </td>
                  <td className="py-3 px-6">
                    <span className="editorial-badge text-[10px] py-0.5 px-2 bg-stone-100 text-stone-700 font-mono">
                      {m.type}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`font-mono font-bold ${m.delta > 0 ? 'text-[#2F4A2C]' : 'text-[#8C402B]'}`}>
                      {m.delta > 0 ? `+${m.delta}` : m.delta}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-[#5C564E]">
                    {m.reason} {m.referenceId && `(${m.referenceId})`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
