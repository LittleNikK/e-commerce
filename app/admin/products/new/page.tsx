'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Plus, Trash2, Check } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';

export default function NewProductPage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'vintage-tees',
    brand: '',
    sizeLabel: '',
    standardSize: 'L',
    color: '',
    material: '',
    conditionGrade: 'Very good',
    conditionNotes: 'Inspected by curator. In clean, ready-to-wear vintage condition.',
    flawsText: '',
    sellingPrice: '',
    costPrice: '',
    referencePrice: '',
    isOneOfOne: true,
    stock: '1',
    status: 'published',
    isFeatured: false,
    provenanceNotes: '',
    // Measurements
    chest: '',
    length: '',
    shoulders: '',
    sleeve: '',
    waist: '',
    inseam: '',
    // Images
    imageUrlInput: '',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
        alt: 'Front View',
        isPrimary: true,
      },
    ],
  });

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, name, slug: prev.slug === '' || prev.slug === slug ? slug : prev.slug }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData(prev => ({
          ...prev,
          images: [
            ...prev.images,
            { url: data.url, alt: `${formData.name || 'Garment'} detail`, isPrimary: prev.images.length === 0 },
          ],
        }));
        success('Image uploaded successfully');
      } else {
        error(data.error || 'Upload failed');
      }
    } catch {
      error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddImageUrl = () => {
    if (!formData.imageUrlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [
        ...prev.images,
        { url: prev.imageUrlInput.trim(), alt: 'Garment Photo', isPrimary: prev.images.length === 0 },
      ],
      imageUrlInput: '',
    }));
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const flaws = formData.flawsText
        ? formData.flawsText.split('\n').map(s => s.trim()).filter(Boolean)
        : [];

      const measurements: Record<string, string> = {};
      if (formData.chest) measurements.chest = formData.chest;
      if (formData.length) measurements.length = formData.length;
      if (formData.shoulders) measurements.shoulders = formData.shoulders;
      if (formData.sleeve) measurements.sleeve = formData.sleeve;
      if (formData.waist) measurements.waist = formData.waist;
      if (formData.inseam) measurements.inseam = formData.inseam;

      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        sizeLabel: formData.sizeLabel,
        standardSize: formData.standardSize,
        measurements,
        color: formData.color,
        material: formData.material,
        conditionGrade: formData.conditionGrade,
        conditionNotes: formData.conditionNotes,
        flaws,
        images: formData.images,
        costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
        sellingPrice: Number(formData.sellingPrice),
        referencePrice: formData.referencePrice ? Number(formData.referencePrice) : undefined,
        isOneOfOne: formData.isOneOfOne,
        stock: formData.isOneOfOne ? 1 : Number(formData.stock) || 1,
        status: formData.status,
        isFeatured: formData.isFeatured,
        provenanceNotes: formData.provenanceNotes,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      success(`Garment "${formData.name}" published to archive!`);
      router.push('/admin/products');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error creating product';
      error(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 border border-[#E8E2D8] bg-white rounded-xs text-stone-500 hover:text-stone-900"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#3D4A3C]">
              New Archive Entry
            </span>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl text-[#1A1816]">
              Catalog Unique Vintage Garment
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-sm border border-[#E8E2D8] shadow-xs">
        {/* Core Product Info */}
        <div className="space-y-4">
          <h2 className="font-serif-editorial text-lg text-[#1A1816] pb-2 border-b border-[#E8E2D8]">
            General Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Garment Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => handleNameChange(e.target.value)}
                placeholder="e.g. 1996 Nirvana In Utero Angel Tour Graphic Tee"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                placeholder="nirvana-in-utero-tour-tee"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              >
                <option value="vintage-tees">Vintage Tees</option>
                <option value="denim">Denim</option>
                <option value="jackets">Jackets & Outerwear</option>
                <option value="sweatshirts">Sweatshirts & Knitwear</option>
                <option value="shirts">Shirting</option>
                <option value="trousers">Trousers</option>
                <option value="dresses">Dresses</option>
                <option value="accessories">Accessories</option>
                <option value="archive">Rare Archive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Brockum / Sub Pop"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Vintage Tag Size *
              </label>
              <input
                type="text"
                required
                value={formData.sizeLabel}
                onChange={e => setFormData({ ...formData, sizeLabel: e.target.value })}
                placeholder="e.g. Vintage XL (Boxy Cut)"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Standard Modern Fit *
              </label>
              <select
                value={formData.standardSize}
                onChange={e => setFormData({ ...formData, standardSize: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              >
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="OS">OS (One Size)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Primary Color *
              </label>
              <input
                type="text"
                required
                value={formData.color}
                onChange={e => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g. Faded Charcoal Black"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Fabric Material *
              </label>
              <input
                type="text"
                required
                value={formData.material}
                onChange={e => setFormData({ ...formData, material: e.target.value })}
                placeholder="e.g. 100% Pre-Shrunk Heavyweight Cotton"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Detailed Curatorial Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe stitching, print technique, graphic origin, and cultural context..."
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              />
            </div>
          </div>
        </div>

        {/* Laid Flat Measurements */}
        <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
          <h2 className="font-serif-editorial text-lg text-[#1A1816] pb-2 border-b border-[#E8E2D8]">
            Laid-Flat Measurements
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1816] mb-1">Chest / Pit-to-Pit</label>
              <input
                type="text"
                value={formData.chest}
                onChange={e => setFormData({ ...formData, chest: e.target.value })}
                placeholder="22.5 in / 57 cm"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1816] mb-1">Length (Collar to Hem)</label>
              <input
                type="text"
                value={formData.length}
                onChange={e => setFormData({ ...formData, length: e.target.value })}
                placeholder="28.0 in / 71 cm"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1816] mb-1">Shoulder Width</label>
              <input
                type="text"
                value={formData.shoulders}
                onChange={e => setFormData({ ...formData, shoulders: e.target.value })}
                placeholder="20.5 in / 52 cm"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1816] mb-1">Sleeve Length</label>
              <input
                type="text"
                value={formData.sleeve}
                onChange={e => setFormData({ ...formData, sleeve: e.target.value })}
                placeholder="8.5 in / 22 cm"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1816] mb-1">Waist (Pants/Denim)</label>
              <input
                type="text"
                value={formData.waist}
                onChange={e => setFormData({ ...formData, waist: e.target.value })}
                placeholder="32.0 in / 81 cm"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#1A1816] mb-1">Inseam (Pants/Denim)</label>
              <input
                type="text"
                value={formData.inseam}
                onChange={e => setFormData({ ...formData, inseam: e.target.value })}
                placeholder="31.5 in / 80 cm"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3 py-2 text-xs rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Condition Grading & Imperfections */}
        <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
          <h2 className="font-serif-editorial text-lg text-[#1A1816] pb-2 border-b border-[#E8E2D8]">
            Condition Transparency
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Condition Grade *
              </label>
              <select
                value={formData.conditionGrade}
                onChange={e => setFormData({ ...formData, conditionGrade: e.target.value })}
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm focus:outline-none focus:border-[#3D4A3C]"
              >
                <option value="New with tags">New with tags (Deadstock)</option>
                <option value="Excellent">Excellent (Pristine archive)</option>
                <option value="Very good">Very good (Light natural wear)</option>
                <option value="Good">Good (Honest vintage patina)</option>
                <option value="Fair">Fair (Distressed character)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Provenance Notes
              </label>
              <input
                type="text"
                value={formData.provenanceNotes}
                onChange={e => setFormData({ ...formData, provenanceNotes: e.target.value })}
                placeholder="e.g. Sourced from estate collection in Manchester, UK"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Condition Inspection Notes *
              </label>
              <textarea
                required
                rows={2}
                value={formData.conditionNotes}
                onChange={e => setFormData({ ...formData, conditionNotes: e.target.value })}
                placeholder="Even sun-fade throughout, collar rib retains elasticity..."
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Visible Flaws (One per line)
              </label>
              <textarea
                rows={2}
                value={formData.flawsText}
                onChange={e => setFormData({ ...formData, flawsText: e.target.value })}
                placeholder="Tiny 2mm micro pinhole at back lower hem&#10;Subtle collar fade"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
          <h2 className="font-serif-editorial text-lg text-[#1A1816] pb-2 border-b border-[#E8E2D8]">
            Pricing & Inventory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Selling Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.sellingPrice}
                onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })}
                placeholder="8499"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Cost Price (Admin Only)
              </label>
              <input
                type="number"
                min={0}
                value={formData.costPrice}
                onChange={e => setFormData({ ...formData, costPrice: e.target.value })}
                placeholder="3500"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816] mb-1">
                Reference Value (Optional)
              </label>
              <input
                type="number"
                min={0}
                value={formData.referencePrice}
                onChange={e => setFormData({ ...formData, referencePrice: e.target.value })}
                placeholder="11000"
                className="w-full bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2.5 text-xs rounded-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-[#1A1816] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isOneOfOne}
                onChange={e => setFormData({
                  ...formData,
                  isOneOfOne: e.target.checked,
                  stock: e.target.checked ? '1' : formData.stock,
                })}
                className="rounded-xs text-[#3D4A3C]"
              />
              <span>Unique 1-of-1 Piece (Lock stock to 1)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-[#1A1816] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded-xs text-[#3D4A3C]"
              />
              <span>Feature on Storefront Homepage</span>
            </label>
          </div>
        </div>

        {/* Media & Photography */}
        <div className="space-y-4 pt-4 border-t border-[#E8E2D8]">
          <h2 className="font-serif-editorial text-lg text-[#1A1816] pb-2 border-b border-[#E8E2D8]">
            Product Photography
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                Add Image via URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.imageUrlInput}
                  onChange={e => setFormData({ ...formData, imageUrlInput: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 bg-[#FAF7F2] border border-[#E8E2D8] px-3.5 py-2 text-xs rounded-sm"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-stone-800 text-white text-xs uppercase tracking-wider rounded-sm font-medium hover:bg-black"
                >
                  Add Image
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                Upload Image File
              </label>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D4A3C] text-white text-xs uppercase tracking-wider rounded-sm cursor-pointer hover:bg-[#2F3B2E]">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? 'Uploading...' : 'Browse Local Image'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>
            </div>
          </div>

          {/* Image Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-3/4 border border-[#E8E2D8] rounded-sm overflow-hidden bg-stone-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-xs hover:bg-red-600 transition"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {img.isPrimary && (
                  <span className="absolute bottom-2 left-2 text-[9px] bg-[#3D4A3C] text-white px-2 py-0.5 rounded-xs uppercase tracking-wider font-semibold">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-[#E8E2D8] flex items-center justify-between">
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3.5 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold tracking-widest uppercase hover:bg-[#3D4A3C] transition rounded-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Publishing...' : 'Publish Garment To Archive'}
          </button>
        </div>
      </form>
    </div>
  );
}
