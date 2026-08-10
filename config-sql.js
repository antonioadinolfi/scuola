window.SQL_LAB_DEFAULT_CONFIG = 'scuola';
window.SQL_LAB_CONFIGS = {
  scuola: {
    meta: {
      titolo: 'Laboratorio SQL · Database Scuola',
      sottotitolo: 'Query su classi, studenti, docenti, materie, relazione N:M e valutazioni.',
      datasetInfo: 'Dataset: scuola (6 tabelle, 1 tabella associativa)',
      dbFiddleUrl: 'https://www.db-fiddle.com/'
    },
    schema: "Tabelle del database SCUOLA\n\nCLASSE(\n  id_classe PK,\n  nome_classe,\n  anno_scolastico\n)\n\nSTUDENTE(\n  id_studente PK,\n  nome,\n  cognome,\n  data_nascita,\n  email,\n  id_classe FK -> CLASSE.id_classe\n)\n\nDOCENTE(\n  id_docente PK,\n  nome,\n  cognome\n)\n\nMATERIA(\n  id_materia PK,\n  nome_materia\n)\n\nDOCENTE_MATERIA(\n  id_docente FK -> DOCENTE.id_docente,\n  id_materia FK -> MATERIA.id_materia,\n  PK(id_docente, id_materia)\n)\n\nVALUTAZIONE(\n  id_valutazione PK,\n  id_studente FK -> STUDENTE.id_studente,\n  id_materia FK -> MATERIA.id_materia,\n  voto,\n  data_valutazione\n)",
    db: {
      classe: [
        {id_classe:1, nome_classe:'3A', anno_scolastico:'2025/2026'},
        {id_classe:2, nome_classe:'4B', anno_scolastico:'2025/2026'},
        {id_classe:3, nome_classe:'5A', anno_scolastico:'2025/2026'}
      ],
      studente: [
        {id_studente:1, nome:'Luca', cognome:'Rossi', data_nascita:'2008-03-15', email:'luca.rossi@scuola.it', id_classe:1},
        {id_studente:2, nome:'Maria', cognome:'Bianchi', data_nascita:'2008-07-22', email:'maria.bianchi@scuola.it', id_classe:1},
        {id_studente:3, nome:'Giovanni', cognome:'Verdi', data_nascita:'2007-11-10', email:'giovanni.verdi@scuola.it', id_classe:2},
        {id_studente:4, nome:'Anna', cognome:'Neri', data_nascita:'2006-01-05', email:'anna.neri@scuola.it', id_classe:3}
      ],
      docente: [
        {id_docente:1, nome:'Paolo', cognome:'Esposito'},
        {id_docente:2, nome:'Laura', cognome:'Romano'},
        {id_docente:3, nome:'Chiara', cognome:'Greco'},
        {id_docente:4, nome:'Marco', cognome:'Ferrari'}
      ],
      materia: [
        {id_materia:1, nome_materia:'Informatica'},
        {id_materia:2, nome_materia:'Matematica'},
        {id_materia:3, nome_materia:'Italiano'},
        {id_materia:4, nome_materia:'Sistemi e Reti'}
      ],
      docente_materia: [
        {id_docente:1, id_materia:1},
        {id_docente:1, id_materia:4},
        {id_docente:2, id_materia:2},
        {id_docente:3, id_materia:3},
        {id_docente:4, id_materia:1},
        {id_docente:4, id_materia:2}
      ],
      valutazione: [
        {id_valutazione:1, id_studente:1, id_materia:1, voto:7.50, data_valutazione:'2026-02-10'},
        {id_valutazione:2, id_studente:1, id_materia:1, voto:8.00, data_valutazione:'2026-03-05'},
        {id_valutazione:3, id_studente:1, id_materia:2, voto:6.50, data_valutazione:'2026-02-18'},
        {id_valutazione:4, id_studente:2, id_materia:1, voto:9.00, data_valutazione:'2026-02-11'},
        {id_valutazione:5, id_studente:2, id_materia:3, voto:7.00, data_valutazione:'2026-02-20'},
        {id_valutazione:6, id_studente:3, id_materia:2, voto:8.50, data_valutazione:'2026-03-01'},
        {id_valutazione:7, id_studente:3, id_materia:4, voto:7.25, data_valutazione:'2026-03-10'},
        {id_valutazione:8, id_studente:4, id_materia:1, voto:6.00, data_valutazione:'2026-02-25'},
        {id_valutazione:9, id_studente:4, id_materia:3, voto:8.75, data_valutazione:'2026-03-12'}
      ]
    },
    exercises: [
      {
        titolo: 'Q1 · Elenco studenti della classe 3A',
        testo: "<p><strong>Scenario.</strong> Una scuola vuole informatizzare la gestione di classi, studenti, docenti, materie e valutazioni.</p>\n<ul>\n  <li>Ogni studente appartiene ad al pi\u00f9 una classe.</li>\n  <li>Uno studente pu\u00f2 ricevere pi\u00f9 voti, anche nella stessa materia.</li>\n  <li>Un docente pu\u00f2 insegnare pi\u00f9 materie.</li>\n  <li>Una materia pu\u00f2 essere insegnata da diversi docenti.</li>\n  <li>Ogni entit\u00e0 \u00e8 identificata da una chiave primaria numerica.</li>\n</ul>\n<p><strong>Obiettivo.</strong> Scrivere query SQL di interrogazione sul dataset di esempio gi\u00e0 caricato nel laboratorio.</p><p><strong>Richiesta.</strong> Visualizza nome, cognome ed email degli studenti appartenenti alla classe <code>3A</code>.</p><p class='hint'>Suggerimento: usa <code>studente</code> e <code>classe</code> con una JOIN su <code>id_classe</code>.</p>",
        starter: "SELECT s.nome, s.cognome, s.email
FROM studente s
JOIN classe c ON s.id_classe = c.id_classe
WHERE c.nome_classe = '3A';"
      },
      {
        titolo: 'Q2 · Media dei voti per studente',
        testo: "<p><strong>Scenario.</strong> Una scuola vuole informatizzare la gestione di classi, studenti, docenti, materie e valutazioni.</p>\n<ul>\n  <li>Ogni studente appartiene ad al pi\u00f9 una classe.</li>\n  <li>Uno studente pu\u00f2 ricevere pi\u00f9 voti, anche nella stessa materia.</li>\n  <li>Un docente pu\u00f2 insegnare pi\u00f9 materie.</li>\n  <li>Una materia pu\u00f2 essere insegnata da diversi docenti.</li>\n  <li>Ogni entit\u00e0 \u00e8 identificata da una chiave primaria numerica.</li>\n</ul>\n<p><strong>Obiettivo.</strong> Scrivere query SQL di interrogazione sul dataset di esempio gi\u00e0 caricato nel laboratorio.</p><p><strong>Richiesta.</strong> Calcola la media dei voti per ciascuno studente, mostrando nome, cognome e media.</p><p class='hint'>Suggerimento: usa <code>AVG(voto)</code> e <code>GROUP BY</code>.</p>",
        starter: "SELECT s.nome, s.cognome, AVG(v.voto) AS media_voti
FROM studente s
JOIN valutazione v ON s.id_studente = v.id_studente
GROUP BY s.nome, s.cognome
ORDER BY media_voti DESC;"
      },
      {
        titolo: 'Q3 · Voti di Informatica',
        testo: "<p><strong>Scenario.</strong> Una scuola vuole informatizzare la gestione di classi, studenti, docenti, materie e valutazioni.</p>\n<ul>\n  <li>Ogni studente appartiene ad al pi\u00f9 una classe.</li>\n  <li>Uno studente pu\u00f2 ricevere pi\u00f9 voti, anche nella stessa materia.</li>\n  <li>Un docente pu\u00f2 insegnare pi\u00f9 materie.</li>\n  <li>Una materia pu\u00f2 essere insegnata da diversi docenti.</li>\n  <li>Ogni entit\u00e0 \u00e8 identificata da una chiave primaria numerica.</li>\n</ul>\n<p><strong>Obiettivo.</strong> Scrivere query SQL di interrogazione sul dataset di esempio gi\u00e0 caricato nel laboratorio.</p><p><strong>Richiesta.</strong> Elenca gli studenti con i voti ottenuti nella materia <code>Informatica</code>, ordinando per data valutazione.</p>",
        starter: "SELECT s.nome, s.cognome, m.nome_materia, v.voto, v.data_valutazione
FROM valutazione v
JOIN studente s ON v.id_studente = s.id_studente
JOIN materia m ON v.id_materia = m.id_materia
WHERE m.nome_materia = 'Informatica'
ORDER BY v.data_valutazione;"
      },
      {
        titolo: 'Q4 · Docenti che insegnano Informatica',
        testo: "<p><strong>Scenario.</strong> Una scuola vuole informatizzare la gestione di classi, studenti, docenti, materie e valutazioni.</p>\n<ul>\n  <li>Ogni studente appartiene ad al pi\u00f9 una classe.</li>\n  <li>Uno studente pu\u00f2 ricevere pi\u00f9 voti, anche nella stessa materia.</li>\n  <li>Un docente pu\u00f2 insegnare pi\u00f9 materie.</li>\n  <li>Una materia pu\u00f2 essere insegnata da diversi docenti.</li>\n  <li>Ogni entit\u00e0 \u00e8 identificata da una chiave primaria numerica.</li>\n</ul>\n<p><strong>Obiettivo.</strong> Scrivere query SQL di interrogazione sul dataset di esempio gi\u00e0 caricato nel laboratorio.</p><p><strong>Richiesta.</strong> Mostra nome e cognome dei docenti che insegnano <code>Informatica</code>.</p><p class='hint'>Qui serve la tabella associativa <code>docente_materia</code>.</p>",
        starter: "SELECT d.nome, d.cognome
FROM docente d
JOIN docente_materia dm ON d.id_docente = dm.id_docente
JOIN materia m ON dm.id_materia = m.id_materia
WHERE m.nome_materia = 'Informatica';"
      },
      {
        titolo: 'Q5 · Materie insegnate da Ferrari',
        testo: "<p><strong>Scenario.</strong> Una scuola vuole informatizzare la gestione di classi, studenti, docenti, materie e valutazioni.</p>\n<ul>\n  <li>Ogni studente appartiene ad al pi\u00f9 una classe.</li>\n  <li>Uno studente pu\u00f2 ricevere pi\u00f9 voti, anche nella stessa materia.</li>\n  <li>Un docente pu\u00f2 insegnare pi\u00f9 materie.</li>\n  <li>Una materia pu\u00f2 essere insegnata da diversi docenti.</li>\n  <li>Ogni entit\u00e0 \u00e8 identificata da una chiave primaria numerica.</li>\n</ul>\n<p><strong>Obiettivo.</strong> Scrivere query SQL di interrogazione sul dataset di esempio gi\u00e0 caricato nel laboratorio.</p><p><strong>Richiesta.</strong> Elenca le materie insegnate dal docente con cognome <code>Ferrari</code>.</p>",
        starter: "SELECT d.cognome, m.nome_materia
FROM docente d
JOIN docente_materia dm ON d.id_docente = dm.id_docente
JOIN materia m ON dm.id_materia = m.id_materia
WHERE d.cognome = 'Ferrari';"
      },
      {
        titolo: 'Q6 · Numero studenti per classe',
        testo: "<p><strong>Scenario.</strong> Una scuola vuole informatizzare la gestione di classi, studenti, docenti, materie e valutazioni.</p>\n<ul>\n  <li>Ogni studente appartiene ad al pi\u00f9 una classe.</li>\n  <li>Uno studente pu\u00f2 ricevere pi\u00f9 voti, anche nella stessa materia.</li>\n  <li>Un docente pu\u00f2 insegnare pi\u00f9 materie.</li>\n  <li>Una materia pu\u00f2 essere insegnata da diversi docenti.</li>\n  <li>Ogni entit\u00e0 \u00e8 identificata da una chiave primaria numerica.</li>\n</ul>\n<p><strong>Obiettivo.</strong> Scrivere query SQL di interrogazione sul dataset di esempio gi\u00e0 caricato nel laboratorio.</p><p><strong>Richiesta.</strong> Conta quanti studenti ci sono in ogni classe.</p><p class='hint'>Usa <code>COUNT</code> e <code>GROUP BY</code>.</p>",
        starter: "SELECT c.nome_classe, COUNT(s.id_studente) AS numero_studenti
FROM classe c
JOIN studente s ON c.id_classe = s.id_classe
GROUP BY c.nome_classe
ORDER BY c.nome_classe;"
      }
    ]
  }
};
