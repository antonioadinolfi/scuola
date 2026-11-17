# Consegna dei test al docente (Google Apps Script)

Il sito invia l'esito di ogni test a una web app Apps Script del docente. Lo script crea un PDF nella cartella Drive del docente (`Classe/Lezione N/`) e aggiunge una riga al foglio **Registro consegne corso IA**.

## Attivazione (circa 5 minuti)
1. Crea su Drive (account lscortese.com) una cartella `Consegne corso IA` e copia il suo ID (la parte finale dell'URL) in `Code.gs`, al posto di `INSERISCI_ID_CARTELLA`.
2. Vai su <https://script.google.com>, crea un **Nuovo progetto** e incolla il contenuto di `Code.gs`.
3. Esegui una volta la funzione `prova` e concedi le autorizzazioni per Drive e Fogli.
4. Scegli **Distribuisci → Nuova distribuzione → App web**, con *Esegui come: Me* e *Chi ha accesso: Chiunque*. Copia l'URL che termina con `/exec`.
5. Incolla l'URL in `corso-intelligenza-artificiale/ia-config.js` (`appsScriptUrl`), quindi esegui commit e push.

Finché `appsScriptUrl` è vuoto, gli studenti vedono il messaggio «La consegna online non è ancora attiva» e possono scaricare l'esito in un file di testo.

Se in seguito modifichi lo script, usa **Gestisci distribuzioni → Modifica → Nuova versione**: così l'URL resta lo stesso.

## Note
- L'accesso "Chiunque" serve perché il sito (GitHub Pages) non può inviare le credenziali Google dello studente. Lo script accetta solo dati con un formato valido: classe come `5B`, lezione da 1 a 4, punteggio coerente.
- I dati inviati sono: nome e cognome, classe, risposte, punteggio, numero di tentativi ed esercizi completati. Non viene raccolto nient'altro.
- Il punteggio viene calcolato nel browser: serve per il monitoraggio, non come prova d'esame. Per una verifica sommativa usa il test in classe, sotto sorveglianza.
