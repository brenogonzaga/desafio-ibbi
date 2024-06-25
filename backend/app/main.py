import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import router_sale
from fastapi import FastAPI

from app.routers import router_auth, router_category, router_dashboard, router_product
from app.middleware import JWTMiddleware

app = FastAPI()

app.add_middleware(JWTMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router_auth.router)
app.include_router(router_category.router)
app.include_router(router_product.router)
app.include_router(router_sale.router)
app.include_router(router_dashboard.router)


if __name__ == "__main__":
    uvicorn.run(app=app, port=8000)
