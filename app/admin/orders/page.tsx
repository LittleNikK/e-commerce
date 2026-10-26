import React from 'react';
import Link from 'next/link';
import { getAllOrders } from '@/lib/services/order.service';
import { ShoppingBag, Search, ExternalLink } from 'lucide-react';

interface AdminOrdersPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    paymentStatus?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const status = params.status || undefined;
  const paymentStatus = params.paymentStatus || undefined;
  const search = params.search || undefined;

  const { orders, pagination } = await getAllOrders({
    page,
    limit: 25,
    status,
    paymentStatus,
    search,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D8]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#3D4A3C]">
            Fulfillment & Shipping
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816] mt-0.5">
            Customer Orders & Dispatches
          </h1>
          <p className="text-xs text-[#5C564E] mt-1">
            Total {pagination.totalCount} orders logged. Manage packing, assign tracking numbers, and fulfill orders.
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-sm border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#5C564E]">
            <thead className="bg-[#FAF7F2] text-[#1A1816] uppercase text-[10px] tracking-wider border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-6">Order ID</th>
                <th className="py-3 px-6">Customer</th>
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Items</th>
                <th className="py-3 px-6">Payment</th>
                <th className="py-3 px-6">Fulfillment</th>
                <th className="py-3 px-6 text-right">Total</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]">
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-[#FAF7F2]/60 transition">
                  <td className="py-3.5 px-6 font-mono font-semibold text-[#1A1816]">
                    {order.orderNumber}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-medium text-[#1A1816]">{order.customer.name}</div>
                    <div className="text-[11px] text-[#7A7268]">{order.customer.email}</div>
                  </td>
                  <td className="py-3.5 px-6 text-stone-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="font-medium text-[#1A1816]">
                      {order.items.length} {order.items.length === 1 ? 'Garment' : 'Garments'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-semibold uppercase tracking-wider ${
                      order.paymentStatus === 'paid'
                        ? 'bg-[#EBF3EA] text-[#2F4A2C]'
                        : 'bg-[#F9ECE6] text-[#8C402B]'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="editorial-badge text-[10px] py-0.5 px-2 bg-stone-100 text-stone-700">
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-serif-editorial font-semibold text-[#1A1816]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Link
                      href={`/admin/orders/${order.orderNumber}`}
                      className="px-3 py-1 bg-[#1A1816] text-white hover:bg-[#3D4A3C] transition text-xs font-medium uppercase tracking-wider rounded-xs"
                    >
                      Manage
                    </Link>
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
