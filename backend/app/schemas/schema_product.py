from typing import Optional
from pydantic import BaseModel, validator


class Seller(BaseModel):
    id: int
    name: str


class ProductBase(BaseModel):
    description: str
    price: float
    quantity: int
    low_stock_alert: int
    category_id: int
    image_url: str | None = None


class ProductUpdate(ProductBase):
    description: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None
    low_stock_alert: Optional[int] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductCategory(BaseModel):
    id: int
    description: str


class ProductResponse(BaseModel):
    id: int
    description: str
    price: float
    quantity: int
    low_stock_alert: int
    category: Optional[ProductCategory] = None
    seller: Seller
    image_url: str | None = None
    price_usd: float
    stock_status: Optional[str] = None

    class Config:
        from_attributes = True

    @validator('stock_status', always=True, pre=True)
    def calculate_stock_status(cls, v, values):
        quantity = values.get('quantity', 0)
        low_stock_alert = values.get('low_stock_alert', 0)

        if quantity < low_stock_alert:
            return 'RED'
        elif quantity - low_stock_alert <= 5:
            return 'YELLOW'
        else:
            return 'GREEN'
