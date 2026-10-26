import React from 'react';
import { getFeaturedProducts } from '@/lib/services/product.service';
import { getDb } from '@/lib/db/mongodb';
import Hero from '@/components/home/Hero';
import CollectionShowcase from '@/components/home/CollectionShowcase';
import FeaturedDrop from '@/components/home/FeaturedDrop';
import ConditionStandards from '@/components/home/ConditionStandards';
import EditorialStory from '@/components/home/EditorialStory';
import { Collection } from '@/types';

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);

  const db = await getDb();
  const rawCollections = await db.collection('collections')
    .find({})
    .sort({ featured: -1, createdAt: -1 })
    .toArray();

  const collections: Collection[] = rawCollections.map(c => ({
    _id: c._id.toString(),
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    featured: Boolean(c.featured),
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  return (
    <main className="min-h-screen">
      <Hero />
      <CollectionShowcase collections={collections} />
      <FeaturedDrop products={featuredProducts} />
      <ConditionStandards />
      <EditorialStory />
    </main>
  );
}
