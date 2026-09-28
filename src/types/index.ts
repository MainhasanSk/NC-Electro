export type Role = 'customer' | 'sub_admin' | 'super_admin';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: Role;
  is_active: boolean;
  created_at: string;
}

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface ProductSpecification {
  key: string;
  value: string;
  group?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
  alt_text?: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface SubCategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  description: string;
  short_description?: string;
  price: number;
  original_price: number;
  discount_percentage?: number;
  stock_quantity: number;
  low_stock_threshold: number;
  reserved_quantity: number;
  availability: Availability;
  category: CategorySummary;
  sub_category?: SubCategorySummary;
  primary_image: string;
  images: ProductImage[];
  specifications: ProductSpecification[];
  is_active: boolean;
  is_featured?: boolean;
  has_installation_support: boolean;
  delivery_time_text?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  sub_categories: SubCategory[];
  product_count?: number;
}

export interface SubCategory {
  id: string;
  parent_category_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
  product_count?: number;
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
  line_total: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  has_installation?: boolean;
  installation_fee?: number;
  total: number;
}

export interface Address {
  id: string;
  user_id: string;
  label: string; // e.g. "Home", "Office"
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export type OrderStatus =
  | 'order_placed'
  | 'accepted'
  | 'processing'
  | 'ready_for_dispatch'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  brand: string;
  price: number;
  quantity: number;
  line_total: number;
  image_url: string;
}

export interface OrderStatusHistory {
  id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  changed_by_name: string;
  note?: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: OrderStatus;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  has_installation?: boolean;
  installation_fee?: number;
  total: number;
  accepted_by_id?: string | null;
  accepted_by_name?: string | null;
  accepted_at?: string | null;
  seller_supplier_id?: string | null;
  seller_supplier_name?: string | null;
  seller_supplier_pincode?: string | null;
  customer_note?: string;
  created_at: string;
  updated_at: string;
  status_history: OrderStatusHistory[];
}

export interface SellerSupplier {
  id: string;
  business_name: string;
  contact_person: string;
  phone: string;
  email: string;
  city: string;
  pincode: string;
  is_active: boolean;
  notes?: string;
  supported_categories: string[];
  created_at: string;
}

export interface Invoice {
  id: string;
  document_number: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'generated' | 'failed';
  file_url?: string;
  created_at: string;
}

export interface RewardPoint {
  id: string;
  user_id: string;
  user_name: string;
  order_id: string;
  order_number: string;
  points: number;
  reason: string;
  created_at: string;
}

export interface Pagination {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  request_id?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  request_id?: string;
}

export interface FilterParams {
  q?: string;
  category_slug?: string;
  sub_category_slug?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  availability?: Availability;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
  page?: number;
  page_size?: number;
}
