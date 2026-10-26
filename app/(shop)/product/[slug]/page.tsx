import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductBySlug, getRelatedProducts } from '@/lib/services/product.service';
import ProductDetailView from '@/components/products/ProductDetailView';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Garment Not Found — SECOND STORY',
    };
  }

  const primaryImage = product.images?.[0]?.url;

  return {
    title: `${product.name} — SECOND STORY Vintage`,
    description: `${product.brand} size ${product.sizeLabel}. ${product.conditionGrade} condition. ${product.description.slice(0, 150)}...`,
    openGraph: {
      title: `${product.name} — SECOND STORY`,
      description: `₹${product.sellingPrice.toLocaleString('en-IN')} • ${product.conditionGrade} • Authentic vintage`,
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product._id, product.category, 4);

  return <ProductDetailView product={product} relatedProducts={related} />;
}
