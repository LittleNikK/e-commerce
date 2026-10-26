import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from '@/lib/auth/session';
import { getOrdersForUser } from '@/lib/services/order.service';
import { getDb } from '@/lib/db/mongodb';
import { ObjectId } from 'mongodb';
import { Package, MapPin, User, LogOut, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default async function AccountPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }

  const db = await getDb();
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(session.userId) },
    { projection: { passwordHash: 0, resetTokenHash: 0 } }
  );

  const orders = await getOrdersForUser(session.userId);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-[#E8E2D8] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3D4A3C]">
              Customer Portal
            </span>
            <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816] mt-1">
              Hello, {session.name}
            </h1>
            <p className="text-xs text-[#5C564E] mt-1">
              Member of Second Story • {session.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {session.role === 'admin' && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#3D4A3C] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#2F3B2E] transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/shop"
              className="px-4 py-2 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#3D4A3C] transition"
            >
              Shop Vault
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Order History */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-sm border border-[#E8E2D8] shadow-xs">
              <h2 className="font-serif-editorial text-xl text-[#1A1816] pb-4 border-b border-[#E8E2D8] flex items-center justify-between">
                <span>Your Order History</span>
                <span className="text-xs font-sans text-[#7A7268] font-normal">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="font-serif-editorial text-lg text-[#1A1816]">No orders placed yet</p>
                  <p className="text-xs text-[#7A7268] max-w-xs mx-auto">
                    When you order an archival piece, full tracking and dispatch invoices will appear here.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block mt-2 px-6 py-2 bg-[#1A1816] text-white text-xs uppercase tracking-wider font-semibold rounded-sm"
                  >
                    Start Exploring
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#E8E2D8]">
                  {orders.map(order => (
                    <div key={order._id} className="py-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif-editorial text-base font-semibold text-[#1A1816]">
                              #{order.orderNumber}
                            </span>
                            <span className={`editorial-badge text-[9px] py-0.5 px-2 ${
                              order.fulfillmentStatus === 'delivered'
                                ? 'bg-[#EBF3EA] text-[#2F4A2C] border-[#CDE2CA]'
                                : order.fulfillmentStatus === 'shipped'
                                ? 'bg-[#E8F1F5] text-[#244E66] border-[#BCD4E6]'
                                : 'bg-[#FAF7F2] text-stone-700 border-stone-300'
                            }`}>
                              {order.fulfillmentStatus.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {order.paymentStatus === 'paid' ? '• PAID' : '• PENDING'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7A7268] mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-serif-editorial text-base font-semibold text-[#1A1816]">
                            ₹{order.total.toLocaleString('en-IN')}
                          </span>
                          <Link
                            href={`/order/${order.orderNumber}`}
                            className="px-3 py-1.5 border border-[#E8E2D8] bg-[#FAF7F2] text-xs font-semibold uppercase tracking-wider text-[#1A1816] hover:bg-white hover:border-[#3D4A3C] transition rounded-xs flex items-center gap-1"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {order.items.map((it, idx) => (
                          <div
                            key={idx}
                            className="text-xs bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-1.5 rounded-xs shrink-0 flex items-center gap-2"
                          >
                            <span className="font-serif-editorial font-medium">{it.name}</span>
                            <span className="text-[#7A7268]">({it.sizeLabel})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Profile & Saved Addresses */}
          <div className="lg:col-span-4 space-y-6">
            {/* Account Profile Card */}
            <div className="bg-white p-6 rounded-sm border border-[#E8E2D8] space-y-4 shadow-xs">
              <h2 className="font-serif-editorial text-lg text-[#1A1816] pb-3 border-b border-[#E8E2D8] flex items-center gap-2">
                <User className="w-4 h-4 text-[#3D4A3C]" />
                <span>Profile Details</span>
              </h2>

              <div className="text-xs space-y-2 text-[#5C564E]">
                <div>
                  <span className="text-[#7A7268] block text-[10px] uppercase tracking-wider">Full Name</span>
                  <span className="font-medium text-[#1A1816] text-sm">{user?.name}</span>
                </div>
                <div>
                  <span className="text-[#7A7268] block text-[10px] uppercase tracking-wider">Email Address</span>
                  <span className="font-medium text-[#1A1816]">{user?.email}</span>
                </div>
                <div>
                  <span className="text-[#7A7268] block text-[10px] uppercase tracking-wider">Phone</span>
                  <span className="font-medium text-[#1A1816]">{user?.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Saved Delivery Addresses */}
            <div className="bg-white p-6 rounded-sm border border-[#E8E2D8] space-y-4 shadow-xs">
              <h2 className="font-serif-editorial text-lg text-[#1A1816] pb-3 border-b border-[#E8E2D8] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3D4A3C]" />
                <span>Saved Address</span>
              </h2>

              {user?.addresses && user.addresses.length > 0 ? (
                user.addresses.map((addr: { id: string; fullName: string; street: string; apartment?: string; city: string; state: string; postalCode: string; phone: string }) => (
                  <div key={addr.id} className="p-3 bg-[#FAF7F2] border border-[#E8E2D8] rounded-xs text-xs space-y-1 text-[#5C564E]">
                    <p className="font-semibold text-[#1A1816]">{addr.fullName}</p>
                    <p>{addr.street}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                    <p>{addr.city}, {addr.state} — {addr.postalCode}</p>
                    <p className="text-[11px] text-[#7A7268] mt-1">{addr.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#7A7268]">
                  No addresses saved yet. Your shipping address will be automatically saved during your next checkout.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
