// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  current_price: number;
  is_on_sale: boolean;
  is_featured: boolean;
  in_stock: boolean;
  stock_qty: number;
  sku: string;
  main_image: string;
  images: ProductImage[];
  variants: ProductVariant[];
  category: Category;
}

export interface ProductImage {
  id: string;
  image: string;
  alt_text: string | null;
  is_primary: boolean;
}

export interface AttributeValue {
  id: string;
  attribute: string;
  attribute_name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  sale_price: number | null;
  stock_qty: number;
  is_active: boolean;
  attributes: AttributeValue[];
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

// Cart types
export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  total_items: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}