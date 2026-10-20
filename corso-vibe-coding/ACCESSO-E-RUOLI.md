# Portale Vibe Coding: profili e accesso

## Docente
- Consulta tutte le sei lezioni.
- Accede all'archivio Appunti e materiali.
- Filtra i documenti per lezione e formato.
- Pubblica la lezione visibile ai corsisti.

## Corsista
- Consulta solo la lezione corrente pubblicata.
- Accede esclusivamente ai materiali associati alla lezione.
- Non può modificare la lezione o accedere all'archivio completo.

## Componenti
- Frontend: `portale/`
- API con verifica token e ruoli lato server: `backend/`
- Archivio privato: Google Drive, accessibile al service account e tramite API autenticata.

## Da configurare prima dell'uso reale
Progetto Google Cloud, OAuth Client ID e origini autorizzate, service account, cartella Drive privata, file JSON di configurazione, liste esatte di email autorizzate, hosting HTTPS e URL API in `portale/config.js`. Le liste vuote negano l'accesso.

La sola pubblicazione GitHub Pages non fornisce protezione dei file. Non collocare materiali riservati o credenziali nel repository pubblico. Consultare `backend/README.md` per la procedura completa.