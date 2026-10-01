# Agenda Prof. Adinolfi — API

Backend indipendente dalla piattaforma scolastica.

Stack: Node.js 22, TypeScript, Fastify, PostgreSQL, Google OIDC/JWT.

Avvio locale:
1. Copiare .env.example in .env e impostare GOOGLE_CLIENT_ID.
2. Avviare PostgreSQL con: docker compose up -d postgres
3. npm install && npm run dev

API: http://localhost:8787

Il browser deve ottenere un Google ID token tramite Google Identity Services e inviarlo come Authorization: Bearer <ID_TOKEN>. Il server verifica firma, issuer e audience e usa il claim sub come identità stabile.

Endpoint: /health, /me, /today, /week, /search?q=..., /events/:id, POST /events, PATCH /events/:id, DELETE /events/:id.

Il server MCP parlerà con questa API privata, non direttamente con PostgreSQL.
