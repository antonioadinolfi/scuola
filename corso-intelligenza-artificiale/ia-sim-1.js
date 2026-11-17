/* Corso Intelligenza artificiale · Lezione 1 · simulazioni:
   spettro forte/generale/debole, linea del tempo, chatbot ELIZA, sistema esperto della diga,
   tris con minimax (albero di gioco), calcolo seriale e parallelo. */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Spettro delle IA ---------- */
  const SPEC = {
    debole: { pos: 0, t: 'IA debole (ristretta)', what: 'Tratta in modo intelligente un problema specifico: riconoscere volti, tradurre, giocare a scacchi, filtrare lo spam.', cons: 'No: elabora dati, non ha consapevolezza.', ex: 'Il navigatore che calcola il percorso, il filtro antispam, un chatbot, AlphaZero.', ora: 'Sì: tutta l’IA che usiamo oggi è di questo tipo, anche quando in un compito supera l’essere umano.' },
    generale: { pos: 50, t: 'IA generale', what: 'Saprebbe eseguire qualsiasi compito intellettuale che sa svolgere una persona, passando da un problema all’altro.', cons: 'Non necessariamente: la definizione riguarda le capacità, non la coscienza.', ex: 'Nessuno sicuro. È l’obiettivo dichiarato di diversi laboratori di ricerca, e se e quando sarà raggiunto è molto discusso.', ora: 'Non ancora, secondo la maggior parte degli studiosi.' },
    forte: { pos: 100, t: 'IA forte', what: 'Un computer che pensa davvero ed è consapevole di farlo: una mente artificiale.', cons: 'Sì: è proprio la sua caratteristica distintiva.', ex: 'Solo nella fantascienza (HAL 9000, i replicanti di Blade Runner).', ora: 'No. È anzi discusso se sia possibile in linea di principio.' }
  };
  const sp = $('#spectrum');
  if (sp) {
    const btns = sp.querySelectorAll('.spec-btn'), dot = $('.spectrum-bar span', sp), det = $('.spectrum-detail', sp);
    const show = k => {
      const d = SPEC[k];
      btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
      dot.style.left = d.pos + '%';
      det.innerHTML = '<h4></h4><dl><dt>Che cosa sa fare</dt><dd></dd><dt>È cosciente?</dt><dd></dd><dt>Esempi</dt><dd></dd><dt>Esiste oggi?</dt><dd></dd></dl>';
      det.querySelector('h4').textContent = d.t;
      [d.what, d.cons, d.ex, d.ora].forEach((t, i) => { det.querySelectorAll('dd')[i].textContent = t; });
    };
    btns.forEach(b => b.onclick = () => show(b.dataset.k));
    show('debole');
  }

  /* ---------- 2. Linea del tempo ---------- */
  const TL = [
    ['1936', 'macchine', 'La macchina di Turing', 'Alan Turing descrive una macchina astratta che legge e scrive simboli su un nastro seguendo un programma. È il modello teorico di ogni computer e ispirerà l’architettura di von Neumann, con programma e dati nella stessa memoria.'],
    ['1943', 'reti', 'Il neurone di McCulloch e Pitts', 'Warren McCulloch e Walter Pitts propongono il primo modello matematico di un neurone: somma degli stimoli e soglia di attivazione. È l’antenato dei neuroni artificiali della Lezione 4.'],
    ['anni ’40', 'macchine', 'La cibernetica di Wiener', 'Norbert Wiener fonda la cibernetica (il libro omonimo è del 1948): lo studio dell’autoregolazione e del controllo negli esseri viventi e nelle macchine, basato sulla retroazione (feedback). Esempio: il termostato misura la temperatura e accende o spegne la caldaia per correggere la differenza dal valore desiderato.'],
    ['1950', 'linguaggio', 'L’imitation game', 'Nell’articolo «Computing Machinery and Intelligence» Turing sostituisce la domanda «le macchine possono pensare?» con un gioco: un giudice dialoga per iscritto con un umano e una macchina; se non riesce a distinguerli, la macchina supera il test.'],
    ['1956', 'nascita', 'Il seminario di Dartmouth', 'John McCarthy, con Marvin Minsky, Claude Shannon e Nathaniel Rochester, organizza un seminario estivo al Dartmouth College (New Hampshire). Nella proposta compare per la prima volta l’espressione «artificial intelligence».'],
    ['1958', 'reti', 'Il Perceptron di Rosenblatt', 'Frank Rosenblatt presenta il Perceptron, una macchina basata sul principio delle reti neurali capace di imparare a riconoscere semplici forme. Nello stesso anno McCarthy inventa il linguaggio LISP, che diventerà il linguaggio dell’IA.'],
    ['1964', 'linguaggio', 'STUDENT', 'Daniel Bobrow scrive in LISP il programma STUDENT, che risolve problemi di algebra espressi in inglese, come «se il numero di clienti di Tom è il doppio…».'],
    ['1965', 'esperti', 'I sistemi esperti', 'A Stanford nasce DENDRAL, che aiuta i chimici a identificare le molecole. I sistemi esperti imitano le decisioni di un esperto umano con una base di conoscenza e un motore inferenziale.'],
    ['1966', 'linguaggio', 'ELIZA, il primo chatbot', 'Joseph Weizenbaum (MIT) pubblica ELIZA. Nel copione più famoso imita uno psicoterapeuta riformulando le frasi dell’utente. Molti utenti le attribuivano una comprensione che non aveva: Weizenbaum stesso ne rimase colpito.'],
    ['1966-72', 'robotica', 'Shakey', 'Allo Stanford Research Institute nasce Shakey, il primo robot semovente capace di ragionare sulle proprie azioni: pianifica un percorso, spinge oggetti, aggira ostacoli.'],
    ['1973', 'robotica', 'WABOT-1', 'All’università Waseda di Tokyo viene costruito WABOT-1, il primo robot umanoide a grandezza naturale: cammina, afferra oggetti, «vede» e conversa in giapponese in modo elementare.'],
    ['1974-80', 'crisi', 'Il primo inverno dell’IA', 'Le promesse degli anni Sessanta (traduzione automatica, comprensione del linguaggio) non si realizzano. Rapporti critici come quello di James Lighthill (1973, Regno Unito) portano a tagliare i finanziamenti.'],
    ['1984', 'robotica', 'WABOT-2', 'Il successore di WABOT-1 legge uno spartito con una telecamera e lo suona su una tastiera elettronica, accompagnando un cantante.'],
    ['1987-93', 'crisi', 'Il secondo inverno', 'I sistemi esperti si rivelano costosi da aggiornare e fragili fuori dal loro campo; crolla il mercato delle costose macchine LISP. Nuovo calo di fiducia e di fondi.'],
    ['anni ’90', 'esperti', 'MISTRAL', 'In Italia nasce MISTRAL, sistema esperto che interpreta i dati dei sensori di grandi dighe e segnala le anomalie. Sistemi derivati sono tuttora usati per la sorveglianza delle dighe.'],
    ['1997', 'giochi', 'Deep Blue batte Kasparov', 'Alla seconda sfida il computer Deep Blue dell’IBM sconfigge il campione del mondo di scacchi Garri Kasparov, esplorando l’albero delle mosse con un database di partite e un’enorme potenza di calcolo.'],
    ['2012', 'reti', 'La svolta del deep learning', 'Una rete neurale profonda addestrata su GPU (AlexNet) stravince una gara di riconoscimento di immagini su oltre un milione di foto. GPU e big data fanno ripartire l’IA: è la nuova fioritura.'],
    ['2017-18', 'giochi', 'AlphaZero', 'DeepMind (Google) presenta AlphaZero: partendo dalle sole regole impara in poche ore, giocando contro sé stesso, a giocare a scacchi, shogi e go meglio di qualunque giocatore umano o programma precedente.']
  ];
  const CAT = { macchine: 'Macchine e controllo', reti: 'Reti neurali', linguaggio: 'Linguaggio', nascita: 'Nascita dell’IA', esperti: 'Sistemi esperti', robotica: 'Robotica', crisi: 'Inverni dell’IA', giochi: 'Game AI' };
  const tl = $('#timeline');
  if (tl) {
    const fil = $('.tl-filters', tl), track = $('.tl-track', tl), det = $('.tl-detail', tl);
    const all = el('button', 'sb', 'Tutte'); all.type = 'button'; all.setAttribute('aria-pressed', 'true'); all.dataset.c = ''; fil.append(all);
    Object.entries(CAT).forEach(([k, v]) => { const b = el('button', 'sb', v); b.type = 'button'; b.dataset.c = k; b.setAttribute('aria-pressed', 'false'); fil.append(b); });
    const items = TL.map((d, i) => {
      const b = el('button', 'tl-item'); b.type = 'button'; b.dataset.cat = d[1]; b.setAttribute('aria-pressed', 'false');
      b.append(el('span', 'yr', d[0]), el('span', 'dot'), el('span', 'nm', d[2]));
      b.onclick = () => select(i); track.append(b); return b;
    });
    function select(i) {
      items.forEach((b, j) => b.setAttribute('aria-pressed', String(i === j)));
      const d = TL[i];
      det.innerHTML = '<span class="cat"></span><h4></h4><p></p>';
      det.querySelector('.cat').textContent = d[0] + ' · ' + CAT[d[1]];
      det.querySelector('h4').textContent = d[2]; det.querySelector('p').textContent = d[3];
    }
    fil.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      fil.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      items.forEach(it => it.classList.toggle('dim', !!b.dataset.c && it.dataset.cat !== b.dataset.c));
      const first = items.findIndex(it => !b.dataset.c || it.dataset.cat === b.dataset.c);
      if (first >= 0) { select(first); items[first].scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' }); }
    });
    select(0);
  }

  /* ---------- 3. ELIZA ---------- */
  const REFL = { io: 'tu', me: 'te', mi: 'ti', mio: 'tuo', mia: 'tua', miei: 'tuoi', mie: 'tue', tu: 'io', te: 'me', ti: 'mi', tuo: 'mio', tua: 'mia', tuoi: 'miei', tue: 'mie', sono: 'sei', sei: 'sono', ho: 'hai', hai: 'ho', posso: 'puoi', voglio: 'vuoi' };
  const reflect = s => s.replace(/[.!?]+$/, '').split(/\s+/).map(w => REFL[w] || w).join(' ');
  const RULES = [
    [/\b(ciao|salve|buongiorno|buonasera)\b/, 'saluto', ['Ciao. Di che cosa vorresti parlare oggi?', 'Salve. Come ti senti?']],
    [/\bmi sento (.+)/, 'mi sento (X)', ['Da quanto tempo ti senti {1}?', 'Perché pensi di sentirti {1}?', 'Ti capita spesso di sentirti {1}?']],
    [/\bho bisogno di (.+)/, 'ho bisogno di (X)', ['Perché hai bisogno di {1}?', 'Ti aiuterebbe davvero avere {1}?']],
    [/\bnon (?:riesco|posso) (?:a )?(.+)/, 'non riesco a (X)', ['Che cosa ti impedisce di {1}?', 'Hai provato davvero a {1}?']],
    [/\bsono (.+)/, 'sono (X)', ['Da quanto tempo sei {1}?', 'Come ti fa sentire essere {1}?']],
    [/\b(?:tu sei|sei) (.+)/, 'sei (X)', ['Perché pensi che io sia {1}?', 'Ti piacerebbe che io fossi {1}?']],
    [/\b(mamma|madre|padre|papà|famiglia|fratello|sorella|genitori)\b/, 'parola chiave: famiglia', ['Raccontami di più della tua famiglia.', 'Chi altro nella tua famiglia ti viene in mente?']],
    [/\b(scuola|verifica|compito|compiti|interrogazione|prof|professore|professoressa|voto|voti)\b/, 'parola chiave: scuola', ['La scuola sembra importante per te. Che cosa ti preoccupa?', 'Che cosa provi quando pensi alla {1}?']],
    [/\b(computer|macchina|macchine|robot|ia|intelligenza artificiale|chatbot)\b/, 'parola chiave: macchine', ['Le macchine ti preoccupano?', 'Stai parlando di me?', 'Che cosa pensi delle macchine che parlano?']],
    [/\b(sogno|sognato|sogni)\b/, 'parola chiave: sogno', ['Che cosa ti suggerisce quel sogno?', 'Sogni spesso?']],
    [/\b(sempre|mai)\b/, 'parola chiave: sempre/mai', ['Puoi farmi un esempio specifico?', 'Proprio {1}?']],
    [/\bperch[eé]\b.*\?$/, 'domanda «perché…?»', ['Tu che risposta ti daresti?', 'Perché me lo chiedi?']],
    [/^(sì|si|certo|esatto)\b/, 'risposta: sì', ['Sembri molto sicuro.', 'Capisco. Continua.']],
    [/^no\b/, 'risposta: no', ['Perché no?', 'Stai dicendo no solo per contraddirmi?']]
  ];
  const DEFAULT = ['Capisco. Continua.', 'Interessante: dimmi di più.', 'Come ti fa sentire questo?', 'E questo che cosa ti fa pensare?'];
  const eliza = $('#eliza');
  if (eliza) {
    const chat = $('.chat', eliza), form = $('form', eliza), inp = $('input', eliza), tog = $('#elizaRules'), cnt = { n: 0 };
    const add = (cls, t) => { const m = el('div', 'msg ' + cls, t); if (cls === 'rule') m.className = 'rule'; chat.append(m); chat.scrollTop = chat.scrollHeight; };
    add('bot', 'ELIZA: Ciao, sono ELIZA. Raccontami che cosa ti passa per la testa.');
    form.onsubmit = e => {
      e.preventDefault();
      const raw = inp.value.trim(); if (!raw) return; inp.value = '';
      add('me', raw);
      const s = raw.toLowerCase();
      let out = null, rule = 'nessuna regola: risposta generica';
      for (const [re, name, resp] of RULES) {
        const m = s.match(re);
        if (m) { const r = resp[cnt.n++ % resp.length]; out = r.replace('{1}', reflect((m[1] || '').trim())); rule = 'regola «' + name + '»' + (m[1] && r.includes('{1}') ? ' · X = «' + m[1].trim() + '» → «' + reflect(m[1].trim()) + '»' : ''); break; }
      }
      if (!out) out = DEFAULT[cnt.n++ % DEFAULT.length];
      setTimeout(() => { add('rule', '⚙ ' + rule); add('bot', 'ELIZA: ' + out); }, reduce ? 0 : 350);
    };
    tog.onclick = () => { const on = tog.getAttribute('aria-pressed') !== 'true'; tog.setAttribute('aria-pressed', String(on)); chat.classList.toggle('hide-rules', !on); tog.textContent = on ? 'Nascondi le regole' : 'Mostra le regole'; };
    chat.classList.add('hide-rules');
    eliza.querySelectorAll('[data-say]').forEach(b => b.onclick = () => { inp.value = b.dataset.say; form.requestSubmit(); });
  }

  /* ---------- 4. Sistema esperto della diga ---------- */
  const ex = $('#expert');
  if (ex) {
    const RULE = [
      { id: 'R1', txt: 'SE livello > 90% ALLORA invaso_alto', when: f => f.livello > 90, then: 'invaso_alto' },
      { id: 'R2', txt: 'SE pioggia > 80 mm ALLORA piena_in_arrivo', when: f => f.pioggia > 80, then: 'piena_in_arrivo' },
      { id: 'R3', txt: 'SE spostamento > 15 mm E livello > 90% ALLORA ALLARME', when: f => f.spost > 15 && f.livello > 90, then: 'ALLARME', lv: 2, why: 'la diga si deforma molto con il serbatoio quasi pieno' },
      { id: 'R4', txt: 'SE invaso_alto E piena_in_arrivo ALLORA ATTENZIONE', when: f => f.invaso_alto && f.piena_in_arrivo, then: 'ATTENZIONE', lv: 1, why: 'serbatoio quasi pieno e piena in arrivo: aprire gli scarichi' },
      { id: 'R5', txt: 'SE spostamento > 8 mm ALLORA anomalia_strutturale', when: f => f.spost > 8, then: 'anomalia_strutturale' },
      { id: 'R6', txt: 'SE anomalia_strutturale E scossa_recente ALLORA ALLARME', when: f => f.anomalia_strutturale && f.scossa, then: 'ALLARME', lv: 2, why: 'deformazione anomala dopo un terremoto' },
      { id: 'R7', txt: 'SE anomalia_strutturale ALLORA ATTENZIONE', when: f => f.anomalia_strutturale, then: 'ATTENZIONE', lv: 1, why: 'deformazione anomala: serve un’ispezione' }
    ];
    const list = $('.rules-list', ex);
    RULE.forEach(r => { const li = el('li', '', r.id + ': ' + r.txt); li.dataset.id = r.id; list.append(li); });
    const ctrl = { livello: $('#exLivello'), pioggia: $('#exPioggia'), spost: $('#exSpost'), scossa: $('#exScossa') };
    const out = $('.sim-out', ex), ver = $('.verdict', ex);
    function run() {
      const f = { livello: +ctrl.livello.value, pioggia: +ctrl.pioggia.value, spost: +ctrl.spost.value, scossa: ctrl.scossa.checked };
      ex.querySelectorAll('[data-show]').forEach(s => { s.textContent = ctrl[s.dataset.show].value; });
      const lines = ['<span class="dim">Fatti iniziali: livello=' + f.livello + '%, pioggia=' + f.pioggia + ' mm, spostamento=' + f.spost + ' mm, scossa_recente=' + (f.scossa ? 'sì' : 'no') + '</span>'];
      const fired = new Set(); let level = 0, reason = 'nessuna regola di allarme è scattata', changed = true, step = 0;
      while (changed) {   // concatenazione in avanti (forward chaining): si ripete finché nasce un fatto nuovo
        changed = false; step++;
        for (const r of RULE) {
          if (fired.has(r.id) || !r.when(f)) continue;
          fired.add(r.id); changed = true;
          if (r.lv != null) { lines.push('<span class="hl">Ciclo ' + step + ' · ' + r.id + ' scatta → conclusione ' + r.then + '</span> <span class="dim">(' + r.why + ')</span>'); if (r.lv > level) { level = r.lv; reason = r.id + ': ' + r.why; } }
          else { f[r.then] = true; lines.push('<span class="ok">Ciclo ' + step + ' · ' + r.id + ' scatta → nuovo fatto: ' + r.then + '</span>'); }
        }
      }
      if (!fired.size) lines.push('Nessuna regola applicabile.');
      out.innerHTML = lines.join('\n');
      list.querySelectorAll('li').forEach(li => li.classList.toggle('fired', fired.has(li.dataset.id)));
      ver.className = 'verdict v' + level;
      ver.textContent = ['✓ NORMALE', '⚠ ATTENZIONE', '⛔ ALLARME'][level] + ' — ' + reason;
    }
    Object.values(ctrl).forEach(c => c.addEventListener('input', run));
    run();
  }

  /* ---------- 5. Tris con minimax ---------- */
  const ttt = $('#ttt');
  if (ttt) {
    const grid = $('.ttt', ttt), info = $('.sim-out', ttt), ab = $('#tttAB'), reset = $('#tttReset'), stats = { last: $('#tttLast'), tot: $('#tttTot') };
    const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    let b, over, nodes, total;
    const win = s => { for (const l of L) if (s[l[0]] && s[l[0]] === s[l[1]] && s[l[1]] === s[l[2]]) return l; return null; };
    function mm(s, player, alpha, beta, depth) {
      nodes++;
      const w = win(s); if (w) return s[w[0]] === 'O' ? 10 - depth : depth - 10;
      if (s.every(Boolean)) return 0;
      let best = player === 'O' ? -Infinity : Infinity;
      for (let i = 0; i < 9; i++) {
        if (s[i]) continue; s[i] = player;
        const v = mm(s, player === 'O' ? 'X' : 'O', alpha, beta, depth + 1); s[i] = null;
        if (player === 'O') { best = Math.max(best, v); alpha = Math.max(alpha, v); } else { best = Math.min(best, v); beta = Math.min(beta, v); }
        if (ab.checked && beta <= alpha) break;
      }
      return best;
    }
    const btns = [...Array(9)].map((_, i) => { const x = el('button'); x.type = 'button'; x.setAttribute('aria-label', 'Casella ' + (i + 1)); x.onclick = () => play(i); grid.append(x); return x; });
    function draw() { btns.forEach((x, i) => { x.textContent = b[i] || ''; x.disabled = over || !!b[i]; x.classList.remove('win'); }); const w = win(b); if (w) w.forEach(i => btns[i].classList.add('win')); }
    function end() { const w = win(b); if (w) { over = true; info.textContent += '\n' + (b[w[0]] === 'X' ? 'Hai vinto! (impossibile se il computer gioca bene…)' : 'Ha vinto il computer.'); } else if (b.every(Boolean)) { over = true; info.textContent += '\nPareggio: contro minimax non si può fare di meglio.'; } draw(); }
    function play(i) {
      if (over || b[i]) return; b[i] = 'X'; draw(); end(); if (over) return;
      nodes = 0; let best = -Infinity, move = -1;
      for (let j = 0; j < 9; j++) { if (b[j]) continue; b[j] = 'O'; const v = mm(b, 'X', -Infinity, Infinity, 1); b[j] = null; if (v > best) { best = v; move = j; } }
      b[move] = 'O'; total += nodes;
      stats.last.textContent = nodes.toLocaleString('it-IT'); stats.tot.textContent = total.toLocaleString('it-IT');
      info.textContent = 'Il computer ha esplorato ' + nodes.toLocaleString('it-IT') + ' posizioni future prima di scegliere la casella ' + (move + 1) + (ab.checked ? ' (con potatura alfa-beta).' : '.');
      end();
    }
    function start() { b = Array(9).fill(null); over = false; total = 0; stats.last.textContent = stats.tot.textContent = '0'; info.textContent = 'Tocca a te: sei X. Il computer (O) esplora tutte le partite possibili da ogni posizione (algoritmo minimax).'; draw(); }
    reset.onclick = start; start();
  }

  /* ---------- 6. Calcolo seriale e parallelo ---------- */
  const par = $('#parallel');
  if (par) {
    const N = 256, mk = box => { const g = $(box, par); return [...Array(N)].map(() => { const i = el('i'); g.append(i); return i; }); };
    const cpu = mk('.cores.cpu'), gpu = mk('.cores.gpu'), go = $('#parGo'), tc = $('#parCpu'), tg = $('#parGpu'), cores = $('#parCores');
    let timer = null;
    go.onclick = () => {
      clearInterval(timer); [...cpu, ...gpu].forEach(i => i.classList.remove('on'));
      const k = +cores.value; let t = 0, c = 0, g = 0;
      timer = setInterval(() => {
        t++; if (c < N) { cpu[c++].classList.add('on'); tc.textContent = t; }
        if (g < N) { for (let j = 0; j < k && g < N; j++) gpu[g++].classList.add('on'); tg.textContent = t; }
        if (c >= N) clearInterval(timer);
      }, reduce ? 4 : 18);
    };
    cores.oninput = () => { $('#parCoresV').textContent = cores.value; };
  }
})();
