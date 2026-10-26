import { z } from 'zod';

export const conditionGradeEnum = z.enum([
  'New with tags',
  'Excellent',
  'Very good',
  'Good',
  'Fair',
]);

export const productCategoryEnum = z.enum([
  'vintage-tees',
  'shirts',
  'denim',
  'jackets',
  'sweatshirts',
  'trousers',
  'dresses',
  'accessories',
  'archive',
]);

export const standardSizeEnum = z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'OS']);

export const productSchema = z.object({
  name: z.string().min(3, 'Product name is required').max(150),
  slug: z.string().min(3).max(150).regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric and dashes'),
  description: z.string().min(10, 'Detailed description is required'),
  category: productCategoryEnum,
  brand: z.string().min(1, 'Brand is required'),
  sizeLabel: z.string().min(1, 'Original size label is required'),
  standardSize: standardSizeEnum,
  measurements: z.record(z.string(), z.string().optional()).default({}),
  color: z.string().min(2, 'Color is required'),
  material: z.string().min(2, 'Material is required'),
  conditionGrade: conditionGradeEnum,
  conditionNotes: z.string().optional().transform(val => (val && val.trim().length >= 3) ? val.trim() : 'Inspected by curator. In clean, ready-to-wear vintage condition.'),
  flaws: z.array(z.string()).default([]),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string(),
    isPrimary: z.boolean().default(false),
    publicId: z.string().optional(),
  })).min(1, 'At least one product image is required'),
  costPrice: z.number().min(0).optional(),
  sellingPrice: z.number().positive('Selling price must be positive'),
  referencePrice: z.number().positive().optional(),
  isOneOfOne: z.boolean().default(true),
  stock: z.number().int().min(0).default(1),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  isFeatured: z.boolean().default(false),
  collectionIds: z.array(z.string()).default([]),
  provenanceNotes: z.string().optional(),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
  category: z.string().optional(),
  collection: z.string().optional(),
  condition: z.string().optional(),
  size: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().positive().optional(),
  sort: z.enum(['newest', 'price-asc', 'price-desc', 'featured']).default('newest'),
  q: z.string().optional(),
  inStockOnly: z.enum(['true', 'false']).optional(),
});
