from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.configs.database import Base


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    low_stock_alert = Column(Integer, nullable=False)
    category_id = Column(Integer, ForeignKey(
        "categories.id", ondelete="SET NULL"))
    image_url = Column(String, nullable=True)
    category = relationship("Category", back_populates="products")
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller = relationship("User", back_populates="products_sold")
