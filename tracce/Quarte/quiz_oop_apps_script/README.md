# Quiz OOP Python (classe quarta): correzione e consegna con Google Apps Script

La pagina `tracce/Quarte/quiz_oop_python.html` non contiene le soluzioni. Alla consegna invia le risposte a questa web app, che:

1. verifica l'identità dello studente con il token di accesso Google (solo account `@lscortese.com`);
2. corregge il test con la chiave contenuta in `Chiave.gs`; il test è superato con almeno il 70% di risposte esatte (14 su 20);
3. crea un PDF con i dati dello studente, l'esito e il dettaglio delle risposte;
4. salva il PDF nella cartella Drive **Consegne Quiz OOP Python**, divisa per classe, e aggiunge una riga al foglio **Registro Quiz OOP Python**.

L'invio del PDF per email ad `antonioadinolfi@lscortese.com` è **disattivato** per non riempire la casella di posta. Per riattivarlo, in `Code.gs` imposta `INVIA_EMAIL = true` e distribuisci una nuova versione.

Allo studente viene mostrato solo il punteggio e l'esito (superato o non superato).

## Attivazione (circa 5 minuti, con l'account @lscortese.com)

1. Apri <https://script.google.com> e crea un **Nuovo progetto**, chiamato per esempio `Quiz OOP Python – consegne`.
2. Incolla il contenuto di `Code.gs` nel file `Code.gs` del progetto.
3. Crea un secondo file con **+ → Script**, chiamalo `Chiave`, e incolla il contenuto di `Chiave.gs`. Questo file ti è stato consegnato a parte e **non** si trova nel repository, perché contiene le risposte esatte.
4. Seleziona la funzione `autorizza` ed eseguila. Concedi le autorizzazioni richieste (Drive, Fogli, invio email, connessioni esterne). La cartella e il registro vengono creati alla prima consegna.
5. Facoltativo: esegui `provaConsegna`. Nella sottocartella `PROVE` della cartella Drive compare un PDF di prova.
6. Scegli **Distribuisci → Nuova distribuzione → App web**, con *Esegui come: Me* e *Chi ha accesso: Chiunque*. Copia l'URL che termina con `/exec`.
7. Nel file `tracce/Quarte/quiz_oop_python.html` incolla l'URL in `appsScriptUrl` (cerca `appsScriptUrl: ""`), poi fai commit e push.

Se in seguito modifichi lo script, usa **Gestisci distribuzioni → Modifica → Nuova versione**: così l'URL resta lo stesso.

## Sicurezza e limiti

- **Accesso "Chiunque".** Serve perché il sito (GitHub Pages) non può inviare le credenziali Google dello studente. La protezione sta nel token: lo script lo verifica presso Google (`oauth2.googleapis.com/tokeninfo`) e accetta solo token emessi per il client ID del sito, con email verificata del dominio `lscortese.com` e non scaduti.
- **Correzione sul server.** Il punteggio è calcolato dallo script: lo studente non può inviare un punteggio falso, né trovare le soluzioni nel codice della pagina. Le versioni precedenti del quiz, con le soluzioni, restano però nella cronologia di GitHub.
- **Classe.** La classe è scritta dallo studente e non viene verificata. Nome, cognome ed email arrivano invece dall'account Google.
- **Tentativi.** Un nuovo tentativo non viene bloccato: ogni consegna viene registrata con il suo numero di tentativo, calcolato sull'email.
- **Doppio invio.** Se la stessa consegna arriva due volte (per esempio dopo un errore di rete), viene registrata una sola volta.
- **Email.** Con l'invio attivo vale il limite giornaliero di Apps Script (`MailApp.getRemainingDailyQuota()`). Se un invio fallisce, il PDF resta comunque su Drive e nel registro compare `Email inviata: no`.
- **Durata e orari del dispositivo.** Inizio e fine sono letti dall'orologio del dispositivo. L'ora di ricezione è quella del server.

## Cambiare le domande

Se modifichi i casi del quiz, aggiorna sia la pagina sia `Chiave.gs` (testi delle opzioni e indice `corretta`, da 0 a 3) e cambia `QUIZ_ID` in entrambi. In questo modo una pagina vecchia rimasta aperta non può consegnare risposte riferite a domande diverse.
