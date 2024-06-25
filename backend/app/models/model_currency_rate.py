from datetime import datetime, timezone
from sqlalchemy import Column, DateTime, Enum, Float, Integer
from app.configs.database import Base


class SupportedCurrencies(Enum):
    USD = "USD"
    BRL = "BRL"


class CurrencyRate(Base):
    __tablename__ = 'currency_rates'
    id = Column(Integer, primary_key=True, index=True)
    rate = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.now(
        timezone.utc), nullable=False)
    from_currency = Column(Enum("USD", "BRL", name="from_currency"),
                           nullable=False, default="USD")
    to_currency = Column(Enum("USD", "BRL", name="to_currency"),
                         nullable=False, default="BRL")
