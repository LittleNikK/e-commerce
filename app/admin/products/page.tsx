import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/services/product.service';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';

interface AdminProductsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    category?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const q = params.q || undefined;
  const category = params.category || undefined;

  const { products, pagination } = await getProducts({
    page,
    limit: 20,
    q,
    category,
    status: undefined, // Include all statuses in admin
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#3D4A3C]">
            Inventory Management
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816] mt-0.5">
            Archival Garments Catalog
          </h1>
          <p className="text-xs text-[#5C564E] mt-1">
            Total {pagination.totalCount} vintage garments listed across all drop archives.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#3D4A3C] transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Garment Entry</span>
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-sm border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5C564E]">
            <thead className="bg-[#FAF7F2] text-[#1A1816] uppercase text-[10px] tracking-wider border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-6">Garment</th>
                <th className="py-3 px-6">Brand & Size</th>
                <th className="py-3 px-6">Condition</th>
                <th className="py-3 px-6">Stock</th>
                <th className="py-3 px-6 text-right">Selling Price</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-[#FAF7F2]/60 transition">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-[#E8E2D8]">
                        <Image
                          src={p.images?.[0]?.url || '/placeholder.png'}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="font-serif-editorial text-sm font-medium text-[#1A1816] hover:text-[#3D4A3C] flex items-center gap-1 truncate"
                        >
                          <span>{p.name}</span>
                          <ExternalLink className="w-3 h-3 text-stone-400 shrink-0" />
                        </Link>
                        <span className="text-[10px] text-[#7A7268] capitalize">
                          {p.category.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-[#1A1816]">{p.brand}</div>
                    <div className="text-[11px] text-[#7A7268]">{p.sizeLabel} (Fits {p.standardSize})</div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="editorial-badge text-[10px] py-0.5 px-2 bg-stone-100 text-stone-700">
                      {p.conditionGrade}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-block w-2 h-2 rounded-full ${p.stock > 0 ? 'bg-[#3D4A3C]' : 'bg-[#A34E36]'}`} />
                      <span className="font-medium text-[#1A1816]">
                        {p.stock} in stock {p.isOneOfOne && '(1-of-1)'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right font-serif-editorial font-semibold text-[#1A1816]">
                    ₹{p.sellingPrice.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-stone-500 hover:text-[#1A1816] transition"
                        title="View Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
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
