# Consegna dei test al docente (Google Apps Script)

Il sito invia l'esito di ogni test a una web app Apps Script del docente. Lo script crea un PDF nella cartella Drive del docente (`Classe/Lezione N/`) e aggiunge una riga al foglio **Registro consegne Python OOP**.

## Attivazione (circa 5 minuti)
1. Crea su Drive una cartella, ad esempio `Consegne Python OOP`, e copia il suo ID: è la parte dell'URL dopo `/folders/`.
2. Vai su <https://script.google.com>, crea un **Nuovo progetto** e incolla il contenuto di `Code.gs`. Sostituisci `INSERISCI_QUI_ID_CARTELLA` con l'ID.
3. Esegui una volta la funzione `prova` e concedi le autorizzazioni per Drive e Fogli.
4. Scegli **Distribuisci → Nuova distribuzione → App web**, con *Esegui come: Me* e *Chi ha accesso: Chiunque*. Copia l'URL che termina con `/exec`.
5. Incolla l'URL in `corso-python-oop/oop-config.js` (`appsScriptUrl`), quindi esegui commit e push.

Se in seguito modifichi lo script, usa **Gestisci distribuzioni → Modifica → Nuova versione**: così l'URL resta lo stesso.

## Note
- L'accesso "Chiunque" serve perché il sito (GitHub Pages) non può inviare le credenziali Google dello studente. Lo script accetta solo dati con un formato valido: classe come `4B`, lezione da 1 a 6, punteggio coerente.
- I dati inviati sono: nome e cognome, classe, risposte, punteggio, numero di tentativi ed esercizi completati. Non viene raccolto nient'altro.
- Il punteggio viene calcolato nel browser: serve per il monitoraggio, non come prova d'esame. Per una verifica sommativa usa il test in classe, sotto sorveglianza.
