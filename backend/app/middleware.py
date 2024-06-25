from contextlib import contextmanager
from starlette.responses import JSONResponse
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from jose import jwt, JWTError


from app.configs.env import ALGORITHM, SECRET_KEY
from app.configs import database
from app.services import service_user


@contextmanager
def get_db_session():
    try:
        db = database.SessionLocal()
        yield db
    finally:
        db.close()


class JWTMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        excluded_paths = ["/auth/login",
                          "/auth/signup", "/docs", "/openapi.json"]
        admin_protected_paths = ["/admin"]

        if request.url.path in excluded_paths:
            return await call_next(request)

        authorization: str = str(request.headers.get(
            "Authorization"))
        if not authorization:
            return JSONResponse(status_code=401, content={"message": "Authorization header missing"})

        try:
            scheme, token = authorization.split()
            if scheme.lower() != "bearer":
                raise ValueError("Wrong authentication scheme")
            payload = jwt.decode(token,
                                 str(SECRET_KEY),
                                 algorithms=[str(ALGORITHM)])

            # user_roles = payload.get("role", [])

            # if any(request.url.path.startswith(path) for path in admin_protected_paths):
            #     if "admin" not in user_roles:
            #         return JSONResponse(status_code=403, content={"message": "Insufficient permissions"})
            username = payload.get("sub")
            if not username:
                return JSONResponse(status_code=403, content={"message": "Insufficient permissions"})
            with get_db_session() as db:
                user_db = service_user.read_by_username(db, username)
                if any(request.url.path.startswith(path) for path in admin_protected_paths):
                    if user_db.role != "admin":  # type: ignore
                        return JSONResponse(status_code=403, content={"message": "Insufficient permissions"})
            # TODO: Adicionar a lógica para verificar o acesso baseado em departamento

        except ValueError as ve:
            return JSONResponse(status_code=401, content={"message": str(ve)})
        except JWTError as je:
            return JSONResponse(status_code=401, content={"message": f"Invalid token: {str(je)}"})

        return await call_next(request)
