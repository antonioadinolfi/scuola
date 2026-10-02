# Agenda personale — Prof. Antonio Adinolfi

Agenda web/PWA con dati manuali locali e aggiornamento automatico degli impegni.

Funzioni:
- calendario mensile;
- inserimento manuale;
- dettatura vocale del browser;
- importazione di PDF testuali con estrazione automatica di data/ora;
- modifica, completamento ed eliminazione;
- ricerca e stampa;
- backup/ripristino JSON;
- documenti allegati agli appuntamenti, salvati localmente nel browser;
- importazione automatica degli impegni dal sito della scuola;
- sincronizzazione opzionale con Google Calendar tramite indirizzo segreto iCal;
- PWA e Service Worker.

## Sincronizzazione Google Calendar

L'agente GitHub Actions può leggere uno o più calendari Google in sola lettura tramite il loro **"Indirizzo segreto in formato iCal"**. Google documenta questo meccanismo come sincronizzazione di sola visualizzazione e specifica che l'indirizzo segreto deve essere trattato come una credenziale. urlDocumentazione Google Calendarhttps://support.google.com/calendar/answer/37648?hl=it

Per attivarla:

1. Aprire Google Calendar.
2. Impostazioni → scegliere il calendario → **Integra calendario**.
3. Copiare **Indirizzo segreto in formato iCal**.
4. Nel repository GitHub aprire **Settings → Secrets and variables → Actions**.
5. Creare il secret:
   `GOOGLE_CALENDAR_ICAL_URLS`
6. Incollare nel secret uno o più indirizzi iCal, uno per riga.
7. Avviare manualmente il workflow **Aggiornamento automatico agenda** oppure attendere l'esecuzione programmata.

L'agente:
- importa gli eventi futuri e quelli degli ultimi 30 giorni;
- mantiene una finestra di sincronizzazione di 365 giorni;
- gestisce anche gli eventi ricorrenti;
- riconosce automaticamente le classi presenti nel titolo;
- propaga spostamenti e cancellazioni dal calendario;
- non salva nel JSON l'indirizzo segreto iCal;
- mantiene gli impegni inseriti manualmente nell'agenda.

Il workflow è programmato ogni 6 ore.

### Nota sulla privacy

L'indirizzo iCal resta protetto dal secret GitHub, ma il file `agenda-agent.json` pubblicato dal sito contiene gli eventi importati. Quindi questa implementazione **non deve essere considerata una soluzione di riservatezza completa** per dati personali. Per una vera agenda privata sincronizzata tra dispositivi occorrerà spostare il feed degli eventi dietro autenticazione, ad esempio con un backend/API privato o con accesso OAuth diretto a Google Calendar.

### PDF

I PDF composti esclusivamente da immagini/scansioni non contengono testo estraibile; per questi sarà necessario OCR.
