import jwt
from app.configs.env import ALGORITHM, SECRET_KEY

if not SECRET_KEY or not ALGORITHM:
    raise ValueError(
        "SECRET_KEY and ALGORITHM must be set in the environment.")


def encode(to_encode: dict):
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode(token: str):
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
