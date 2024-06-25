from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.configs.env import SQLALCHEMY_DATABASE_URL

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError(
        "SQLALCHEMY_DATABASE_URL must be set in the environment.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
