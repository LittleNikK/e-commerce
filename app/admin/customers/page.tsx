import React from 'react';
import { getDb } from '@/lib/db/mongodb';
import { Users } from 'lucide-react';

export default async function AdminCustomersPage() {
  const db = await getDb();

  const users = await db.collection('users')
    .find({}, { projection: { passwordHash: 0, resetTokenHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();

  const orders = await db.collection('orders').find({}).toArray();

  const customerStats = new Map<string, { orderCount: number; totalSpent: number }>();
  for (const o of orders) {
    const email = o.customer?.email?.toLowerCase();
    if (!email) continue;
    const current = customerStats.get(email) || { orderCount: 0, totalSpent: 0 };
    customerStats.set(email, {
      orderCount: current.orderCount + 1,
      totalSpent: current.totalSpent + (o.paymentStatus === 'paid' ? o.total || 0 : 0),
    });
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-[#E8E2D8]">
        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#3D4A3C]">
          Directory
        </span>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816] mt-0.5">
          Customers & Collectors
        </h1>
        <p className="text-xs text-[#5C564E] mt-1">
          Review customer profiles, account roles, order frequency, and lifetime spend.
        </p>
      </div>

      <div className="bg-white rounded-sm border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5C564E]">
            <thead className="bg-[#FAF7F2] text-[#1A1816] uppercase text-[10px] tracking-wider border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Email Address</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Total Orders</th>
                <th className="py-3 px-6">Lifetime Spend</th>
                <th className="py-3 px-6 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {users.map(u => {
                const stats = customerStats.get(u.email?.toLowerCase()) || { orderCount: 0, totalSpent: 0 };
                return (
                  <tr key={u._id.toString()} className="hover:bg-[#FAF7F2]/60 transition">
                    <td className="py-3.5 px-6 font-medium text-[#1A1816]">
                      {u.name}
                    </td>
                    <td className="py-3.5 px-6 text-[#1A1816] font-mono">
                      {u.email}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-[#3D4A3C] text-white'
                          : u.role === 'staff'
                          ? 'bg-amber-800 text-white'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-medium text-[#1A1816]">
                      {stats.orderCount} {stats.orderCount === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3.5 px-6 font-serif-editorial font-semibold text-[#1A1816]">
                      ₹{stats.totalSpent.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-right text-stone-500">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
