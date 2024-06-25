FROM python:3.10

WORKDIR /backend

COPY ./requirements.txt /backend/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

COPY ./alembic.docker.ini /backend/alembic.ini

COPY ./alembic /backend/alembic

COPY ./app /backend/app

# Definindo variáveis de ambiente
ENV SQLALCHEMY_DATABASE_URL="postgresql://ibbi_user:ibbi_password@db/ibbi_db" \
    SECRET_KEY="FYd2jfflM9uc95k8l6Y1JfhWbcxGALJmLA30qiBDvSqS" \
    ALGORITHM="HS256" \
    ACCESS_TOKEN_EXPIRE_MINUTES=30 \
    TOKEN_API_CURRENCY="8XBYxrrnTQ4YuZ5YWKN15Vnkh7KCGTmX"


EXPOSE 8000

# RUN alembic upgrade head

# Corrigindo o comando CMD para usar a porta 8000
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]