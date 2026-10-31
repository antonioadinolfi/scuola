/* Corso Octave · dati del corso: lezioni (available: true pubblica la lezione), test ed esercizi.
   Le verifiche degli esercizi sono codice Octave eseguito dopo lo script dello studente, nello stesso workspace:
   superano se non generano errori. _OUTPUT contiene il testo mostrato nella Command Window, _CODE lo script. */
window.OCT_LESSONS = [
  {
    n: 1, available: true, minutes: 60,
    title: 'L’ambiente di lavoro: MATLAB e GNU Octave',
    short: 'Che cos’è il calcolo numerico. Software proprietario e software libero. Command Window, workspace, script .m e funzioni.',
    topics: ['calcolo numerico', 'MATLAB e Octave', 'Command Window', 'workspace', 'script e funzioni'],
    quiz: [
      {
        case: 'Che cosa si intende per calcolo numerico?',
        options: [
          'L’insieme dei metodi (algoritmi) che calcolano con il computer soluzioni approssimate, usando un numero finito di cifre.',
          'Il calcolo che si fa a mano con carta e penna, senza approssimazioni.',
          'Il calcolo simbolico, che manipola le formule e fornisce risultati esatti come √2.',
          'Il calcolo che usa solo numeri interi.'
        ],
        correct: 0,
        feedback: 'Il calcolo numerico rinuncia al risultato esatto in cambio di algoritmi veloci con un errore controllato.',
        hint: 'Pensa a che cosa mostra Octave per sqrt(2): un simbolo o un numero con un certo numero di cifre?'
      },
      {
        case: 'Che cosa mostra Octave e perché?',
        code: '0.1 + 0.2 == 0.3',
        options: [
          'ans = 0: 0.1 e 0.2 sono memorizzati in binario in modo approssimato e la somma differisce da 0.3 per circa 10⁻¹⁷.',
          'ans = 1: la somma è esattamente 0.3.',
          'ans = 0.3000.',
          'Un errore: == non si può usare con i numeri decimali.'
        ],
        correct: 0,
        feedback: 'In doppia precisione 0.1 non è rappresentabile esattamente: per confrontare numeri reali si usa una tolleranza, ad esempio abs(a - b) < 1e-12.',
        hint: 'Ricorda l’esempio di inizio lezione: anche sqrt(2)^2 - 2 non dava 0.'
      },
      {
        case: 'Qual è la differenza principale tra MATLAB e GNU Octave?',
        options: [
          'MATLAB è software proprietario con licenza a pagamento; Octave è software libero (licenza GNU GPL) e gratuito. Il linguaggio è in gran parte lo stesso.',
          'Octave usa un linguaggio completamente diverso da MATLAB.',
          'MATLAB lavora solo con numeri interi, Octave anche con le matrici.',
          'Octave funziona solo online, MATLAB solo installato sul computer.'
        ],
        correct: 0,
        feedback: 'La gran parte degli script scritti per MATLAB funziona anche in Octave: la differenza principale è la licenza.',
        hint: 'Rileggi la tabella di confronto: guarda le righe «Licenza» e «Linguaggio».'
      },
      {
        case: 'Che cosa garantisce una licenza di software libero come la GNU GPL?',
        options: [
          'La libertà di usare il programma, studiarne il codice sorgente, modificarlo e ridistribuirlo.',
          'Soltanto che il programma è gratuito.',
          'Che il programma non contiene errori.',
          'Che il programma può essere usato solo a scuola.'
        ],
        correct: 0,
        feedback: '«Libero» si riferisce alla libertà, non (solo) al prezzo: chiunque può leggere e migliorare il codice di Octave.',
        hint: 'Il software libero è definito da quattro libertà: quali?'
      },
      {
        case: 'Si esegue questo script. Che cosa compare nella Command Window?',
        code: 'a = 5;\nb = a * 2',
        options: ['Solo b = 10', 'a = 5 e poi b = 10', 'Niente', 'ans = 10'],
        correct: 0,
        feedback: 'Il punto e virgola finale esegue l’istruzione senza mostrarne il risultato; la seconda riga non lo ha.',
        hint: 'Quale delle due righe termina con il punto e virgola?'
      },
      {
        case: 'Dopo questi comandi, in quale variabile si trova il risultato 7?',
        code: 'x = 3;\ny = x + 1;\nx + y',
        options: ['ans', 'x', 'y', 'In nessuna: il risultato viene solo mostrato'],
        correct: 0,
        feedback: 'Quando un’espressione non viene assegnata a una variabile, Octave mette il risultato in ans (answer).',
        hint: 'L’ultima riga non contiene il segno =: dove finisce il risultato?'
      },
      {
        case: 'Quale di questi è un nome di variabile valido in Octave?',
        options: ['media_voti', '2voti', 'media voti', 'media-voti'],
        correct: 0,
        feedback: 'Un nome comincia con una lettera e contiene solo lettere, cifre e il trattino basso _.',
        hint: 'Gli spazi e il segno meno non sono ammessi, e il nome non può iniziare con una cifra.'
      },
      {
        case: 'Che cosa succede eseguendo questo script?',
        code: 'Raggio = 4;\narea = pi * raggio^2',
        options: [
          'Errore: \'raggio\' undefined, perché Octave distingue maiuscole e minuscole.',
          'Mostra area = 50.265.',
          'Mostra area = 0, perché raggio non ha valore.',
          'Errore di sintassi nella prima riga.'
        ],
        correct: 0,
        feedback: 'Raggio e raggio sono due nomi diversi: la variabile creata è Raggio, quella usata è raggio.',
        hint: 'Confronta lettera per lettera il nome nella prima e nella seconda riga.'
      },
      {
        case: 'Quale comando cancella tutte le variabili dal workspace?',
        options: ['clear', 'clc', 'who', 'close all'],
        correct: 0,
        feedback: 'clear cancella le variabili; clc pulisce solo la Command Window, who le elenca, close all chiude le finestre dei grafici.',
        hint: 'Uno dei comandi pulisce lo schermo ma lascia le variabili: non è quello giusto.'
      },
      {
        case: 'Dopo aver eseguito questo script, quali variabili ci sono nel workspace?',
        code: 'h = ipotenusa(3, 4);\n\nfunction c = ipotenusa(a, b)\n  c = sqrt(a^2 + b^2);\nend',
        options: ['Solo h', 'h, a, b e c', 'a, b e c', 'h e c'],
        correct: 0,
        feedback: 'Le variabili di una funzione (parametri e uscite) sono locali: esistono solo mentre la funzione è in esecuzione. Il risultato arriva nello script tramite h.',
        hint: 'Le variabili create dentro una funzione restano visibili dopo che la funzione è terminata?'
      }
    ]
  },
  { n: 2, available: false, minutes: 60, title: 'Tipi di dato e operazioni', short: 'Scalari, vettori e matrici come tipi nativi. Precedenza degli operatori, numeri reali e complessi, funzioni matematiche predefinite.', topics: ['scalari, vettori, matrici', 'precedenza', 'numeri complessi', 'funzioni predefinite'], quiz: [] },
  { n: 3, available: false, minutes: 60, title: 'Creare e indicizzare vettori e matrici', short: 'Vettori riga e colonna, operatore due punti, linspace. Matrici speciali: eye, zeros, ones. Indici, end e sottomatrici.', topics: ['vettori riga e colonna', 'colon operator', 'linspace', 'eye, zeros, ones', 'indicizzazione'], quiz: [] },
  { n: 4, available: false, minutes: 60, title: 'Operazioni matriciali e puntuali', short: 'Prodotto riga per colonna e operazioni elemento per elemento (.*, ./, .^). Trasposta, determinante, traccia e inversa.', topics: ['* e .*', './ e .^', 'trasposta', 'det, trace, inv'], quiz: [] },
  { n: 5, available: false, minutes: 60, title: 'Sistemi lineari e operatore backslash', short: 'Dal sistema alla forma matriciale Ax = b. Risoluzione con \\, verifica con il residuo, sistemi impossibili e indeterminati.', topics: ['forma matriciale', 'backslash \\', 'residuo', 'matrici singolari'], quiz: [] },
  { n: 6, available: false, minutes: 60, title: 'Il metodo di Gauss', short: 'Eliminazione in avanti, pivot, sostituzione all’indietro. Implementazione dell’algoritmo con i cicli for.', topics: ['eliminazione', 'pivoting', 'sostituzione all’indietro', 'algoritmo'], quiz: [] },
  { n: 7, available: false, minutes: 60, title: 'Il metodo di Gauss-Jordan', short: 'Riduzione completa a scala, confronto con Gauss, rref, calcolo dell’inversa con la matrice [A | I].', topics: ['riduzione completa', 'rref', 'inversa con [A|I]', 'confronto tra metodi'], quiz: [] },
  { n: 8, available: false, minutes: 60, title: 'Grafici 2D', short: 'La funzione plot, colori e tipi di linea, etichette degli assi, titolo, legenda e griglia.', topics: ['plot', 'stili di linea', 'xlabel, ylabel, title', 'legend, grid'], quiz: [] },
  { n: 9, available: false, minutes: 60, title: 'Più grafici e progetto finale', short: 'figure e hold on, sottografici con subplot. Progetto conclusivo e test finale del corso.', topics: ['figure', 'hold on', 'subplot', 'progetto', 'test finale'], quiz: [] }
];

window.OCT_EXERCISES = {
  'l1-e1': {
    checks: [
      { t: 'Le variabili g e t hanno i valori dati', c: "assert(exist('g', 'var') && exist('t', 'var'), 'mancano le variabili g e t');\nassert(g == 9.81 && t == 3, 'g vale %g e t vale %g', g, t);", h: 'Non modificare le prime due assegnazioni: cambia solo come terminano.' },
      { t: 'h contiene lo spazio percorso ½·g·t²', c: "assert(exist('h', 'var') == 1, 'manca la variabile h');\nassert(abs(h - 0.5 * 9.81 * 3^2) < 1e-9, 'h vale %g', h);", h: 'Togli il % davanti alla riga di h: il simbolo % trasforma la riga in un commento.' },
      { t: 'v contiene la velocità g·t', c: "assert(exist('v', 'var') == 1, 'manca la variabile v');\nassert(abs(v - 9.81 * 3) < 1e-9, 'v vale %g', v);", h: 'Togli il % davanti alla riga di v.' },
      { t: 'Nella Command Window compaiono solo h e v', c: "assert(~isempty(strfind(_OUTPUT, 'h =')) && ~isempty(strfind(_OUTPUT, 'v =')), 'h e v devono comparire: non terminare le loro righe con ;');\nassert(isempty(strfind(_OUTPUT, 'g =')) && isempty(strfind(_OUTPUT, 't =')), 'g e t compaiono ancora: termina le loro righe con ;');", h: 'Il punto e virgola alla fine di una riga esegue l’istruzione senza mostrarne il risultato.' }
    ],
    hints: [
      'Il simbolo % inizia un commento: Octave ignora tutto ciò che lo segue sulla riga. Per «attivare» una riga togli il %.',
      'Metti il punto e virgola alla fine delle righe di g e t; lascia senza punto e virgola quelle di h e v.',
      'Le formule: h = 1/2 * g * t^2 e v = g * t. L’elevamento a potenza si scrive con ^.'
    ],
    solution: `% Caduta libera: un sasso cade da fermo per t secondi.
% Mostra nella Command Window SOLO l'altezza h e la velocità v.
g = 9.81;     % accelerazione di gravità (m/s^2)
t = 3;        % tempo (s)

h = 1/2 * g * t^2

v = g * t
`
  },
  'l1-e2': {
    checks: [
      { t: 'Lo script viene eseguito senza errori', c: "assert(true);", h: 'Esegui lo script: il messaggio di errore indica la riga del primo problema.' },
      { t: 'ipotenusa vale 10', c: "assert(exist('ipotenusa', 'var') == 1, 'manca la variabile ipotenusa (tutta minuscola)');\nassert(abs(ipotenusa - 10) < 1e-12, 'ipotenusa vale %g', ipotenusa);", h: 'Ogni parentesi aperta va chiusa: sqrt( … ).' },
      { t: 'area vale 24', c: "assert(exist('area', 'var') == 1, 'manca la variabile area');\nassert(abs(area - 24) < 1e-12, 'area vale %g', area);", h: 'Octave non sottintende la moltiplicazione: tra due valori serve *.' },
      { t: 'perimetro vale 24', c: "assert(exist('perimetro', 'var') == 1, 'manca la variabile perimetro');\nassert(abs(perimetro - 24) < 1e-12, 'perimetro vale %g', perimetro);", h: 'Il nome della variabile deve essere scritto esattamente come quando l’hai creata, maiuscole comprese.' }
    ],
    hints: [
      'Primo errore (riga 5): conta le parentesi aperte e quelle chiuse.',
      'Secondo errore (riga 6): in matematica scrivi «a b» per il prodotto, in Octave serve a * b.',
      'Terzo errore (riga 7): la variabile si chiama ipotenusa, con la i minuscola.'
    ],
    solution: `% Triangolo rettangolo: cateti di 6 cm e 8 cm.
% Lo script contiene TRE errori: correggili uno alla volta.
cateto1 = 6;
cateto2 = 8;
ipotenusa = sqrt(cateto1^2 + cateto2^2);
area = cateto1 * cateto2 / 2
perimetro = cateto1 + cateto2 + ipotenusa
`
  },
  'l1-e3': {
    checks: [
      { t: 'Esiste la funzione volume_cilindro', c: "assert(exist('volume_cilindro') > 0, 'la funzione volume_cilindro non esiste');", h: 'La funzione è già dichiarata in fondo allo script: non cambiarne il nome.' },
      { t: 'volume_cilindro(1, 1) restituisce π', c: "w = volume_cilindro(1, 1);\nassert(abs(w - pi) < 1e-9, 'volume_cilindro(1, 1) restituisce %g invece di 3.1416', w);", h: 'Dentro la funzione assegna il risultato all’uscita v: v = pi * r^2 * h;' },
      { t: 'Funziona con altri valori: volume_cilindro(2, 5) = 20π', c: "w = volume_cilindro(2, 5);\nassert(abs(w - 20*pi) < 1e-9, 'volume_cilindro(2, 5) restituisce %g invece di 62.832', w);", h: 'Usa i parametri r e h nella formula, non i numeri della lattina.' },
      { t: 'lattina contiene il volume della lattina', c: "assert(exist('lattina', 'var') == 1, 'manca la variabile lattina');\nassert(abs(lattina - pi * 3.3^2 * 11.5) < 1e-6, 'lattina vale %g', lattina);", h: 'La prima riga dello script chiama già la funzione con 3.3 e 11.5: basta completare la funzione.' }
    ],
    hints: [
      'Il volume del cilindro è area di base per altezza: π r² h. In Octave π si scrive pi.',
      'Una funzione restituisce il valore che si trova nella variabile di uscita, qui v. Scrivi v = … dentro la funzione.',
      'Metti il punto e virgola alla riga dentro la funzione, altrimenti ogni chiamata mostra anche v = …'
    ],
    solution: `% Completa la funzione in fondo allo script, poi usala.
% Una lattina ha raggio 3.3 cm e altezza 11.5 cm.
lattina = volume_cilindro(3.3, 11.5)

function v = volume_cilindro(r, h)
  % calcola il volume del cilindro: area di base per altezza
  v = pi * r^2 * h;
end
`
  },
  'l1-e4': {
    checks: [
      { t: 'x approssima la radice di 10', c: "assert(exist('x', 'var') == 1, 'manca la variabile x');\nassert(abs(x^2 - 10) < 1e-10, 'x^2 vale %.15g, non abbastanza vicino a 10', x^2);", h: 'Ripeti l’aggiornamento x = (x + 10/x) / 2 finché la condizione del while è vera.' },
      { t: 'passi conta le iterazioni eseguite', c: "y = 1; n = 0;\nwhile abs(y^2 - 10) >= 1e-12\n  y = (y + 10/y) / 2;\n  n = n + 1;\nend\nassert(exist('passi', 'var') == 1, 'manca la variabile passi');\nassert(passi == n, 'passi vale %d, ma le iterazioni necessarie sono %d', passi, n);", h: 'Dentro il ciclo, a ogni giro, aumenta passi di 1: passi = passi + 1;' },
      { t: 'Usi un ciclo while e non la funzione sqrt', c: "assert(~isempty(strfind(_CODE, 'while')), 'usa un ciclo while');\nassert(isempty(regexp(_CODE, 'sqrt\\s*\\(', 'once')), 'non usare sqrt: lo scopo è calcolare la radice con un algoritmo');", h: 'Lo scopo dell’esercizio è ottenere la radice con l’algoritmo di Erone, senza la funzione predefinita.' }
    ],
    hints: [
      'La condizione del while dice quando continuare: finché l’errore è grande, cioè abs(x^2 - 10) >= 1e-12.',
      'Nel corpo del ciclo servono due istruzioni: x = (x + 10/x) / 2; e passi = passi + 1;',
      'Il ciclo while si chiude con end, come if e for.'
    ],
    solution: `% Radice quadrata di 10 con il metodo di Erone, senza usare sqrt.
% Ripeti x = (x + 10/x) / 2 finché |x^2 - 10| >= 1e-12
% e conta i passi nella variabile passi.
x = 1;
passi = 0;
while abs(x^2 - 10) >= 1e-12
  x = (x + 10/x) / 2;
  passi = passi + 1;
end
fprintf('radice di 10 = %.12f dopo %d passi\\n', x, passi);
`
  }
};
