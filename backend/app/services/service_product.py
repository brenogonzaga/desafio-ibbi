from typing import List, Optional
import httpx
from sqlalchemy.orm import Session

from app.models.model_product import Product
from app.models.model_currency_rate import SupportedCurrencies
from app.schemas.schema_product import ProductCreate, ProductUpdate
from app.services import service_currency


def read_all(db: Session, skip: int = 0, limit: int = 10, category_ids: Optional[List[int]] = None, description: str | None = None, show_zero_quantity: bool = False):
    query = db.query(Product)
    if category_ids:
        query = query.filter(Product.category_id.in_(category_ids))
        if description:
            query = query.filter(Product.description.ilike(f"%{description}%"))
    elif description:
        query = query.filter(Product.description.ilike(f"%{description}%"))
    if not show_zero_quantity:
        query = query.filter(Product.quantity > 0)
    return query.offset(skip).limit(limit).all()


def read_by_id(db: Session, product_id: int):
    return db.query(Product).filter(Product.id == product_id).first()


def read_by_description(db: Session, description: str):
    return db.query(Product).filter(Product.description == description).first()


def create(db: Session, product: ProductCreate, seller_id: int):
    db_product = Product(**product.dict(), seller_id=seller_id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update(db: Session, product_id: int, product: ProductUpdate):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        update_data = product.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product


def delete(db: Session, product_id: int):
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product:
        db_product.quantity = 0  # type: ignore
        db.commit()
        db.refresh(db_product)
    return db_product


def read_usd_conversion_rate(db: Session):
    try:
        response = httpx.get(
            "https://api.exchangerate-api.com/v4/latest/USD")
        response.raise_for_status()
        data = response.json()
        rate = data['rates']['BRL']

        service_currency.add_currency_rate(
            db, rate, SupportedCurrencies.BRL, SupportedCurrencies.USD)

        return rate
    except Exception as e:
        print(f"Falha ao buscar taxa de conversão da API: {e}")
        rates = service_currency.get_latest_rates(
            db, SupportedCurrencies.BRL, SupportedCurrencies.USD)
        if rates:
            average_rate = service_currency.calculate_average_rate(rates)
            return average_rate
        else:
            print(
                "Não foi possível obter a taxa de conversão da API ou do banco de dados.")
            return None
