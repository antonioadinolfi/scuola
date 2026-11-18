/* Corso Introduzione a Python · Lezione 2 · simulazioni:
   indovina il tipo (eseguito con Python vero), laboratorio delle conversioni di input(). */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  /* ---------- 1. Indovina il tipo: il valore viene valutato da Python ---------- */
  const tg = $('#typeGuess');
  if (tg) {
    const inp = $('input', tg), form = $('form', tg), out = $('.type-out', tg), note = $('.sim-note.live', tg);
    const NOTE = {
      int: 'Numero intero: nessun punto decimale, nessuna virgoletta.',
      float: 'Numero decimale: c’è il punto (o la notazione esponenziale, come 3e2). Attenzione: in Python i decimali si scrivono con il punto, non con la virgola.',
      str: 'Stringa: tutto ciò che sta tra virgolette è testo, anche se contiene solo cifre.',
      bool: 'Booleano: True o False, con l’iniziale maiuscola e senza virgolette.',
      tuple: 'Hai usato una virgola: Python ha creato una tupla, cioè una coppia di valori. Probabilmente volevi un decimale: usa il punto.',
      NoneType: 'None è il valore speciale che significa «nessun valore».'
    };
    form.onsubmit = async e => {
      e.preventDefault();
      const v = inp.value.trim(); if (!v) return;
      out.innerHTML = ''; out.append(el('span', '', window.PyRunner && !PyRunner._ready ? 'Chiedo a Python…' : ''));
      const code = 'v = (' + v + ')\nprint(type(v).__name__)\nprint(repr(v))';
      let r; try { r = await PyRunner.run(code); } catch (err) { r = { fatal: err.message }; }
      out.innerHTML = '';
      if (r.fatal || r.timeout) { out.append(el('span', '', r.fatal || 'Tempo scaduto.')); return; }
      if (r.errore) {
        out.append(el('span', 'tpill', 'errore'), el('span', '', r.errore.tipo + ': ' + r.errore.msg));
        note.textContent = r.errore.tipo === 'NameError' ? 'Python non conosce questo nome: se volevi un testo, mettilo tra virgolette. Ricorda anche che True e False vogliono la maiuscola.' : 'Questo non è un valore valido in Python.';
        return;
      }
      const [t, rep] = r.out.trim().split('\n');
      out.append(el('code', '', v), el('span', '', '→'), el('span', 'tpill t-' + t, t), el('span', '', 'type(' + v + ') = <class \'' + t + '\'>'));
      note.textContent = NOTE[t] || '';
    };
    tg.querySelectorAll('[data-val]').forEach(b => b.onclick = () => { inp.value = b.dataset.val; form.requestSubmit(); });
  }

  /* ---------- 2. Laboratorio delle conversioni (regole di Python riprodotte in JavaScript) ---------- */
  const lab = $('#convLab');
  if (lab) {
    const a = $('#cvA'), b = $('#cvB'), tb = $('tbody', lab);
    const INT = /^\s*[+-]?\d+(_\d+)*\s*$/;
    const FLOAT = /^\s*[+-]?((\d+(_\d+)*)?\.?\d*([eE][+-]?\d+)?|inf|infinity|nan)\s*$/i;
    const pyRepr = x => {
      if (x.f) {
        const n = x.v;
        if (Number.isNaN(n)) return 'nan';
        if (!Number.isFinite(n)) return n > 0 ? 'inf' : '-inf';
        if (Number.isInteger(n) && Math.abs(n) < 1e16) return n.toFixed(1);
        return String(n).replace(/e([+-])(\d)$/, 'e$10$2');
      }
      return String(x.v);
    };
    const toInt = s => { if (!INT.test(s)) throw new Error("ValueError: invalid literal for int() with base 10: '" + s + "'"); return { v: BigInt(s.trim().replace(/_/g, '')), f: false }; };
    const toFloat = s => { const t = s.trim(); if (!FLOAT.test(s) || !/\d|inf|nan/i.test(t)) throw new Error("ValueError: could not convert string to float: '" + s + "'"); return { v: Number(t.replace(/_/g, '').replace(/^([+-]?)inf(inity)?$/i, '$1Infinity')), f: true }; };
    const add = (x, y) => (x.f || y.f) ? { v: Number(x.v) + Number(y.v), f: true } : { v: x.v + y.v, f: false };
    const ROWS = [
      ['a + b', 'senza conversione: due stringhe', () => "'" + a.value + b.value + "'", 'str'],
      ['int(a) + int(b)', 'convertite in interi', () => pyRepr(add(toInt(a.value), toInt(b.value))), 'int'],
      ['float(a) + float(b)', 'convertite in decimali', () => pyRepr(add(toFloat(a.value), toFloat(b.value))), 'float'],
      ['a * 3', 'stringa ripetuta', () => "'" + a.value.repeat(3) + "'", 'str'],
      ['int(a) * 3', 'intero moltiplicato', () => pyRepr({ v: toInt(a.value).v * 3n, f: false }), 'int'],
      ['a + 1', 'stringa + numero', () => { throw new Error('TypeError: can only concatenate str (not "int") to str'); }, '']
    ];
    function upd() {
      tb.innerHTML = '';
      ROWS.forEach(([expr, what, f, t]) => {
        const r = el('tr'); r.append(el('td', '', '')); r.firstChild.append(el('code', '', expr)); r.append(el('td', '', what));
        try { const res = f(); r.append(el('td', 'res', res)); const c = el('td'); c.append(el('span', 'tpill t-' + t, t)); r.append(c); }
        catch (e) { const c = el('td', 'err', e.message); c.colSpan = 2; r.append(c); }
        tb.append(r);
      });
    }
    a.addEventListener('input', upd); b.addEventListener('input', upd);
    lab.querySelectorAll('[data-a]').forEach(x => x.onclick = () => { a.value = x.dataset.a; b.value = x.dataset.b; upd(); });
    upd();
  }
})();
