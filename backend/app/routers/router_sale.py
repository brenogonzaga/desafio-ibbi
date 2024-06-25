import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.configs import database
from app.models.model_user import User
from app.routers import router_dashboard
from app.services import service_product, service_sales, service_auth
from app.schemas.schema_sale import SaleCreate, SaleResponse, SalesByCategorySummaryResponse, TopSoldProductResponse

router = APIRouter()


@router.post("/sales/", response_model=SaleCreate, status_code=status.HTTP_201_CREATED)
async def create_sale(sale: SaleCreate, db: Session = Depends(database.get_db), current_user: User = Depends(service_auth.get_current_user)):
    for item in sale.items:
        product = service_product.read_by_id(db, item.product_id)
        if not product:
            raise HTTPException(
                status_code=404, detail=f"Product with id {item.product_id} not found")

        if product.quantity < item.quantity:  # type: ignore
            raise HTTPException(
                status_code=400, detail=f"Not enough stock for product with id {item.product_id}")

    new_sale = service_sales.create(db, sale, current_user.id)
    sales = service_sales.read_sales_data(
        db, sales_history_limit=10, top_products_limit=10)

    message_str = json.dumps(sales, default=str)
    await router_dashboard.manager.broadcast(message_str)
    return new_sale


@router.get("/admin/sales/history", response_model=List[SaleResponse], status_code=status.HTTP_200_OK)
def get_sales_history(db: Session = Depends(database.get_db)):
    return service_sales.read_sales_history(db)


@router.get("/admin/sales/category-summary", response_model=List[SalesByCategorySummaryResponse], status_code=status.HTTP_200_OK)
def get_sales_by_category_summary(db: Session = Depends(database.get_db)):
    return service_sales.read_sales_by_category_summary(db)


@router.get("/admin/sales/product-summary", response_model=List[TopSoldProductResponse], status_code=status.HTTP_200_OK)
def get_top_sold_products(db: Session = Depends(database.get_db)):
    return service_sales.read_top_sold_products(db)
