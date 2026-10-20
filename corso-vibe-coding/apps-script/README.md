# Vibe Coding — Google Apps Script

Questa è una base separata da Adaptive Learning 5.0. Non incollare questi file nel progetto originale.

## Funzioni
- Accesso Google con verifica server-side del token.
- Ruoli docente e corsista verificati sul server.
- Pubblicazione di una lezione corrente.
- Caricamento materiali e consegne su Drive.
- Registro utenti, lezioni, materiali e consegne su Google Sheets.
- Limite upload 8 MB per file.

## Installazione
1. Crea un nuovo progetto su https://script.google.com/.
2. Aggiungi Code.gs e Index.html copiando i file di questa cartella.
3. Nelle impostazioni progetto, mostra il file appsscript.json e sostituiscilo con quello presente qui.
4. Nelle Proprietà script imposta GOOGLE_CLIENT_ID con il Client ID OAuth Web esistente, TEACHER_EMAILS con l'email del docente e STUDENT_EMAILS con gli account dei corsisti separati da virgole. Se STUDENT_EMAILS è vuoto, il codice ammette qualsiasi account Google verificato: per un corso chiuso compilare l'elenco.
5. Nel file Code.gs seleziona setupVibeCoding ed esegui una volta; autorizza Sheets e Drive.
6. Distribuisci come App web, esecuzione come Me, accesso Chiunque. L'accesso anonimo consente di caricare la pagina; le funzioni dati verificano il token e i ruoli sul server.
7. Prova con account docente, corsista e un account non autorizzato.

## Limiti da risolvere prima dell'uso reale
- I file Drive sono privati. Questa prima versione registra e archivia i file, ma non fornisce ancora un download autenticato dei materiali ai corsisti. Va aggiunto un endpoint di download controllato prima di usare il portale con la classe.
- L'upload usa Base64 ed è limitato a 8 MB.
- Non mettere token o elenchi riservati nel repository pubblico.
- Nessuna fatturazione Cloud Run viene richiesta.

Questi file non sono ancora distribuiti né collegati automaticamente a GitHub Pages. Vanno configurati e collaudati prima dell'uso reale.
