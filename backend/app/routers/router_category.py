from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.schemas.schema_category import CategoryResponse, CategoryCreate, CategoryResponseNoProduct, CategoryUpdate
from app.services import service_category
from app.configs import database

router = APIRouter()


@router.get("/categories", response_model=List[CategoryResponseNoProduct], status_code=status.HTTP_200_OK)
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    categories = service_category.read_all(db, skip, limit)
    return categories


@router.get("/categories/{category_id}", response_model=List[CategoryResponseNoProduct], status_code=status.HTTP_200_OK)
def read_categories_by_id(category_id: int, db: Session = Depends(database.get_db)):
    category = service_category.read_by_id(db, category_id)
    return category


@router.post("/admin/categories", response_model=CategoryResponse,  status_code=status.HTTP_201_CREATED)
def create_category(category: CategoryCreate, db: Session = Depends(database.get_db)):
    db_category = service_category.read_by_descryption(
        db, category.description)
    if db_category:
        raise HTTPException(status_code=400, detail="Category already exists.")
    db_category = service_category.create(db, category)
    return db_category


@router.put("/admin/categories/{category_id}", response_model=CategoryCreate, status_code=status.HTTP_200_OK)
def update_category(category_id: int, category: CategoryUpdate, db: Session = Depends(database.get_db)):
    updated_category = service_category.update(db, category_id, category)
    if updated_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return updated_category


@router.delete("/admin/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(database.get_db)):
    success = service_category.delete(db, category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"ok": True}
