import React from 'react';
import Link from 'next/link';
import { getDb } from '@/lib/db/mongodb';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Shirt,
  Users,
} from 'lucide-react';

export default async function AdminOverviewPage() {
  const db = await getDb();

  const [orders, totalProducts, lowStockProducts, totalCustomers] = await Promise.all([
    db.collection('orders').find({}).sort({ createdAt: -1 }).toArray(),
    db.collection('products').countDocuments({}),
    db.collection('products').countDocuments({ stock: { $lte: 1, $gt: 0 } }),
    db.collection('users').countDocuments({ role: 'customer' }),
  ]);

  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const averageOrderValue = paidOrders.length > 0 ? Math.round(totalRevenue / paidOrders.length) : 0;
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#3D4A3C]">
            Live Store Analytics
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816] mt-0.5">
            Operations & Financial Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#3D4A3C] transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vintage Garment</span>
          </Link>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-sm border border-[#E8E2D8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A7268] uppercase tracking-wider font-semibold">
            <span>Gross Sales (INR)</span>
            <div className="p-2 bg-[#EBF3EA] rounded-full text-[#2F4A2C]">
              <span className="font-serif-editorial text-xs font-bold">₹</span>
            </div>
          </div>
          <p className="font-serif-editorial text-2xl font-bold text-[#1A1816]">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#7A7268]">
            Across {paidOrders.length} verified settled orders
          </p>
        </div>

        <div className="bg-white p-5 rounded-sm border border-[#E8E2D8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A7268] uppercase tracking-wider font-semibold">
            <span>Total Orders</span>
            <div className="p-2 bg-[#FAF7F2] rounded-full text-[#3D4A3C] border border-[#E8E2D8]">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-serif-editorial text-2xl font-bold text-[#1A1816]">
            {totalOrders}
          </p>
          <p className="text-[11px] text-[#7A7268]">
            Customer & guest checkout orders
          </p>
        </div>

        <div className="bg-white p-5 rounded-sm border border-[#E8E2D8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A7268] uppercase tracking-wider font-semibold">
            <span>Average Order Value</span>
            <div className="p-2 bg-[#F4EFEB] rounded-full text-[#A34E36]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-serif-editorial text-2xl font-bold text-[#1A1816]">
            ₹{averageOrderValue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#7A7268]">
            Curated vintage ticket size
          </p>
        </div>

        <div className="bg-white p-5 rounded-sm border border-[#E8E2D8] shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#7A7268] uppercase tracking-wider font-semibold">
            <span>Low Stock / Single Units</span>
            <div className="p-2 bg-[#F9ECE6] rounded-full text-[#8C402B]">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="font-serif-editorial text-2xl font-bold text-[#1A1816]">
            {lowStockProducts}
          </p>
          <p className="text-[11px] text-[#7A7268]">
            Of {totalProducts} total catalog products
          </p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-sm border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between">
          <h2 className="font-serif-editorial text-xl text-[#1A1816]">
            Recent Orders & Shipments
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold uppercase tracking-wider text-[#3D4A3C] hover:underline flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No orders logged in database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#5C564E]">
              <thead className="bg-[#FAF7F2] text-[#1A1816] uppercase text-[10px] tracking-wider border-b border-[#E8E2D8]">
                <tr>
                  <th className="py-3 px-6">Order No.</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Payment</th>
                  <th className="py-3 px-6">Fulfillment</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]">
                {recentOrders.map(o => (
                  <tr key={o._id.toString()} className="hover:bg-[#FAF7F2]/60 transition">
                    <td className="py-3.5 px-6 font-mono font-medium text-[#1A1816]">
                      {o.orderNumber}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-medium text-[#1A1816]">{o.customer?.name}</div>
                      <div className="text-[11px] text-[#7A7268]">{o.customer?.email}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                        o.paymentStatus === 'paid'
                          ? 'bg-[#EBF3EA] text-[#2F4A2C]'
                          : 'bg-[#F9ECE6] text-[#8C402B]'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="editorial-badge text-[10px] py-0.5 px-2 bg-stone-100 text-stone-700">
                        {o.fulfillmentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right font-serif-editorial font-semibold text-[#1A1816]">
                      ₹{o.total?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/admin/orders/${o.orderNumber}`}
                        className="px-2.5 py-1 border border-[#E8E2D8] bg-[#FAF7F2] text-[11px] font-medium text-[#1A1816] hover:bg-white rounded-xs"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
