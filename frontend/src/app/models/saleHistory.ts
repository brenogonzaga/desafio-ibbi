interface Seller {
  id: number;
  name: string;
}

interface Item {
  id: number;
  product_id: number;
  description: number;
  quantity: number;
  seller: Seller;
}

export interface SaleHistory {
  id: number;
  items: Item[];
  note: string;
  timestamp: string;
  user: {
    id: number;
    name: string;
  };
}
