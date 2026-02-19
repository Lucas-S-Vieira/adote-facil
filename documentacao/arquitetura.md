# Análise da Arquitetura do Sistema Adote Fácil

## 1. Visão Geral

O sistema Adote Fácil é estruturado em dois grandes blocos principais:

- **Frontend**: responsável pela interface com o usuário.
- **Backend**: responsável pela lógica de negócio, autenticação e acesso ao banco de dados.

A comunicação entre frontend e backend ocorre por meio de requisições HTTP, caracterizando um modelo **cliente-servidor**.

O projeto utiliza Docker para orquestração dos serviços e PostgreSQL como banco de dados.

---

## 2. Estilo Arquitetural Identificado

### 2.1 Arquitetura Cliente-Servidor

A separação explícita entre as pastas `frontend` e `backend` evidencia a adoção do modelo cliente-servidor:

- O **Frontend** atua como cliente.
- O **Backend** atua como servidor de aplicação.
- O banco de dados é executado como serviço separado (PostgreSQL).

Essa abordagem favorece escalabilidade, separação de responsabilidades e manutenção independente das camadas.

---

### 2.2 Arquitetura em Camadas (Backend)

O backend apresenta uma organização estruturada dentro da pasta `src`, com clara separação de responsabilidades:

- **routes.ts** → definição das rotas da aplicação.
- **controllers/** → recebem requisições HTTP e coordenam a execução das ações.
- **services/** → concentram as regras de negócio.
- **repositories/** → realizam acesso ao banco de dados.
- **prisma/** → ORM responsável pela comunicação com o PostgreSQL.
- **middlewares/** → interceptam requisições para autenticação e validação.
- **providers/** → implementações específicas como autenticação e criptografia.
- **utils/** → funções auxiliares reutilizáveis.
- **database.ts** → configuração de conexão com banco.
- **server.ts / app.ts** → inicialização da aplicação.

O fluxo típico de execução ocorre da seguinte forma:

1. Requisição chega ao servidor.
2. A rota correspondente é identificada.
3. O controller é acionado.
4. O service executa a regra de negócio.
5. O repository acessa o banco via Prisma.
6. A resposta é retornada ao cliente.

Essa organização caracteriza uma **arquitetura em camadas**, com forte separação entre controle, lógica de negócio e persistência.

---

### 2.3 Padrão Repository

A presença da pasta `repositories` indica a aplicação do **Repository Pattern**, cujo objetivo é abstrair o acesso ao banco de dados.

Isso reduz o acoplamento entre regras de negócio e persistência, facilitando testes e futuras mudanças de tecnologia de banco de dados.

---

## Diagrama de Componentes

```mermaid
graph TD

Frontend --> Routes
Routes --> Middlewares
Middlewares --> Controllers
Controllers --> Services
Services --> Repositories
Repositories --> Prisma
Prisma --> PostgreSQL

Services --> Providers
Services --> Utils

flowchart TD
    %% Agrupamento Geral do Sistema
    subgraph Sistema_Adote_Facil [Sistema Adote Fácil]
        direction LR
        
        %% Pacote do Frontend
        subgraph Pkg_Frontend [📦 Pacote Frontend]
            direction TB
            F_App[app / Páginas]
            F_Layout[layout]
            F_Components[components]
            F_Contexts[contexts]
            F_API[api / Client HTTP]
            
            F_App --> F_Layout
            F_App --> F_Components
            F_App --> F_Contexts
            F_Components --> F_API
            F_App --> F_API
        end

        %% Pacote do Backend
        subgraph Pkg_Backend [📦 Pacote Backend]
            direction TB
            B_Routes[routes.ts]
            B_Middlewares[middlewares]
            B_Controllers[controllers]
            B_Services[services]
            B_Providers[providers]
            B_Repositories[repositories]
            B_Prisma[prisma / ORM]
            
            B_Routes --> B_Middlewares
            B_Middlewares --> B_Controllers
            B_Controllers --> B_Services
            B_Services --> B_Providers
            B_Services --> B_Repositories
            B_Repositories --> B_Prisma
        end

        %% Pacote de Infraestrutura/Dados
        subgraph Pkg_Infra [📦 Infraestrutura]
            direction TB
            DB_Postgres[(PostgreSQL)]
        end
    end

    %% Comunicação Externa entre os Pacotes Principais
    F_API ===>|Requisições HTTP| B_Routes
    B_Prisma ===>|Conexão TCP / SQL| DB_Postgres

    %% Estilização Básica para visualização
    style Pkg_Frontend fill:#f0f4f8,stroke:#0369a1,stroke-width:2px
    style Pkg_Backend fill:#f0fdf4,stroke:#15803d,stroke-width:2px
    style Pkg_Infra fill:#fefce8,stroke:#a16207,stroke-width:2px