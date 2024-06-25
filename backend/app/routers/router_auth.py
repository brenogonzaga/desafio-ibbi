from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.configs import database
from app.services import service_auth, service_user
from app.configs.env import ACCESS_TOKEN_EXPIRE
from app.schemas.schema_user import User, UserInDB, UserCreate
from app.schemas.schema_token import TokenResponse


router = APIRouter(prefix="/auth")

if not ACCESS_TOKEN_EXPIRE:
    raise ValueError(
        "ACCESS_TOKEN_EXPIRE_MINUTES must be set in the environment.")


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(database.get_db)):
    user = service_auth.authenticate_user(
        db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE)

    access_token = service_auth.create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return TokenResponse(access_token=access_token, token_type="bearer", name=str(user.name), role=str(user.role))


@router.post("/signup", response_model=UserInDB, status_code=status.HTTP_201_CREATED)
def signup_user(user: UserCreate, db: Session = Depends(database.get_db)):
    db_user = service_user.read_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=400, detail="Username already registered")
    db_user = service_user.read_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return service_user.create(db=db, user=user)


@router.post("/refresh", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def refresh_access_token(refresh_token: str = Security(OAuth2PasswordBearer(tokenUrl="api/auth/login")), db: Session = Depends(database.get_db)):
    user = await service_auth.get_current_user(refresh_token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is invalid or expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    new_access_token = service_auth.create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    return TokenResponse(access_token=new_access_token, token_type="bearer", name=str(user.name), role=str(user.role))
