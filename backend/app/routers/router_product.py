from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.schema_product import ProductResponse, ProductCreate, ProductUpdate
from app.models.model_user import User
from app.services import service_category, service_product, service_auth
from app.configs import database

router = APIRouter()


@router.get("/products", response_model=List[ProductResponse], status_code=status.HTTP_200_OK)
def read_products(skip: int = 0, limit: int = 10, category_ids: List[int] | None = None, description: str | None = None, show_zero_quantity: bool = False, db: Session = Depends(database.get_db)):
    products = service_product.read_all(
        db, skip=skip, limit=limit, category_ids=category_ids, description=description, show_zero_quantity=show_zero_quantity)
    usd_rate = service_product.read_usd_conversion_rate(db)
    for product in products:
        product.price_usd = product.price / usd_rate
    return products


@router.get("/admin/products/{product_id}", response_model=ProductResponse, status_code=status.HTTP_200_OK)
def read_product(product_id: int, db: Session = Depends(database.get_db)):
    db_product = service_product.read_by_id(db, product_id=product_id)

    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    usd_rate = service_product.read_usd_conversion_rate(db)
    db_product.price_usd = db_product.price * usd_rate
    return db_product


@router.post("/products", response_model=ProductCreate, status_code=status.HTTP_201_CREATED)
def create_product(product: ProductCreate, current_user: User = Depends(service_auth.get_current_user), db: Session = Depends(database.get_db)):
    if product.category_id is not None:
        category = service_category.read_by_id(
            db, category_id=product.category_id)

        if category is None:
            raise HTTPException(status_code=400, detail="Category not found")
    db_product = service_product.read_by_description(
        db, description=product.description)
    if db_product:
        raise HTTPException(status_code=400, detail="Product already exists")
    return service_product.create(db, product=product, seller_id=current_user.id)  # type: ignore



@router.put("/admin/products/{product_id}", response_model=ProductUpdate, status_code=status.HTTP_200_OK)
def update_product(product_id: int, product: ProductUpdate, db: Session = Depends(database.get_db)):
    if product.category_id is not None:
        category = service_category.read_by_id(
            db, category_id=product.category_id)
        if category is None:
            raise HTTPException(status_code=400, detail="Category not found")
    return service_product.update(db, product_id=product_id, product=product)


@router.delete("/admin/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(database.get_db)):
    success = service_product.delete(db, product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"ok": True}
