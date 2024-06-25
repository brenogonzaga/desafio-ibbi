from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    username: str
    email: str
    disabled: bool | None = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserInDB(User):
    hashed_password: str
