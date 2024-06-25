from sqlalchemy.orm import Session
from app.models.model_user import User

from app.utils import utils_crypt
from app.schemas.schema_user import UserCreate


def create(db: Session, user: UserCreate):
    db_user = User(
        name=user.name,
        username=user.username,
        email=user.email,
        hashed_password=utils_crypt.create_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def read_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def read_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def read_all(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def read_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()
