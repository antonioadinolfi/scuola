# Agenda elettronica — Prof. Antonio Adinolfi

PWA personale con archivio locale e sincronizzazione Google Sheets tramite Google Apps Script.

## Struttura

- `index.html` — interfaccia PWA
- `app.js` — agenda, sincronizzazione, calendario mensile, notifiche browser, esportazione iCalendar
- `sw.js` — Service Worker e cache offline
- `manifest.webmanifest` — installazione PWA
- `google-apps-script/Code.gs` — backend Google Apps Script

## Funzioni attuali

- agenda locale/offline;
- sincronizzazione con Google Sheets;
- vista Agenda;
- vista Calendario mensile;
- ricerca e filtri;
- stato Da fare / Completato;
- priorità;
- promemoria browser;
- esportazione `.ics`;
- installazione come PWA;
- ID evento univoci;
- normalizzazione delle date nel fuso orario del foglio.

## Backend Google Apps Script

Il file `google-apps-script/Code.gs` contiene la versione 2 del backend. La versione 2 aggiunge:

- formattazione esplicita di date e orari;
- gestione `delete`;
- gestione degli errori JSON;
- versione API.

Dopo aver modificato il progetto Apps Script, creare una nuova distribuzione Web App e mantenere l'URL della distribuzione nel file `app.js`.

## Sicurezza

La distribuzione attuale è stata usata per il collaudo e non deve essere considerata un endpoint privato. Google documenta che un Web App Apps Script può essere configurato con accesso limitato agli utenti autenticati oppure al dominio, mentre l'accesso anonimo espone il servizio a chiunque conosca l'URL. La successiva fase di produzione deve quindi sostituire l'accesso anonimo con autenticazione Google e controllo dell'utente autorizzato.

In particolare, la lettura JSONP è adatta al collaudo ma Google avverte che JSONP può esporre i dati a pagine di terze parti; per dati personali è preferibile passare a un endpoint autenticato.

## Roadmap

1. autenticazione Google;
2. endpoint API autenticato senza JSONP;
3. eliminazione e sincronizzazione bidirezionale;
4. integrazione Google Calendar;
5. notifiche persistenti/server-side;
6. backup e versionamento degli eventi.
