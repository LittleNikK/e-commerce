'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Plus, Trash2 } from 'lucide-react';
import { DiscountCode } from '@/types';
import { useToast } from '@/components/providers/ToastProvider';

interface DiscountsClientProps {
  initialDiscounts: DiscountCode[];
}

export default function DiscountsClient({ initialDiscounts }: DiscountsClientProps) {
  const router = useRouter();
  const { success, error } = useToast();

  const [discounts, setDiscounts] = useState<DiscountCode[]>(initialDiscounts);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('0');
  const [maxUses, setMaxUses] = useState('100');
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) return;

    setCreating(true);
    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code.trim(),
          type,
          value: Number(value),
          minOrderAmount: Number(minOrderAmount) || 0,
          maxUses: Number(maxUses) || 0,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create discount');
      }

      success(`Promo code "${code.toUpperCase()}" created!`);
      setCode('');
      setValue('');
      router.refresh();
      // Add locally
      setDiscounts(prev => [data.discount, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating code';
      error(msg);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string, discountCode: string) => {
    if (!confirm(`Delete coupon code "${discountCode}"?`)) return;

    try {
      const res = await fetch(`/api/admin/discounts?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');

      setDiscounts(prev => prev.filter(d => d._id !== id));
      success(`Promo code "${discountCode}" deleted`);
    } catch {
      error('Failed to delete coupon code');
    }
  };

  return (
    <div className="space-y-8">
      {/* Creation Card */}
      <div className="bg-white p-6 rounded-sm border border-[#E8E2D8] shadow-xs space-y-4">
        <h2 className="font-serif-editorial text-xl text-[#1A1816] flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#3D4A3C]" />
          <span>Create New Promotion / Discount Code</span>
        </h2>

        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
              Code Name *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. DROP15"
              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs uppercase font-mono tracking-wider rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
              Discount Type
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as 'percentage' | 'fixed')}
              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm font-medium"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed INR (₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
              Value ({type === 'percentage' ? '%' : '₹'}) *
            </label>
            <input
              type="number"
              required
              min={1}
              max={type === 'percentage' ? 90 : 100000}
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={type === 'percentage' ? '15' : '500'}
              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
              Min. Order (₹)
            </label>
            <input
              type="number"
              min={0}
              value={minOrderAmount}
              onChange={e => setMinOrderAmount(e.target.value)}
              placeholder="2000"
              className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full py-2.5 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#3D4A3C] transition flex items-center justify-center gap-1 shadow-xs disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{creating ? 'Saving...' : 'Add Code'}</span>
          </button>
        </form>
      </div>

      {/* Codes Table */}
      <div className="bg-white rounded-sm border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5C564E]">
            <thead className="bg-[#FAF7F2] text-[#1A1816] uppercase text-[10px] tracking-wider border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-6">Promo Code</th>
                <th className="py-3 px-6">Discount</th>
                <th className="py-3 px-6">Min Order</th>
                <th className="py-3 px-6">Redemptions</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {discounts.map(d => (
                <tr key={d._id} className="hover:bg-[#FAF7F2]/60 transition">
                  <td className="py-3.5 px-6 font-mono font-bold text-[#1A1816]">
                    {d.code}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-[#3D4A3C]">
                    {d.type === 'percentage' ? `${d.value}% OFF` : `₹${d.value.toLocaleString('en-IN')} OFF`}
                  </td>
                  <td className="py-3.5 px-6">
                    {d.minOrderAmount ? `₹${d.minOrderAmount.toLocaleString('en-IN')}` : 'No minimum'}
                  </td>
                  <td className="py-3.5 px-6">
                    {d.usedCount} {d.maxUses ? `/ ${d.maxUses} uses` : 'uses'}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="editorial-badge text-[10px] py-0.5 px-2 bg-[#EBF3EA] text-[#2F4A2C] border-[#CDE2CA]">
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() => handleDelete(d._id, d.code)}
                      className="p-1.5 text-stone-400 hover:text-[#A34E36] transition"
                      title="Delete coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
