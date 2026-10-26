import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CheckCircle2, Package, Truck, Clock, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { getOrderByNumber } from '@/lib/services/order.service';

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({ params }: OrderPageProps) {
  const { id } = await params;
  const order = await getOrderByNumber(id);

  if (!order) {
    notFound();
  }

  const steps = [
    { title: 'Order Placed', completed: true },
    { title: 'Payment Confirmed', completed: order.paymentStatus === 'paid' },
    { title: 'Carefully Packed', completed: order.fulfillmentStatus === 'packed' || order.fulfillmentStatus === 'shipped' || order.fulfillmentStatus === 'delivered' },
    { title: 'Out For Delivery', completed: order.fulfillmentStatus === 'shipped' || order.fulfillmentStatus === 'delivered' },
    { title: 'Delivered', completed: order.fulfillmentStatus === 'delivered' },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Banner */}
        <div className="bg-white p-8 rounded-sm border border-[#E8E2D8] text-center space-y-3 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#EBF3EA] text-[#2F4A2C] flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#3D4A3C]">
            Order Confirmed & Logged
          </span>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl text-[#1A1816]">
            Thank You, {order.customer.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#5C564E] max-w-md mx-auto leading-relaxed">
            Your vintage piece has been reserved and secured. A confirmation email with the dispatch receipt was sent to <strong>{order.customer.email}</strong>.
          </p>
          <div className="pt-2 text-xs font-mono font-bold text-[#1A1816] tracking-wider">
            Order Reference: {order.orderNumber}
          </div>
        </div>

        {/* Live Status Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E8E2D8] space-y-6 shadow-xs">
          <h2 className="font-serif-editorial text-xl text-[#1A1816] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#3D4A3C]" />
            <span>Fulfillment Status & Timeline</span>
          </h2>

          {/* Stepper Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
            {steps.map((st, i) => (
              <div key={st.title} className="flex flex-col items-center text-center space-y-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                    st.completed
                      ? 'bg-[#3D4A3C] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                >
                  {st.completed ? '✓' : i + 1}
                </div>
                <span className={`text-[11px] uppercase tracking-wider font-medium ${
                  st.completed ? 'text-[#1A1816]' : 'text-stone-400'
                }`}>
                  {st.title}
                </span>
              </div>
            ))}
          </div>

          {/* Tracking info banner if shipped */}
          {order.tracking && (
            <div className="p-4 bg-[#FAF7F2] border border-[#3D4A3C] rounded-sm text-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#3D4A3C]" />
                <div>
                  <p className="font-semibold text-[#1A1816]">Dispatched via {order.tracking.carrier}</p>
                  <p className="text-[#5C564E] font-mono">Tracking No: {order.tracking.trackingNumber}</p>
                </div>
              </div>
              {order.tracking.trackingUrl && (
                <a
                  href={order.tracking.trackingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#3D4A3C] text-white rounded-xs uppercase tracking-wider text-[10px] font-semibold"
                >
                  Track Parcel
                </a>
              )}
            </div>
          )}
        </div>

        {/* Order Details & Items Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 bg-white p-6 rounded-sm border border-[#E8E2D8] space-y-4">
            <h3 className="font-serif-editorial text-lg text-[#1A1816] pb-3 border-b border-[#E8E2D8]">
              Garments in This Order
            </h3>

            <div className="divide-y divide-[#F4EFEA]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex gap-4 items-center">
                  <div className="relative w-16 h-20 bg-stone-100 rounded-sm overflow-hidden shrink-0 border border-[#E8E2D8]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif-editorial text-sm font-medium text-[#1A1816] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#7A7268] mt-0.5">
                      {item.brand} • Size {item.sizeLabel} • Condition: {item.conditionGrade}
                    </p>
                    <p className="text-xs text-[#5C564E] mt-1 font-semibold">
                      Qty: {item.quantity} {item.isOneOfOne && '(Unique 1-of-1)'}
                    </p>
                  </div>
                  <span className="font-serif-editorial text-sm font-semibold text-[#1A1816]">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E2D8] space-y-1.5 text-xs text-[#5C564E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-[#1A1816] font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-[#A34E36] font-medium">
                  <span>Discount ({order.discountCode})</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-[#1A1816] font-medium">
                  {order.shippingFee === 0 ? 'Complimentary' : `₹${order.shippingFee.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E8E2D8] text-base font-serif-editorial font-semibold text-[#1A1816]">
                <span>Total Paid</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping Destination & Payment Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-sm border border-[#E8E2D8] space-y-3">
              <h3 className="font-serif-editorial text-base text-[#1A1816] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3D4A3C]" />
                <span>Delivery Address</span>
              </h3>
              <div className="text-xs text-[#5C564E] leading-relaxed">
                <p className="font-semibold text-[#1A1816]">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}</p>
                <p className="text-[#7A7268] mt-1">{order.customer.phone}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E8E2D8] space-y-3 text-xs">
              <h3 className="font-serif-editorial text-base text-[#1A1816]">Payment Method</h3>
              <p className="uppercase tracking-wider font-semibold text-[#3D4A3C]">
                {order.paymentMethod.replace('_', ' ')}
              </p>
              <p className="text-[#7A7268]">
                Status: <strong className="text-black uppercase">{order.paymentStatus}</strong>
              </p>
              {order.paymentDetails?.paidAt && (
                <p className="text-[11px] text-[#7A7268]">
                  Verified on {new Date(order.paymentDetails.paidAt).toLocaleString('en-IN')}
                </p>
              )}
            </div>

            <Link
              href="/shop"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase hover:bg-[#3D4A3C] transition rounded-sm shadow-xs"
            >
              <span>Back To Storefront</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
