# Deployment — Agenda autonoma

## Target

Backend: Railway
Database: PostgreSQL gestito da Railway
Frontend: PWA statica separata dal backend

Il sito scolastico e il calendario pubblico non fanno parte del deployment dell'agenda.

## Railway

Creare un progetto Railway e aggiungere:

1. PostgreSQL
2. un servizio per il backend collegato al repository GitHub

Il servizio backend deve usare come Root Directory:

`/agenda-standalone/backend`

Il Dockerfile presente nella directory costruisce l'API Fastify.

### Variabili d'ambiente

Configurare almeno:

```
PORT=8787
DATABASE_URL=<fornita automaticamente dal servizio PostgreSQL>
GOOGLE_CLIENT_ID=<Google OAuth Client ID>
CORS_ORIGIN=<origine HTTPS della PWA>
```

Non inserire segreti nel repository.

## Verifica

Dopo il deploy:

```
GET /health
```

deve restituire uno stato JSON con `ok: true`.

Poi:

```
GET /me
```

senza autenticazione deve restituire HTTP 401.

## Sequenza successiva

1. verificare il backend pubblico;
2. configurare Google OAuth/OIDC;
3. collegare la PWA all'API;
4. migrare i dati dalla vecchia agenda Google Sheets;
5. integrare Google Calendar;
6. pubblicare il server MCP;
7. collegare l'agenda a ChatGPT.

## Nota

La configurazione attuale dell'API usa Google ID token come credenziale per il browser. Per MCP/ChatGPT verrà utilizzato un flusso di autorizzazione separato e non verranno riutilizzati token permanenti del browser.
