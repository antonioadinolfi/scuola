# Vibe Coding — Portale del corso

Questa applicazione Apps Script è separata dal sito informativo statico e da Adaptive Learning 5.0. È pensata per gestire le attività di un corso di 24 ore per docenti.

## Funzioni disponibili nel codice
- Identificazione tramite account Google Workspace e controllo server-side del dominio `@lscortese.com` e degli elenchi autorizzati.
- Ruoli docente e corsista.
- Programma operativo delle sei lezioni, con obiettivi, laboratorio e output atteso.
- Pubblicazione della lezione corrente da parte del docente.
- Caricamento di materiali da parte del docente e download autenticato.
- Invio di elaborati da parte dei corsisti.
- Registro utenti, lezioni, materiali e consegne in Google Sheets.
- Dashboard docente con le ultime 100 consegne e collegamenti ai file in Drive.
- Limite di 8 MB per file.

## Configurazione
1. Crea un progetto separato su https://script.google.com/.
2. Copia `Code.gs` e `Index.html` da questa cartella nel progetto Apps Script.
3. Configura le proprietà dello script `TEACHER_EMAILS` e `STUDENT_EMAILS`, con gli indirizzi autorizzati separati da virgole.
4. Esegui `setupVibeCoding()` una sola volta per creare fogli e cartelle iniziali.
5. Distribuisci come Web App, eseguita come proprietario e limitata agli utenti autorizzati del dominio scolastico, se l'opzione è disponibile. Non abilitare l'accesso anonimo.
6. Verifica il funzionamento con un account docente e, quando disponibile, un account corsista autorizzato.

## Aggiornare un progetto già distribuito
Le modifiche ai file su GitHub **non** aggiornano automaticamente il progetto Apps Script. Per applicarle, copia i file aggiornati `Code.gs` e `Index.html` nell'editor Apps Script, salva e crea una nuova versione della distribuzione Web App. Per gli aggiornamenti ordinari non rieseguire `setupVibeCoding()`.

## Collaudo prima dell'uso reale
- Verificare accesso, ruolo e rifiuto degli account non autorizzati.
- Pubblicare una lezione e controllare che corsisti vedano solo la lezione pubblicata.
- Caricare e scaricare un materiale con entrambi i ruoli.
- Inviare una consegna da un account corsista e verificarne la comparsa nella dashboard docente e in Google Sheets.
- Verificare che la distribuzione sia limitata al dominio scolastico e che le cartelle Drive non siano condivise pubblicamente.

Il backend non richiede Cloud Run né l'attivazione della fatturazione Cloud. L'upload usa Base64 e resta limitato a 8 MB per file.
