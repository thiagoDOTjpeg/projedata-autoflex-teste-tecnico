# Industrial Inventory System - Projedata Technical Test

![Quarkus](<https://img.shields.io/badge/Backend-Quarkus%20(Java%2021)-blue>)
![React](https://img.shields.io/badge/Frontend-React%2019-brightgreen)
![Oracle](https://img.shields.io/badge/Database-Oracle-orange)
![Docker Compose](https://img.shields.io/badge/Deploy-Docker%20Compose-yellow)

---

## 🚀 Quick Start

### 1. Docker Compose (Recomendado)

Orquestra Oracle, Backend e Frontend. Basta rodar:

```bash
docker compose up --build
```

- Frontend: [http://localhost](http://localhost)
- Backend API: [http://localhost:8081](http://localhost:8081)
- Swagger UI: [http://localhost:8081/swagger](http://localhost:8081/swagger)

### 2. Execução Manual (Desenvolvimento)

**Backend** (Java 21):

```bash
cd backend-quarkus
./mvnw quarkus:dev
```

**Frontend** (Node.js 20+):

```bash
cd frontend-react
npm install
npm run dev
```

---

## 🧪 Testes

### Backend

Usa H2 Database em memória para isolamento e velocidade. Testes unitários e integração:

```bash
cd backend-quarkus
./mvnw test
```

### Frontend

- **Unitários (Vitest):**

  ```bash
  npm run test
  ```

- **E2E (Cypress):**
  ```bash
  npx cypress:open # ou npm run cypress:run para headless
  ```

---

## 🧠 Decisões de Arquitetura

1. **createAsyncThunk** vs **RTK Query**
   - _Decisão:_ createAsyncThunk.
   - _Justificativa:_ Controle granular do estado global (Redux) e sincronização de erros globais (RFC 7807).
2. **Active Record (Panache)** vs **Repository Pattern**
   - _Decisão:_ PanacheEntity (Active Record).
   - _Justificativa:_ Reduz boilerplate de CRUD, foca a complexidade nos Services.
3. **H2 para Testes no Backend**
   - _Decisão:_ H2 Database em @QuarkusTest.
   - _Justificativa:_ Velocidade e determinismo, sem dependência de Oracle real para testes.
4. **Gestão de Erros RFC 7807**
   - Handler global para garantir application/problem+json, facilitando mapeamento automático de erros no frontend.

---

## ⚠️ Troubleshooting

- **ORA-12514 no Backend:** Oracle demora a registrar o serviço no Listener. O backend está com restart: on-failure no Docker. Se falhar, aguarde 10 segundos.
- **CORS Error:** Acesse via localhost. Se usar IP, o browser pode bloquear. Garanta que o Origin está mapeado em application.properties.
- **Porta 8081 ocupada:** Verifique se não há outro serviço Java ou Quarkus rodando fora do Docker.

---

## 🛠️ Melhorias Futuras

- Migração para RTK Query (frontend)
- Soft Deletes (archived_at em vez de cascade delete)
- Caching com Redis para sugestões de produção
- Autenticação JWT e RBAC

---

## 📁 Estrutura do Projeto

- **backend-quarkus/**: API Quarkus, lógica de negócio, persistência
- **frontend-react/**: SPA React, UI, integração com API
- **docker-compose.yml**: Orquestração de containers

---

## 📞 Contato

Thiago Gritti
Email: thiagogritti@gmail.com
LinkedIn: [linkedin.com/in/thiagogritti](https://linkedin.com/in/thiagogritti)
Portifólio: [gritti.dev.br](https://gritti.dev.br)
