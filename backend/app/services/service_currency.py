from sqlalchemy.orm import Session

from app.models.model_currency_rate import CurrencyRate


def get_latest_rates(db: Session, from_currency: str, to_currency: str, limit: int = 3):
    return db.query(CurrencyRate).filter_by(from_currency=from_currency, to_currency=to_currency).order_by(CurrencyRate.timestamp.desc()).limit(limit).all()


def add_currency_rate(db: Session, rate: float, from_currency: str, to_currency: str):
    db_rate = CurrencyRate(
        rate=rate, from_currency=from_currency, to_currency=to_currency)
    db.add(db_rate)
    db.commit()
    db.refresh(db_rate)
    return db_rate


def calculate_average_rate(rates):
    if not rates:
        return None
    return sum(rate.rate for rate in rates) / len(rates)
