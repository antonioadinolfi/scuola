# Agenda Prof. Adinolfi — architettura

## Obiettivo

Agenda personale autonoma, indipendente da antonioadinolfiscuola.it e dal vecchio sistema Google Sheets.

## Componenti

1. PWA frontend
2. API privata Fastify
3. PostgreSQL
4. Google Identity Services / OIDC
5. MCP server
6. Google Calendar, in una fase successiva

## Principio di sicurezza

Il frontend non contiene segreti permanenti.

Il database non è esposto a Internet.

Il backend verifica il token Google e usa il claim `sub` come identificatore stabile dell'utente.

Il server MCP non accede direttamente al database: usa esclusivamente l'API autenticata.

## Sequenza di implementazione

PWA locale → API → PostgreSQL → Google Login → migrazione dati → Google Calendar → MCP → collegamento a ChatGPT.

## Stato

- PWA standalone: presente
- API: fondazione presente
- schema PostgreSQL: presente
- CI: presente
- Google OAuth: da configurare con Client ID
- deployment API: da scegliere/configurare
- migrazione Google Sheets: da eseguire dopo collaudo API
- Google Calendar: successivo
- MCP/ChatGPT: successivo
