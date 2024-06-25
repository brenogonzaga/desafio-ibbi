import { Category } from './category';

export interface Product {
  description: string;
  id: number;
  image_url: string;
  price: number;
  price_usd: number;
  quantity: number;
  category: Category;
  low_stock_alert: number;
  stock_status: string;
}
