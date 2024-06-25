from typing import List, Optional
from pydantic import BaseModel
from app.schemas.schema_product import ProductBase


class CategoryBase(BaseModel):
    description: str


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    description: str


class CategoryResponseNoProduct(BaseModel):
    id: int
    description: str

    class Config:
        from_attributes = True


class CategoryResponse(BaseModel):
    id: int
    products: List[ProductBase] = []

    class Config:
        from_attributes = True
