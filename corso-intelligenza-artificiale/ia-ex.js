/* Corso Intelligenza artificiale · esercizi interattivi a correzione automatica.
   Un esercizio è un contenitore <div class="ia-ex" data-ex="l1-e1"> con dei campi:
   - <select data-answer="valore">                      scelta da un elenco
   - <input data-answer="12.5" data-tol="0.01">         risposta numerica (virgola o punto)
   - <ol class="ex-order"><li data-pos="1">…</li></ol>   da mettere in ordine (frecce ↑ ↓)
   - <fieldset class="ex-radio" data-answer="b"> con radio value="a|b|…"
   Attributi facoltativi del contenitore: data-hint (suggerimento dopo il primo errore).
   Un esercizio con data-type="challenge" non ha campi: lo completa una simulazione con IaEx.complete(id).
   Il completamento resta salvato in localStorage (iaEx-<id>) ed emette l'evento 'ia-exercise-done'. */
"use strict";
window.IaEx = (() => {
  const KEY = id => 'iaEx-' + id;
  const isDone = id => { try { return localStorage.getItem(KEY(id)) === '1'; } catch { return false; } };
  const num = s => Number(String(s).trim().replace(/\s/g, '').replace(',', '.'));

  function done(prefix) {
    const all = [...document.querySelectorAll('.ia-ex[data-ex]')].map(e => e.dataset.ex).filter(id => id.startsWith(prefix));
    return { total: all.length, done: all.filter(isDone).length };
  }
  function mark(box) {
    const ok = isDone(box.dataset.ex), art = box.closest('.exercise');
    if (art) {
      art.classList.toggle('done', ok);
      const b = art.querySelector('.ex-head .ex-badge'); if (b) b.textContent = ok ? '✓ completato' : '';
    }
    const st = box.querySelector('.ex-status'); if (st && ok && box.dataset.type === 'challenge') st.textContent = '✓ Obiettivo raggiunto: esercizio completato.';
  }
  function complete(id) {
    const box = document.querySelector('.ia-ex[data-ex="' + id + '"]'); if (!box) return;
    const was = isDone(id);
    try { localStorage.setItem(KEY(id), '1'); } catch {}
    mark(box);
    if (!was) document.dispatchEvent(new CustomEvent('ia-exercise-done', { detail: id }));
  }

  function shuffleOrder(ol) {
    const items = [...ol.children];
    for (let k = items.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [items[k], items[r]] = [items[r], items[k]]; }
    if (items.every((li, i) => Number(li.dataset.pos) === i + 1) && items.length > 1) items.push(items.shift());
    items.forEach(li => ol.append(li));
  }
  function setupOrder(ol) {
    shuffleOrder(ol);
    [...ol.children].forEach(li => {
      const t = document.createElement('span'); t.className = 'ord-text'; while (li.firstChild) t.append(li.firstChild);
      const up = document.createElement('button'), dn = document.createElement('button');
      up.type = dn.type = 'button'; up.textContent = '↑'; dn.textContent = '↓';
      up.setAttribute('aria-label', 'Sposta su'); dn.setAttribute('aria-label', 'Sposta giù');
      up.onclick = () => { if (li.previousElementSibling) li.previousElementSibling.before(li); up.focus(); };
      dn.onclick = () => { if (li.nextElementSibling) li.nextElementSibling.after(li); dn.focus(); };
      const tools = document.createElement('span'); tools.className = 'ord-tools'; tools.append(up, dn);
      li.append(t, tools);
    });
  }

  function check(box) {
    let right = 0, total = 0;
    const flag = (el, ok) => { el.classList.toggle('f-ok', ok); el.classList.toggle('f-ko', !ok); total++; if (ok) right++; };
    box.querySelectorAll('select[data-answer]').forEach(s => flag(s, s.value === s.dataset.answer));
    box.querySelectorAll('input[data-answer]').forEach(i => {
      const a = num(i.dataset.answer), v = num(i.value), tol = Number(i.dataset.tol || 0);
      flag(i, i.value.trim() !== '' && Number.isFinite(v) && Math.abs(v - a) <= tol + 1e-9);
    });
    box.querySelectorAll('fieldset.ex-radio[data-answer]').forEach(f => { const c = f.querySelector('input:checked'); flag(f, !!c && c.value === f.dataset.answer); });
    box.querySelectorAll('ol.ex-order').forEach(ol => [...ol.children].forEach((li, i) => flag(li, Number(li.dataset.pos) === i + 1)));
    return { right, total };
  }

  function setup(box) {
    box.querySelectorAll('ol.ex-order').forEach(setupOrder);
    const st = document.createElement('p'); st.className = 'ex-status'; st.setAttribute('role', 'status'); st.setAttribute('aria-live', 'polite');
    if (box.dataset.type === 'challenge') {
      if (!isDone(box.dataset.ex)) st.textContent = 'Obiettivo non ancora raggiunto: usa la simulazione qui sopra.';
      box.append(st); mark(box); return;
    }
    const bar = document.createElement('div'); bar.className = 'actions ex-actions';
    const v = document.createElement('button'); v.type = 'button'; v.className = 'button verify'; v.textContent = '✓ Verifica';
    const r = document.createElement('button'); r.type = 'button'; r.className = 'button ghost-dark'; r.textContent = 'Ricomincia';
    let tries = 0;
    v.onclick = () => {
      tries++;
      const { right, total } = check(box);
      if (right === total) { st.textContent = 'Tutto esatto: ' + right + ' su ' + total + '. Esercizio completato ✓'; complete(box.dataset.ex); }
      else st.textContent = 'Esatte ' + right + ' su ' + total + ': le risposte da rivedere sono evidenziate in arancione.' + (box.dataset.hint && tries >= 1 ? ' Suggerimento: ' + box.dataset.hint : '');
    };
    r.onclick = () => {
      box.querySelectorAll('.f-ok,.f-ko').forEach(e => e.classList.remove('f-ok', 'f-ko'));
      box.querySelectorAll('select[data-answer]').forEach(s => s.selectedIndex = 0);
      box.querySelectorAll('input[data-answer]').forEach(i => i.value = '');
      box.querySelectorAll('fieldset.ex-radio input').forEach(i => i.checked = false);
      box.querySelectorAll('ol.ex-order').forEach(shuffleOrder);
      st.textContent = '';
    };
    box.addEventListener('change', e => e.target.closest('.f-ok,.f-ko')?.classList.remove('f-ok', 'f-ko'));
    bar.append(v, r); box.append(bar, st);
    if (isDone(box.dataset.ex)) st.textContent = 'Hai già completato questo esercizio: puoi rifarlo quando vuoi.';
    mark(box);
  }

  document.querySelectorAll('.ia-ex[data-ex]').forEach(setup);
  return { done, complete, isDone };
})();
