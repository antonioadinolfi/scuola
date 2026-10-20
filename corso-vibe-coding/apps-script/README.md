# Vibe Coding — Google Apps Script

Questa è una base separata da Adaptive Learning 5.0. Non incollare questi file nel progetto originale.

## Funzioni
- Identificazione tramite account Google Workspace attivo e verifica server-side del dominio `@lscortese.com` e degli elenchi autorizzati.
- Ruoli docente e corsista verificati sul server.
- Pubblicazione di una lezione corrente.
- Caricamento materiali e consegne su Drive.
- Registro utenti, lezioni, materiali e consegne su Google Sheets.
- Limite upload 8 MB per file.

## Installazione
1. Crea un nuovo progetto su https://script.google.com/.
2. Aggiungi Code.gs e Index.html copiando i file di questa cartella.
3. Nelle impostazioni progetto, mostra il file appsscript.json e sostituiscilo con quello presente qui.
4. Nelle Proprietà script imposta TEACHER_EMAILS con l'email del docente e STUDENT_EMAILS con gli account dei corsisti separati da virgole. Il login OAuth client-side non viene più usato. Gli account corsisti non presenti in STUDENT_EMAILS vengono rifiutati: inserire tutti gli indirizzi autorizzati, separati da virgole.
5. Nel file Code.gs seleziona setupVibeCoding ed esegui una volta; autorizza Sheets e Drive.
6. Distribuisci come App web, esecuzione come Me, accesso limitato agli utenti del dominio `lscortese.com` se l'opzione è disponibile. Seleziona il dominio della scuola come pubblico autorizzato; non lasciare accesso anonimo per il collaudo reale.
7. Prova con account docente, corsista e un account non autorizzato.

## Limiti da risolvere prima dell'uso reale
- Prima dell'uso reale, collaudare login docente/corsista, pubblicazione, download e consegna con un account corsista autorizzato. Verificare inoltre che la distribuzione Apps Script sia limitata al dominio scolastico.
- L'upload usa Base64 ed è limitato a 8 MB.
- Non mettere token o elenchi riservati nel repository pubblico.
- Nessuna fatturazione Cloud Run viene richiesta.

Questi file non sono ancora distribuiti né collegati automaticamente a GitHub Pages. Vanno configurati e collaudati prima dell'uso reale.
\n\n## Aggiornamenti del portale\n\nLe modifiche ai file in questa cartella su GitHub non aggiornano automaticamente il progetto Apps Script già distribuito. Per applicarle al portale in uso, copiare `Code.gs` e `Index.html` aggiornati nell'editor Apps Script, salvare e creare una nuova versione della distribuzione Web App. Non rieseguire `setupVibeCoding()` per i normali aggiornamenti dell'interfaccia o del codice.\n