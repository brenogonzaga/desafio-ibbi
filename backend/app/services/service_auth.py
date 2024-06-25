from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.configs import database
from app.services import service_user
from app.utils import utils_crypt
from app.utils import utils_jwt

from app.configs.env import ACCESS_TOKEN_EXPIRE

if not ACCESS_TOKEN_EXPIRE:
    raise ValueError(
        "ACCESS_TOKEN_EXPIRE must be set in the environment.")


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = utils_jwt.encode(to_encode)
    return encoded_jwt


def authenticate_user(db: Session, username: str, password: str):
    user = service_user.read_by_username(db, username)
    if not user:
        return False
    if not utils_crypt.verify_password(password, user.hashed_password):
        return False
    return user


async def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="api/auth/login")), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = utils_jwt.decode(token)
        username: str = str(payload.get("sub"))
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = service_user.read_by_username(
        db, username=username)
    if user is None:
        raise credentials_exception
    return user


def create_refresh_token(refresh_token: str, db: Session):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = utils_jwt.decode(refresh_token)
        username: str = str(payload.get("sub"))
        if username is None:
            raise credentials_exception
        user = service_user.read_by_username(db, username)
        if user is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    to_encode = {"sub": user.username, "role": user.role}
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire})  # type: ignore
    encoded_jwt = utils_jwt.encode(to_encode)
    return encoded_jwt
