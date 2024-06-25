
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.schema_user import User
from app.services import service_user
from app.configs import database

router = APIRouter(prefix="/auth")


@router.get("/users/", response_model=list[User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):
    users = service_user.read_all(db, skip=skip, limit=limit)
    return users


@router.get("/users/{user_id}", response_model=User)
def read_user_by_id(user_id: int, db: Session = Depends(database.get_db)):
    db_user = service_user.read_by_id(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
