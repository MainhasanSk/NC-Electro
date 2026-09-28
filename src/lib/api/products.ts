import { Product, Category, FilterParams, ApiResponse } from '@/types';
import { localStore } from './store';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../mockData';

export async function getProducts(params: FilterParams = {}): Promise<ApiResponse<Product[]>> {
  // Try local store or fallback
  let list = localStore.getProducts();
  if (!list || list.length === 0) list = MOCK_PRODUCTS;

  // Filter by active (treat undefined as active)
  list = list.filter(p => p.is_active !== false);

  // Search keyword 'q'
  if (params.q) {
    const qLower = params.q.toLowerCase().trim();
    list = list.filter(p => 
      p.name.toLowerCase().includes(qLower) || 
      p.brand.toLowerCase().includes(qLower) ||
      p.description.toLowerCase().includes(qLower) ||
      p.sku.toLowerCase().includes(qLower) ||
      p.category.name.toLowerCase().includes(qLower)
    );
  }

  // Category slug
  if (params.category_slug) {
    list = list.filter(p => p.category.slug === params.category_slug);
  }

  // Sub-category slug
  if (params.sub_category_slug) {
    list = list.filter(p => p.sub_category?.slug === params.sub_category_slug);
  }

  // Brand
  if (params.brand) {
    list = list.filter(p => p.brand.toLowerCase() === params.brand?.toLowerCase());
  }

  // Price range
  if (params.min_price !== undefined) {
    list = list.filter(p => p.price >= (params.min_price || 0));
  }
  if (params.max_price !== undefined) {
    list = list.filter(p => p.price <= (params.max_price || Infinity));
  }

  // Availability
  if (params.availability) {
    list = list.filter(p => p.availability === params.availability);
  }

  // Sorting
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }
  }

  const page = params.page || 1;
  const pageSize = params.page_size || 20;
  const totalItems = list.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = list.slice((page - 1) * pageSize, page * pageSize);

  return {
    data: paginatedData,
    pagination: {
      page,
      page_size: pageSize,
      total_items: totalItems,
      total_pages: totalPages,
    }
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const list = localStore.getProducts();
  const product = list.find(p => p.slug === slug && p.is_active !== false);
  return product || null;
}

export async function getCategories(): Promise<Category[]> {
  const cats = localStore.getCategories();
  return cats.filter(c => c.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find(c => c.slug === slug) || null;
}
