from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.model_sale import Sale
from app.models.model_category import Category
from app.models.model_product import Product
from app.models.model_sale_item import SaleItem
from app.models.model_user import User
from app.schemas.schema_sale import SaleResponse, SaleItemResponse, SaleSellerResponse, SaleUserResponse, SalesByCategorySummaryResponse, TopSoldProductResponse


def create(db: Session, sale_data, user_id):
    new_sale = Sale(user_id=user_id, note=sale_data.note)
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    sale_items = [SaleItem(sale_id=new_sale.id, **item.dict())
                  for item in sale_data.items]
    db.add_all(sale_items)
    db.commit()

    for item in sale_data.items:
        product = db.query(Product).filter(
            Product.id == item.product_id).first()
        if product:
            product.quantity -= item.quantity
            db.add(product)

    db.commit()
    db.refresh(new_sale)
    return new_sale


def read_sales_history(db: Session, limit: int = 4) -> List[SaleResponse]:
    results = db.query(
        Sale.id,
        Sale.user_id,
        Sale.timestamp,
        Sale.note,
        User.name.label('user_name')
    ).join(User, Sale.user_id == User.id).order_by(Sale.timestamp.desc()).limit(limit).all()

    history = []
    for result in results:
        sale_items = db.query(
            SaleItem.id,
            SaleItem.product_id,
            SaleItem.quantity,
            Product.description,
            User.id.label('seller_id'),
            User.name.label('seller_name')
        ).join(Product, SaleItem.product_id == Product.id
               ).join(User, Product.seller_id == User.id
                      ).filter(SaleItem.sale_id == result.id).all()

        items = [SaleItemResponse(
            id=item.id,
            product_id=item.product_id,
            quantity=item.quantity,
            description=item.description,
            seller=SaleSellerResponse(
                id=item.seller_id, name=item.seller_name),
        ) for item in sale_items]

        user = SaleUserResponse(id=result.user_id, name=result.user_name)

        history.append(SaleResponse(
            id=result.id,
            user=user,
            timestamp=result.timestamp,
            note=result.note,
            items=items
        ))

    return history


def read_sales_by_category_summary(db: Session) -> List[SalesByCategorySummaryResponse]:
    query_results = db.query(
        Category.id.label("category_id"),
        Category.description,
        func.sum(SaleItem.quantity).label("total_sales")
    ).select_from(SaleItem).join(Product, SaleItem.product_id == Product.id).join(Category, Product.category_id == Category.id).group_by(Category.id, Category.description).all()

    summary_responses = [
        SalesByCategorySummaryResponse(
            category_id=row.category_id,
            description=row.description,
            total_sales=row.total_sales
        ) for row in query_results
    ]

    return summary_responses


def read_top_sold_products(db: Session, limit: int = 10) -> List[TopSoldProductResponse]:
    query_results = db.query(
        Product.id.label('product_id'),
        Product.description,
        func.sum(SaleItem.quantity).label('total_sales')
    ).join(SaleItem).group_by(Product.id, Product.description).order_by(func.sum(SaleItem.quantity).desc()).limit(limit).all()

    top_sold_products = [
        TopSoldProductResponse(
            product_id=row.product_id,
            description=row.description,
            total_sales=row.total_sales
        ) for row in query_results
    ]

    return top_sold_products


def read_sales_data(db: Session, sales_history_limit: int = 4, top_products_limit: int = 10):
    sales_history = read_sales_history(db, limit=sales_history_limit)
    category_summary = read_sales_by_category_summary(db)
    top_sold_products = read_top_sold_products(db, limit=top_products_limit)

    data = {
        "sales_history": [sale.dict() for sale in sales_history],
        "category_summary": [category.dict() for category in category_summary],
        "top_sold_products": [product.dict() for product in top_sold_products]
    }

    return data
