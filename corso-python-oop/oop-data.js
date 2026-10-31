/* Corso Python OOP · dati delle lezioni, dei test e degli esercizi con verifiche automatiche.
   Test: per ogni domanda `correct` è l'indice (da 0) dell'opzione esatta; le opzioni vengono mescolate a video.
   Esercizi: ogni verifica `c` è codice Python eseguito dopo quello dello studente (stesse variabili);
   supera se non solleva eccezioni. `_OUTPUT` contiene ciò che il programma dello studente ha stampato. */
"use strict";
window.OOP_LESSONS = [
  {
    n: 1, available: true, minutes: 60,
    title: 'Dal mondo reale alle classi',
    short: 'Classi e oggetti, il costruttore __init__, il parametro self e il primo diagramma UML delle classi.',
    topics: ['class', 'oggetto/istanza', '__init__', 'self', 'UML: i tre riquadri'],
    quiz: [
      {
        case: 'Quale frase descrive correttamente il rapporto tra classe e oggetto?',
        options: [
          'La classe è il modello; gli oggetti sono istanze create da quel modello, ciascuna con i propri valori.',
          'Classe e oggetto sono sinonimi: in Python indicano la stessa cosa.',
          'Da una classe si può creare un solo oggetto alla volta.',
          'Un oggetto contiene più classi, che ne sono le istanze.'
        ],
        correct: 0,
        feedback: 'Come uno stampo e i biscotti: un modello, tanti oggetti indipendenti.',
        hint: 'Pensa a Smartphone e ai due telefoni s1 e s2 creati nella lezione: quanti oggetti abbiamo creato dalla stessa classe?'
      },
      {
        case: 'Che cosa stampa questo programma?',
        code: 'class Punto:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Punto(3, 4)\nprint(p.y)',
        options: ['4', '3', '(3, 4)', 'Un errore: y non è definito'],
        correct: 0,
        feedback: 'Il secondo argomento (4) arriva nel parametro y e viene salvato in self.y.',
        hint: 'Segui gli argomenti: 3 va in x, 4 va in y. Che cosa contiene p.y?'
      },
      {
        case: 'Che cos’è self nei metodi di una classe?',
        options: [
          'Il riferimento all’oggetto su cui il metodo viene chiamato.',
          'Una parola chiave che rende privati gli attributi.',
          'Il nome della classe, scritto in minuscolo.',
          'Un parametro facoltativo che si può omettere senza conseguenze.'
        ],
        correct: 0,
        feedback: 'In s1.ricarica(20), self è proprio s1.',
        hint: 'Ricorda l’equivalenza s1.ricarica(20) ↔ Smartphone.ricarica(s1, 20): che cosa finisce nel primo parametro?'
      },
      {
        case: 'Che cosa succede eseguendo questo codice?',
        code: 'class Gatto:\n    def __init__(nome):\n        self.nome = nome\n\ng = Gatto("Micio")',
        options: [
          'TypeError: __init__ riceve un argomento di troppo, perché manca self tra i parametri.',
          'Viene creato il gatto Micio senza problemi.',
          'SyntaxError: __init__ non può avere parametri.',
          'Il gatto viene creato ma l’attributo nome vale None.'
        ],
        correct: 0,
        feedback: 'Python passa sempre l’oggetto come primo argomento: senza self gli argomenti non tornano.',
        hint: 'Quanti argomenti passa Python a __init__ quando scrivi Gatto("Micio")? Quanti parametri sono dichiarati?'
      },
      {
        case: 'Che cosa stampa questo programma?',
        code: 'class Contatore:\n    def __init__(self):\n        self.valore = 0\n\n    def incrementa(self):\n        self.valore += 1\n\na = Contatore()\nb = Contatore()\na.incrementa()\na.incrementa()\nb.incrementa()\nprint(a.valore, b.valore)',
        options: ['2 1', '3 3', '2 0', '1 1'],
        correct: 0,
        feedback: 'Ogni oggetto ha il proprio stato: modificare a non cambia b.',
        hint: 'a e b sono due oggetti distinti, ognuno con il suo attributo valore. Conta le chiamate su ciascuno.'
      },
      {
        case: 'In un diagramma UML delle classi, che cosa contengono i tre riquadri, dall’alto verso il basso?',
        options: [
          'Nome della classe, attributi, metodi.',
          'Attributi, metodi, nome della classe.',
          'Nome della classe, metodi, oggetti creati.',
          'Nome della classe, valori degli attributi, programma principale.'
        ],
        correct: 0,
        feedback: 'Nome in alto, poi lo stato (attributi), poi il comportamento (metodi).',
        hint: 'Riguarda il diagramma di Smartphone: dove compaiono marca, modello e batteria? E ricarica()?'
      },
      {
        case: 'Che cosa succede eseguendo questo codice?',
        code: 'class Auto:\n    def __init__(self, targa):\n        targa = targa\n\na = Auto("AB123CD")\nprint(a.targa)',
        options: [
          'AttributeError: la targa non è mai stata salvata nell’oggetto.',
          'Stampa AB123CD.',
          'Stampa None.',
          'SyntaxError alla riga 3.'
        ],
        correct: 0,
        feedback: 'Senza self. la riga 3 crea solo una variabile locale, che sparisce alla fine di __init__.',
        hint: 'La riga 3 scrive targa = targa: dove viene salvato il valore? Nell’oggetto o in una variabile locale?'
      },
      {
        case: 'Se s è un oggetto della classe Smartphone, a che cosa equivale la chiamata s.ricarica(20)?',
        options: ['Smartphone.ricarica(s, 20)', 'ricarica(s, 20)', 'Smartphone.ricarica(20)', 's.ricarica(s, 20)'],
        correct: 0,
        feedback: 'È esattamente ciò che fa Python: chiama il metodo della classe passando l’oggetto come self.',
        hint: 'Il metodo appartiene alla classe; l’oggetto viene passato come primo argomento.'
      },
      {
        case: '«Uno studente ha un nome e una media; può aggiungere un voto.» Come si distribuiscono gli elementi nel diagramma UML?',
        options: [
          'Attributi: nome, media · Metodi: aggiungi_voto(voto)',
          'Attributi: aggiungi_voto · Metodi: nome(), media()',
          'Attributi: studente, voto · Metodi: nome(), media()',
          'Attributi: nome, media, aggiungi_voto · Nessun metodo'
        ],
        correct: 0,
        feedback: 'I sostantivi che descrivono lo stato diventano attributi, le azioni diventano metodi.',
        hint: 'Sottolinea nel testo i sostantivi (che cosa lo studente HA) e i verbi (che cosa PUÒ FARE).'
      },
      {
        case: 'Che cosa stampa print(type("ciao"))?',
        options: ["<class 'str'>", "'ciao'", 'string', "<object 'ciao'>"],
        correct: 0,
        feedback: 'Anche una stringa è un oggetto: un’istanza della classe str. Per questo ha metodi come upper().',
        hint: 'type() restituisce la classe di un oggetto. Di quale classe è il testo "ciao"?'
      }
    ]
  },
  { n: 2, available: false, minutes: 60, title: 'Attributi e metodi', short: 'Attributi di istanza e di classe, metodi che modificano lo stato, __str__ e __repr__. UML con i tipi.', topics: ['attributi di classe', 'metodi', '__str__', 'UML con tipi'], quiz: [] },
  { n: 3, available: false, minutes: 60, title: 'Incapsulamento', short: 'Proteggere lo stato: convenzioni _ e __, @property e setter con validazione. Visibilità + − # in UML.', topics: ['_attributo', '@property', 'setter', 'UML: visibilità'], quiz: [] },
  { n: 4, available: false, minutes: 60, title: 'Ereditarietà', short: 'Sottoclassi, super(), override dei metodi, isinstance. La generalizzazione in UML.', topics: ['sottoclassi', 'super()', 'override', 'UML: generalizzazione'], quiz: [] },
  { n: 5, available: false, minutes: 60, title: 'Polimorfismo e metodi speciali', short: 'Stesso messaggio, comportamenti diversi. Duck typing, __eq__, __lt__, __add__, classi astratte.', topics: ['polimorfismo', 'duck typing', 'metodi speciali', 'abc'], quiz: [] },
  { n: 6, available: false, minutes: 60, title: 'Relazioni tra classi e progettazione', short: 'Associazione, aggregazione e composizione. Dal testo del problema al diagramma, al codice. Test finale del corso.', topics: ['associazione', 'composizione', 'progettazione', 'test finale'], quiz: [] }
];

window.OOP_EXERCISES = {
  'l1-e1': {
    checks: [
      { t: 'Esiste la classe Libro', c: 'assert isinstance(Libro, type), "Libro non è una classe"', h: 'La classe deve chiamarsi esattamente Libro, con la L maiuscola.' },
      { t: '__init__ salva titolo, autore e pagine negli attributi', c: 'x = Libro("A", "B", 10)\nassert (x.titolo, x.autore, x.pagine) == ("A", "B", 10), "attributi trovati: " + str(vars(x))', h: 'Sostituisci pass con tre assegnazioni del tipo self.titolo = titolo.' },
      { t: 'Esiste l’oggetto l1 della classe Libro', c: 'assert isinstance(l1, Libro), "l1 non è un Libro"', h: 'Crea l’oggetto chiamando la classe: l1 = Libro(…, …, …).' },
      { t: 'l1 contiene i dati richiesti', c: 'assert (l1.titolo, l1.autore, l1.pagine) == ("Il barone rampante", "Italo Calvino", 283), "l1 contiene: " + str(vars(l1))', h: 'Controlla l’ordine degli argomenti e che il numero di pagine sia un intero (283, senza virgolette).' }
    ],
    hints: [
      'Dentro __init__, self è il libro appena creato: scrivi self.titolo = titolo per “attaccargli” il titolo.',
      'Servono tre righe, una per attributo, tutte rientrate di 8 spazi (sono dentro def, che è dentro class).',
      'Per creare l’oggetto: l1 = Libro("Il barone rampante", "Italo Calvino", 283). Self non si passa: ci pensa Python.'
    ],
    solution: `class Libro:
    def __init__(self, titolo, autore, pagine):
        self.titolo = titolo
        self.autore = autore
        self.pagine = pagine


l1 = Libro("Il barone rampante", "Italo Calvino", 283)

print(l1.titolo, "di", l1.autore, "-", l1.pagine, "pagine")
`
  },
  'l1-e2': {
    checks: [
      { t: 'Il costruttore riceve nome e razza e li salva', c: 'c = Cane("Rex", "pastore")\nassert c.nome == "Rex" and c.razza == "pastore", "attributi trovati: " + str(vars(c))', h: 'def __init__(self, nome, razza): con self.nome = nome e self.razza = razza.' },
      { t: 'Appena creato, il cane ha età 0', c: 'c = Cane("Rex", "pastore")\nassert getattr(c, "eta", None) == 0, "eta vale " + repr(getattr(c, "eta", "(mancante)"))', h: 'eta non è un parametro: assegnale direttamente 0 in __init__ (self.eta = 0).' },
      { t: 'abbaia() restituisce "<nome> dice: Bau!"', c: 'c = Cane("Rex", "pastore")\nr = c.abbaia()\nassert r == "Rex dice: Bau!", "abbaia() restituisce " + repr(r)', h: 'Usa return (non print) e il nome dell’oggetto: return self.nome + " dice: Bau!"' },
      { t: 'compleanno() aumenta l’età di 1', c: 'c = Cane("Rex", "pastore")\nc.compleanno(); c.compleanno(); c.compleanno()\nassert c.eta == 3, "dopo 3 compleanni eta vale " + repr(c.eta)', h: 'Dentro compleanno(): self.eta = self.eta + 1 (oppure self.eta += 1).' },
      { t: 'Ogni cane ha la propria età', c: 'a = Cane("A", "x"); b = Cane("B", "y")\na.compleanno()\nassert b.eta == 0, "il compleanno di un cane ha cambiato l’età di un altro"', h: 'Usa sempre self.eta, cioè l’età di quel cane, non una variabile comune.' },
      { t: 'Il programma crea fido con 2 anni e stampa il suo verso', c: 'assert isinstance(fido, Cane) and fido.eta == 2, "fido non ha 2 anni"\nassert "Fido dice: Bau!" in _OUTPUT, "non trovo Fido dice: Bau! nell’output"', h: 'Lascia invariato il programma di prova in fondo: deve funzionare con la tua classe.' }
    ],
    hints: [
      'Parti dal riquadro centrale del diagramma: ogni attributo diventa una riga self.<attributo> = … dentro __init__.',
      'Il riquadro in basso elenca i metodi: ognuno è un def dentro la classe con self come primo parametro.',
      'abbaia() deve restituire il testo con return; sarà il programma di prova a stamparlo con print.'
    ],
    solution: `class Cane:
    def __init__(self, nome, razza):
        self.nome = nome
        self.razza = razza
        self.eta = 0

    def abbaia(self):
        return self.nome + " dice: Bau!"

    def compleanno(self):
        self.eta += 1


fido = Cane("Fido", "beagle")
fido.compleanno()
fido.compleanno()
print(fido.abbaia())
print("Età:", fido.eta)
`
  },
  'l1-e3': {
    checks: [
      { t: 'Il costruttore salva il luogo', c: 't = Termometro("Lab")\nassert t.luogo == "Lab"', h: 'Al costruttore manca un parametro: qual è il primo parametro di ogni metodo?' },
      { t: 'La temperatura iniziale è 20 ed è un attributo', c: 't = Termometro("Lab")\nassert getattr(t, "gradi", None) == 20, "gradi vale " + repr(getattr(t, "gradi", "(mancante)"))', h: 'gradi = 20 crea una variabile locale che sparisce: deve diventare un attributo dell’oggetto.' },
      { t: 'descrivi() restituisce "luogo: gradi °C"', c: 't = Termometro("Lab")\nt.imposta(18)\nr = t.descrivi()\nassert r == "Lab: 18 °C", "descrivi() restituisce " + repr(r)', h: 'Anche descrivi() usa self nel corpo: deve riceverlo come parametro.' },
      { t: 'Il programma stampa "Aula 4B: 22 °C"', c: 'assert "Aula 4B: 22 °C" in _OUTPUT, "output: " + repr(_OUTPUT)', h: 'Non modificare il programma di prova: corregge solo la classe.' }
    ],
    hints: [
      'Esegui il codice e leggi l’errore: la riga e la spiegazione in italiano ti dicono dove guardare.',
      'Gli errori sono tre, tutti legati a self. Dopo ogni correzione riesegui: comparirà l’errore successivo.',
      'Controlla: i parametri di __init__, l’assegnazione dei gradi, i parametri di descrivi().'
    ],
    solution: `class Termometro:
    def __init__(self, luogo):
        self.luogo = luogo
        self.gradi = 20

    def imposta(self, valore):
        self.gradi = valore

    def descrivi(self):
        return self.luogo + ": " + str(self.gradi) + " °C"


t = Termometro("Aula 4B")
t.imposta(22)
print(t.descrivi())
`
  },
  'l1-e4': {
    checks: [
      { t: 'Lampadina("blu") ha colore "blu"', c: 'l = Lampadina("blu")\nassert l.colore == "blu"', h: 'Il colore si sceglie quando si crea la lampadina: è un parametro di __init__.' },
      { t: 'Appena creata è spenta: accesa è False e stato() è "spenta"', c: 'l = Lampadina("blu")\nassert l.accesa is False, "accesa vale " + repr(getattr(l, "accesa", "(mancante)"))\nassert l.stato() == "spenta", "stato() restituisce " + repr(l.stato())', h: 'accesa è un attributo booleano: self.accesa = False. stato() restituisce una stringa in base a self.accesa.' },
      { t: 'accendi() la accende', c: 'l = Lampadina("blu")\nl.accendi()\nassert l.accesa is True and l.stato() == "accesa"', h: 'accendi() deve impostare self.accesa = True.' },
      { t: 'spegni() la spegne', c: 'l = Lampadina("blu")\nl.accendi(); l.spegni()\nassert l.accesa is False and l.stato() == "spenta"', h: 'spegni() deve impostare self.accesa = False.' },
      { t: 'Il programma crea una lampadina, la accende e ne stampa lo stato', c: 'assert "accesa" in _OUTPUT, "nell’output non compare lo stato accesa"', h: 'Completa il punto 3: crea l’oggetto, chiama accendi() e stampa stato().' }
    ],
    hints: [
      'Sul quaderno: nome Lampadina; attributi colore e accesa; metodi accendi(), spegni(), stato().',
      'stato() può usare un if: se self.accesa è vero restituisci "accesa", altrimenti "spenta".',
      'Prova: g = Lampadina("gialla"), poi g.accendi() e print(g.stato()).'
    ],
    solution: `class Lampadina:
    def __init__(self, colore):
        self.colore = colore
        self.accesa = False

    def accendi(self):
        self.accesa = True

    def spegni(self):
        self.accesa = False

    def stato(self):
        if self.accesa:
            return "accesa"
        return "spenta"


g = Lampadina("gialla")
g.accendi()
print("La lampadina", g.colore, "è", g.stato())
`
  }
};
