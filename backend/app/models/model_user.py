from sqlalchemy import Column, Enum, Integer, String
from sqlalchemy.orm import relationship
from app.configs.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # TODO: modificar para aceitar um usuário com várias roles
    # roles = relationship("UserRole", back_populates="user")
    role = Column(Enum("admin", "user", name="user_roles"),
                  nullable=False, default="user")
    products_sold = relationship("Product", back_populates="seller")
    purchases = relationship("Sale", backref="customer")
