from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, validator


class SaleItemBase(BaseModel):
    product_id: int
    quantity: int


class SaleItemCreate(SaleItemBase):
    pass


class SaleSellerResponse(BaseModel):
    id: int
    name: str


class SaleItemResponse(SaleItemBase):
    id: int
    description: str
    seller: SaleSellerResponse

    class Config:
        from_attributes = True


class SaleBase(BaseModel):
    note: Optional[str] = None


class SaleCreate(SaleBase):
    items: List[SaleItemCreate]


class SaleUserResponse(BaseModel):
    id: int
    name: str


class SaleResponse(SaleBase):
    id: int
    user: SaleUserResponse
    timestamp: str
    items: List[SaleItemResponse]

    class Config:
        from_attributes = True

    @validator('timestamp', pre=True, always=True)
    def format_timestamp(cls, value):
        # Ensure 'value' is a datetime object
        if not isinstance(value, datetime):  # Correct usage of datetime
            # Correctly use datetime.fromisoformat to parse the ISO format string
            value = datetime.fromisoformat(value)
        # Format the datetime object to the desired string format
        return value.strftime('%d/%m/%Y %H:%M:%S')


class SalesByCategorySummaryResponse(BaseModel):
    category_id: int
    description: str
    total_sales: int


class TopSoldProductResponse(BaseModel):
    product_id: int
    description: str
    total_sales: int
