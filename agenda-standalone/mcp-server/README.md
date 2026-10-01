# Agenda Adinolfi MCP bridge

Server MCP remoto previsto per collegare l'agenda a ChatGPT.

Endpoint MCP previsto: /mcp

Variabili:
AGENDA_API_URL = URL HTTPS dell'API privata dell'agenda
AGENDA_BEARER_TOKEN = segreto server-side usato solo durante il prototipo

Questa autenticazione bearer e una fase di sviluppo. Per la connessione definitiva a ChatGPT va sostituita da OAuth/OIDC secondo il meccanismo di autenticazione supportato dalla custom app.

Tool esposti:
agenda_today
agenda_week
agenda_search
agenda_create
agenda_update
agenda_delete

Il server usa createMcpHandler e Streamable HTTP, coerentemente con l'attuale SDK TypeScript MCP.