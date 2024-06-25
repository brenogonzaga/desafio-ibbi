# Controle de Estoque de Produtos

## Índice

1. [Descrição](#descrição)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Requisitos](#requisitos)
4. [MER - Modelo Entidade Relacionamento](#mer---modelo-entidade-relacionamento)
5. [Instruções de Configuração Backend - com Docker](#instruções-de-configuração-backend-e-frontend---com-docker)
6. [Instruções de Configuração Backend - com Docker apenas no banco de dados](#instruções-de-configuração-backend---com-docker-apenas-no-banco-de-dados)
7. [Instruções de Configuração Backend - sem Docker](#instruções-de-configuração-backend---sem-docker)
8. [Instruções de Configuração Frontend](#instruções-de-configuração-frontend)

## Descrição

Este projeto é uma aplicação de controle de vendas para um e-commerce, onde é possível cadastrar categorias e produtos, realizar vendas e acompanhar o histórico de vendas através de um dashboard.

### Fluxos de Usuário

- **Fluxo de Usuário Comum:** Após o login, o usuário será levado para a tela inicial onde serão listados os produtos disponíveis para compra.
- **Fluxo de Administrador:** Após o login, o administrador será levado ao dashboard em `/admin`, que mostrará o histórico de vendas, vendas por categorias, produtos mais vendidos, cadastro de categorias e produtos, além da listagem dos mesmos.

## Tecnologias Utilizadas

- Angular
- FastAPI
- SqlAlchemy
- PrimeNG
- Alembic
- PrimeFlex
- Docker

## Requisitos

- Docker, Docker Compose, Python 3.10, Node.js, npm

## MER - Modelo Entidade Relacionamento

<p align="center">
  <img src="./docs/MER.svg" alt="MER">
</p>

O arquivo XML para importação no draw.io (app.diagrams.net): [MER.xml](./docs/MER.xml)

## Instruções de Configuração Backend e Frontend - com Docker

1. Clone o repositório:

   ```sh
   git clone https://github.com/brenogonzaga/desafio-ibbi
   ```

2. Rode o comando para iniciar os serviços:

   ```sh
   docker-compose up --build
   ```

3. A aplicação ficará disponível em `http://localhost:4200`.

   **Aguarde alguns segundos para que o backend esteja disponível, pois o Docker realiza verificações de saúde (health check).**

## Instruções de Configuração Backend - com Docker apenas no banco de dados

1. Clone o repositório:

   ```sh
   git clone https://github.com/brenogonzaga/desafio-ibbi
   ```

2. Rode o comando para iniciar os serviços:

   ```sh
   docker-compose -f docker-compose.db.yml up --build

   ```

3. Navegue até o diretório `backend`:

   ```sh
   cd backend
   ```

4. Crie um ambiente virtual e ative-o:

   #### Windows

   ```sh
   python -m venv venv
   .\venv\Scripts\activate
   ```

   #### Linux

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

5. Instale as dependências:

   ```sh
   pip install -r requirements.txt
   ```

6. Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis de ambiente:

   ```sh
   # DATABASE
   SQLALCHEMY_DATABASE_URL = "postgresql://ibbi_user:ibbi_password@localhost:5445/ibbi_db"

   # TOKEN AND BCRYPT
   SECRET_KEY = "FYd2jfflM9uc95k8l6Y1JfhWbcxGALJmLA30qiBDvSqS"
   ALGORITHM = "HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   ```

7. Execute as migrações do banco de dados:

   ```sh
   alembic upgrade head
   ```

   Ao executar o comando acima, será criado um usuário admin com as seguintes credenciais:

   - **Usuário:** ibbi_admin
   - **Senha:** ibbi_password

   Será também criado um usuário com as seguintes credenciais:

   - **Usuário:** user1
   - **Senha:** user1_password

   Também serão criadas algumas seeds para testes.

   <p align="center">
     <img src="./docs/seeds.png" alt="Seeds">
   </p>

   Obs.: Caso não queira criar as seeds, apague os dados de seeds em `backend/alembic/versions/7d8f176b73f7_initial.py` e execute o comando `alembic upgrade head` novamente.

8. Inicie a aplicação:

   ```sh
   uvicorn app.main:app --reload
   ```

## Instruções de Configuração Backend - sem Docker

1. Navegue até o diretório `backend`:

   ```sh
   cd backend
   ```

2. Crie um ambiente virtual e ative-o:

   #### Windows

   ```sh
   python -m venv venv
   .\venv\Scripts\activate
   ```

   #### Linux

   ```sh
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Instale as dependências:

   ```sh
   pip install -r requirements.txt
   ```

4. Crie um arquivo `.env` na raiz do diretório `backend` com as seguintes variáveis de ambiente:

   ```sh
   # DATABASE
   SQLALCHEMY_DATABASE_URL = "postgresql://seu_user:seu_password@localhost:seu_host/seu_Db"

   # TOKEN AND BCRYPT
   SECRET_KEY = "sua_chave_secreta"
   ALGORITHM = "HS256"
   ACCESS_TOKEN_EXPIRE_MINUTES = 30
   ```

   **Lembre-se, você deve criar um banco de dados no PostgreSQL e substituir as variáveis de ambiente acima.**

5. Execute as migrações do banco de dados:

   ```sh
   alembic upgrade head
   ```

   Ao executar o comando acima, será criado um usuário admin com as seguintes credenciais:

   - **Usuário:** ibbi_admin
   - **Senha:** ibbi_password

   Será também criado um usuário com as seguintes credenciais:

   - **Usuário:** user1
   - **Senha:** user1_password

   Também serão criadas algumas seeds para testes.

   <p align="center">
     <img src="./docs/seeds.png" alt="Seeds">
   </p>

   Obs.: Caso não queira criar as seeds, apague os dados de seeds em `backend/alembic/versions/7d8f176b73f7_initial.py` e execute o comando `alembic upgrade head` novamente.

6. Inicie a aplicação:

   ```sh
   uvicorn app.main:app --reload
   ```

## Instruções de Configuração Frontend

1. Navegue até o diretório `frontend`:

   ```sh
   cd frontend
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Inicie a aplicação:

   ```sh
   ng serve
   ```

   A aplicação ficará disponível em `http://localhost:4200`.
