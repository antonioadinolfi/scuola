# Agenda elettronica

PWA isolata per il sito antonioadinolfiscuola.it.

## Stato
- Interfaccia responsive.
- Vista Oggi / Settimana / Da fare / Alta priorità.
- Inserimento, modifica e completamento.
- PWA + Service Worker.
- Persistenza locale immediata.
- Predisposta per backend Google Apps Script.

## Sincronizzazione cloud
In `app.js`, impostare `API_URL` con l'URL della Web App Apps Script.

Il backend previsto è in `google-apps-script/Code.gs`.

La versione locale non usa account, cookie o dati esterni.
