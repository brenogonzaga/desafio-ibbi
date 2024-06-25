from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenResponse(Token):
    name: str | None = None
    role: str | None = None
