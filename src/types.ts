// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  category: Category;
  description: string | null;
  price: string;              // Changed from number to string
  sale_price: string | null;  // Changed from number | null to string | null
  current_price: string;      // Changed from number to string
  is_on_sale: boolean;
  is_featured: boolean;
  in_stock: boolean;
  stock_qty: number;
  main_image: string | null;  // Changed from string to string | null (API shows null values)
  images: ProductImage[];
  variants: ProductVariant[];
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
  price: string;              // Changed from number to string
  sale_price: string | null;  // Changed from number | null to string | null
  stock_qty: number;
  is_active: boolean;
  attributes: AttributeValue[];
}

// Category type
export interface Category {
  id: number;                 // Changed from string to number (API returns number)
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