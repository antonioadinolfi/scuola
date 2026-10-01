# Agenda Prof. Antonio Adinolfi - applicazione autonoma

Questa directory contiene la nuova applicazione indipendente dal sito scolastico.

Obiettivo: pubblicare l'agenda su un hosting separato, eventualmente con un dominio dedicato come agenda.antonioadinolfi.it.

Funzioni iniziali: PWA, calendario mensile, ricerca, filtri, priorita, stato, esportazione iCalendar e funzionamento offline.

Architettura prevista:
PWA -> API privata -> database agenda
                    -> Google Calendar
                    -> ChatGPT tramite app MCP

Il frontend non contiene credenziali e non dipende da Google Apps Script.

Per il collegamento a ChatGPT la tecnologia prevista e MCP. OpenAI documenta le custom app MCP come metodo per collegare ChatGPT a strumenti e dati esterni. Le azioni di scrittura/modifica sono soggette alle autorizzazioni dell'app e alla disponibilita della modalita sviluppatore nel piano/workspace.

Strumenti previsti:
agenda_today
agenda_week
agenda_search
agenda_create
agenda_update
agenda_delete

L'autenticazione definitiva deve essere OAuth/OIDC. Non inserire token permanenti nel JavaScript del browser.

La vecchia agenda sul sito non viene cancellata durante la migrazione.