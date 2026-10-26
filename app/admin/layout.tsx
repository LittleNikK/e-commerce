import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from '@/lib/auth/session';
import {
  LayoutDashboard,
  Shirt,
  Boxes,
  ShoppingBag,
  Users,
  Tag,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'admin' && session.role !== 'staff') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-sm border border-[#E8E2D8] text-center space-y-4 shadow-sm">
          <ShieldAlert className="w-12 h-12 text-[#A34E36] mx-auto" />
          <h1 className="font-serif-editorial text-2xl text-[#1A1816]">Access Restricted</h1>
          <p className="text-xs text-[#5C564E] leading-relaxed">
            Your current account ({session.email}) does not have administrative curator privileges.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#3D4A3C]"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products & Archive', href: '/admin/products', icon: Shirt },
    { name: 'Inventory & Stock', href: '/admin/inventory', icon: Boxes },
    { name: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Discount Codes', href: '/admin/discounts', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFEA] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-[#1A1816] text-[#FAF7F2] shrink-0 flex flex-col justify-between border-r border-stone-800">
        <div>
          <div className="p-6 border-b border-stone-800">
            <Link href="/admin" className="block">
              <span className="font-serif-editorial text-xl font-medium tracking-tight text-white">
                SECOND STORY
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-[#C99E68] mt-0.5">
                Curator Operations
              </span>
            </Link>
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-medium uppercase tracking-wider text-stone-300 hover:text-white hover:bg-stone-800/60 transition"
                >
                  <Icon className="w-4 h-4 text-[#C99E68]" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-stone-800 space-y-2">
          <div className="px-3 py-1 text-xs text-stone-400 truncate">
            <p className="font-semibold text-white truncate">{session.name}</p>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest">{session.role}</p>
          </div>
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 text-xs text-stone-300 hover:text-white hover:bg-stone-800/60 rounded-sm transition uppercase tracking-wider"
          >
            <span>Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
