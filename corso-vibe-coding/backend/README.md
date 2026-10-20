# Portale Vibe Coding: backend protetto

API Node.js per autenticazione Google Workspace, ruoli e accesso a file privati in Google Drive.

## Sicurezza
- Il server verifica il token Google con `google-auth-library` e controlla audience, email verificata e dominio Workspace.
- L'account deve essere presente in una lista esplicita `TEACHER_EMAILS` o `STUDENT_EMAILS`. Il ruolo non viene accettato dal browser.
- Ogni endpoint protetto verifica il token. Solo il docente può pubblicare la lezione corrente.
- I corsisti ricevono solo materiali associati alla lezione pubblicata e i download vengono trasmessi dall'API, senza URL pubblici Drive.
- Le liste di autorizzazione vuote negano l'accesso. Non inserire chiavi o segreti nel repository.

## Configurazione richiesta
1. Abilitare Google Drive API in un progetto Google Cloud.
2. Configurare un OAuth Web Client ID con origine HTTPS del portale.
3. Creare un service account e conservare le credenziali nel secret manager dell'hosting.
4. Creare una cartella Drive privata per i materiali e condividerla con il service account come Editor.
5. Creare un file JSON privato `portal-config.json`, per esempio:
   `{"currentLesson":1,"title":"Dal linguaggio naturale al software","description":"Fondamenti di vibe coding","publishedAt":null}`
   Condividerlo con il service account come Editor.
6. Impostare le variabili indicate in `.env.example`: ID cartella e file di configurazione, email autorizzate, dominio Workspace, Client ID e origini HTTPS.
7. Configurare il deployment HTTPS del backend, poi aggiornare `portale/config.js` con l'URL reale dell'API.

## Materiali
Caricare PDF, DOC/DOCX, PPT/PPTX e XLS/XLSX nella cartella Drive. Nella descrizione specificare lezione e categoria, per esempio:
`Lezione: 1 | Categoria: Slide | Descrizione: Introduzione al vibe coding`
Un materiale senza numero di lezione non viene mostrato ai corsisti.

## Avvio locale
Richiede Node.js 20+ e credenziali Google disponibili tramite Application Default Credentials:
`npm install`, configurare le variabili ambiente, quindi `npm start`.

## Collaudo obbligatorio
- Docente autorizzato: ruolo `teacher`; corsista autorizzato: ruolo `student`.
- Account non in allowlist e account esterno al dominio: HTTP 403.
- Corsista: lista e download limitati alla lezione pubblicata.
- Corsista che tenta di pubblicare una lezione: HTTP 403.
- Cartella/file Drive non condivisi pubblicamente.
- Verificare accesso, revoca e download con account di prova prima di usare il portale in produzione.

Il codice nel repository non rende da solo operativo il sistema: il backend HTTPS, OAuth, account autorizzati e permessi Drive devono essere configurati e collaudati. Un file già scaricato non può essere revocato dal dispositivo dell'utente.