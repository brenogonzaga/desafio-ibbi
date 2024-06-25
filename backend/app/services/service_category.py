from sqlalchemy.orm import Session
from app.models.model_category import Category
from app.schemas.schema_category import CategoryCreate, CategoryUpdate


def read_by_id(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()


def read_by_descryption(db: Session, description: str):
    return db.query(Category).filter(Category.description == description).first()


def read_all(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Category).offset(skip).limit(limit).all()


def create(db: Session, category: CategoryCreate):
    db_category = Category(description=category.description)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def update(db: Session, category_id: int, category: CategoryUpdate):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db_category.description = category.description  # type: ignore
        db.commit()
        db.refresh(db_category)
        return db_category
    return None


def delete(db: Session, category_id: int):
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if db_category:
        db.delete(db_category)
        db.commit()
        return True
    return False
