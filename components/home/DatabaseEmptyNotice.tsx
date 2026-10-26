'use client';

import React, { useState } from 'react';
import { Database, RefreshCw, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';

interface DatabaseEmptyNoticeProps {
  error?: string | null;
}

export default function DatabaseEmptyNotice({ error }: DatabaseEmptyNoticeProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(error || null);

  const handleSeed = async () => {
    setLoading(true);
    setStatus('Connecting to database and seeding 25 archival garments...');
    setErrorMsg(null);

    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('Seeding complete! Reloading store catalog...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setErrorMsg(data.hint || data.error || 'Failed to seed database');
        setStatus(null);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Network error while attempting to seed');
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto">
      <div className="bg-white border-2 border-[#E8E2D8] rounded-sm p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F4EFEA] border border-[#D5CCC0] flex items-center justify-center text-[#3D4A3C] shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#3D4A3C]">
              Database Setup Required
            </span>
            <h3 className="font-serif-editorial text-2xl text-[#1A1816]">
              {errorMsg ? 'Database Connection Issue' : 'Store Catalog Needs Initial Seeding'}
            </h3>
            <p className="text-xs text-[#5C564E] leading-relaxed">
              {errorMsg
                ? 'The application could not reach your MongoDB database. If you deployed to Vercel, ensure your MONGODB_URI points to a cloud MongoDB Atlas cluster (not localhost 127.0.0.1) and that 0.0.0.0/0 is whitelisted in Atlas Network Access.'
                : 'Your database is connected but contains 0 garments. Click the button below to automatically load all 25 curated vintage pieces, collections, and demo curator accounts.'}
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 bg-[#FFF5F2] border border-[#FADCD5] rounded-xs text-xs text-[#8C402B] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Details:</span>
            </div>
            <p className="font-mono text-[11px] break-all">{errorMsg}</p>
          </div>
        )}

        {status && (
          <div className="p-3 bg-[#EBF3EA] border border-[#C5DEC3] rounded-xs text-xs text-[#2E432A] flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-[#3D4A3C]" />
            <span>{status}</span>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#3D4A3C] transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Seeding Catalog...' : 'Seed Catalog Now (1-Click)'}</span>
          </button>

          <a
            href="/api/health"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-3 border border-[#E8E2D8] bg-white text-xs font-semibold uppercase tracking-wider text-[#1A1816] rounded-sm hover:border-[#3D4A3C] transition"
          >
            <span>Run Health Check</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
