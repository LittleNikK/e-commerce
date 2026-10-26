import React from 'react';
import Link from 'next/link';
import { getProducts } from '@/lib/services/product.service';
import ProductCard from '@/components/products/ProductCard';
import { Filter, SlidersHorizontal, RotateCcw, Search } from 'lucide-react';

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    condition?: string;
    size?: string;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'featured';
    q?: string;
    inStockOnly?: string;
    page?: string;
    collection?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category || undefined;
  const condition = params.condition || undefined;
  const size = params.size || undefined;
  const sort = params.sort || 'newest';
  const q = params.q || undefined;
  const inStockOnly = params.inStockOnly === 'true';
  const page = Number(params.page) || 1;
  const collection = params.collection || undefined;

  const { products, pagination } = await getProducts({
    category,
    condition,
    size,
    sort,
    q,
    inStockOnly,
    page,
    collection,
    limit: 16,
  });

  const categories = [
    { label: 'All Archive', value: '' },
    { label: 'Vintage Tees', value: 'vintage-tees' },
    { label: 'Denim', value: 'denim' },
    { label: 'Jackets & Outerwear', value: 'jackets' },
    { label: 'Sweatshirts & Knitwear', value: 'sweatshirts' },
    { label: 'Shirting', value: 'shirts' },
    { label: 'Trousers', value: 'trousers' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Rare Archive', value: 'archive' },
  ];

  const conditionGrades = ['New with tags', 'Excellent', 'Very good', 'Good', 'Fair'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS'];

  // Helper function to build query URL
  function buildQuery(updates: Record<string, string | undefined>) {
    const current = new URLSearchParams();
    if (category) current.set('category', category);
    if (condition) current.set('condition', condition);
    if (size) current.set('size', size);
    if (sort && sort !== 'newest') current.set('sort', sort);
    if (q) current.set('q', q);
    if (inStockOnly) current.set('inStockOnly', 'true');
    if (collection) current.set('collection', collection);

    Object.entries(updates).forEach(([key, val]) => {
      if (!val) {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });

    const queryStr = current.toString();
    return queryStr ? `/shop?${queryStr}` : '/shop';
  }

  const hasActiveFilters = Boolean(category || condition || size || q || inStockOnly || collection);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-[#E8E2D8] pb-8 mb-8">
          <div className="flex items-center gap-2 text-xs text-[#7A7268] uppercase tracking-wider mb-2">
            <Link href="/" className="hover:text-[#1A1816]">Home</Link>
            <span>/</span>
            <span className="text-[#1A1816] font-medium">Archive Catalog</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl text-[#1A1816]">
                The Curated Vault
              </h1>
              <p className="text-xs sm:text-sm text-[#5C564E] mt-2 max-w-xl">
                Showing {pagination.totalCount} authenticated vintage garments.
                Each piece has distinct measurements and honest condition grading.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#7A7268] uppercase tracking-wider">Sort:</span>
              <div className="flex items-center gap-2">
                <Link
                  href={buildQuery({ sort: 'newest' })}
                  className={`text-xs px-3 py-1.5 rounded-sm border transition ${
                    sort === 'newest'
                      ? 'bg-[#1A1816] text-[#FAF7F2] border-[#1A1816]'
                      : 'bg-white text-[#5C564E] border-[#E8E2D8] hover:border-[#3D4A3C]'
                  }`}
                >
                  Newest Drop
                </Link>
                <Link
                  href={buildQuery({ sort: 'price-asc' })}
                  className={`text-xs px-3 py-1.5 rounded-sm border transition ${
                    sort === 'price-asc'
                      ? 'bg-[#1A1816] text-[#FAF7F2] border-[#1A1816]'
                      : 'bg-white text-[#5C564E] border-[#E8E2D8] hover:border-[#3D4A3C]'
                  }`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={buildQuery({ sort: 'price-desc' })}
                  className={`text-xs px-3 py-1.5 rounded-sm border transition ${
                    sort === 'price-desc'
                      ? 'bg-[#1A1816] text-[#FAF7F2] border-[#1A1816]'
                      : 'bg-white text-[#5C564E] border-[#E8E2D8] hover:border-[#3D4A3C]'
                  }`}
                >
                  Price: High to Low
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="space-y-8 bg-white p-6 rounded-sm border border-[#E8E2D8] h-fit">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                <SlidersHorizontal className="w-4 h-4 text-[#3D4A3C]" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <Link
                  href="/shop"
                  className="text-xs text-[#A34E36] hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </Link>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                Category
              </h4>
              <div className="space-y-1.5">
                {categories.map(cat => {
                  const isSelected = (!category && !cat.value) || category === cat.value;
                  return (
                    <Link
                      key={cat.label}
                      href={buildQuery({ category: cat.value || undefined, page: undefined })}
                      className={`block text-xs py-1 transition ${
                        isSelected
                          ? 'text-[#3D4A3C] font-semibold flex items-center justify-between'
                          : 'text-[#5C564E] hover:text-[#1A1816]'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#3D4A3C]" />}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Condition Grade */}
            <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                Condition Grade
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {conditionGrades.map(grade => {
                  const isSelected = condition === grade;
                  return (
                    <Link
                      key={grade}
                      href={buildQuery({
                        condition: isSelected ? undefined : grade,
                        page: undefined,
                      })}
                      className={`text-xs px-2.5 py-1 rounded-sm border transition ${
                        isSelected
                          ? 'bg-[#3D4A3C] text-white border-[#3D4A3C]'
                          : 'bg-[#FAF7F2] text-[#5C564E] border-[#E8E2D8] hover:border-[#3D4A3C]'
                      }`}
                    >
                      {grade}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Size Filter */}
            <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1A1816]">
                Standard Size
              </h4>
              <div className="grid grid-cols-4 gap-1.5">
                {sizes.map(s => {
                  const isSelected = size === s;
                  return (
                    <Link
                      key={s}
                      href={buildQuery({
                        size: isSelected ? undefined : s,
                        page: undefined,
                      })}
                      className={`text-center text-xs py-1.5 rounded-sm border transition ${
                        isSelected
                          ? 'bg-[#1A1816] text-white border-[#1A1816] font-semibold'
                          : 'bg-[#FAF7F2] text-[#5C564E] border-[#E8E2D8] hover:border-[#3D4A3C]'
                      }`}
                    >
                      {s}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* In Stock Only Toggle */}
            <div className="pt-4 border-t border-[#E8E2D8]">
              <Link
                href={buildQuery({ inStockOnly: inStockOnly ? undefined : 'true', page: undefined })}
                className="flex items-center justify-between text-xs text-[#1A1816] font-medium"
              >
                <span>Available Pieces Only</span>
                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                    inStockOnly ? 'bg-[#3D4A3C]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      inStockOnly ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </Link>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 flex-wrap text-xs bg-white p-3 rounded-sm border border-[#E8E2D8]">
                <span className="text-[#7A7268]">Active:</span>
                {category && (
                  <Link
                    href={buildQuery({ category: undefined })}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F4EFEA] border border-[#E8E2D8] rounded-xs text-[#1A1816]"
                  >
                    Category: {category} ✕
                  </Link>
                )}
                {condition && (
                  <Link
                    href={buildQuery({ condition: undefined })}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F4EFEA] border border-[#E8E2D8] rounded-xs text-[#1A1816]"
                  >
                    Condition: {condition} ✕
                  </Link>
                )}
                {size && (
                  <Link
                    href={buildQuery({ size: undefined })}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F4EFEA] border border-[#E8E2D8] rounded-xs text-[#1A1816]"
                  >
                    Size: {size} ✕
                  </Link>
                )}
                {q && (
                  <Link
                    href={buildQuery({ q: undefined })}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F4EFEA] border border-[#E8E2D8] rounded-xs text-[#1A1816]"
                  >
                    Search: &ldquo;{q}&rdquo; ✕
                  </Link>
                )}
              </div>
            )}

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="bg-white border border-[#E8E2D8] p-12 text-center rounded-sm space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-stone-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif-editorial text-2xl text-[#1A1816]">No matching vintage pieces found</h3>
                <p className="text-xs text-[#7A7268] max-w-md mx-auto leading-relaxed">
                  We frequently curate new archive drops from collector estates. Try clearing one or more filters or browse all vintage tees.
                </p>
                <div className="pt-2">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center px-6 py-2.5 bg-[#1A1816] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#3D4A3C] transition"
                  >
                    View All Garments
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="pt-8 border-t border-[#E8E2D8] flex items-center justify-between">
                <span className="text-xs text-[#7A7268]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <div className="flex items-center gap-2">
                  {pagination.page > 1 && (
                    <Link
                      href={buildQuery({ page: String(pagination.page - 1) })}
                      className="px-4 py-2 border border-[#E8E2D8] bg-white text-xs text-[#1A1816] hover:bg-[#FAF7F2] rounded-sm transition font-medium"
                    >
                      Previous
                    </Link>
                  )}
                  {pagination.hasMore && (
                    <Link
                      href={buildQuery({ page: String(pagination.page + 1) })}
                      className="px-4 py-2 border border-[#1A1816] bg-[#1A1816] text-xs text-white hover:bg-[#3D4A3C] rounded-sm transition font-medium"
                    >
                      Next Page
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
