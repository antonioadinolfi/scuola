/* Dal Byte al Bite – navigazione slide */
(function () {
  const stage = document.querySelector('.stage');
  const slides = [...document.querySelectorAll('.slide')];
  const deckTitle = document.body.dataset.title || document.title;
  const notesPane = document.getElementById('notesPane');
  const counter = document.getElementById('counter');
  const bar = document.querySelector('.bar');
  let i = 0;

  slides.forEach((s, k) => {
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'slide');
    s.setAttribute('aria-label', (k + 1) + ' di ' + slides.length);
    if (!s.querySelector('.foot')) {
      const f = document.createElement('div');
      f.className = 'foot';
      f.innerHTML = '<span></span><span></span>';
      f.children[0].textContent = deckTitle;
      f.children[1].textContent = (k + 1) + ' / ' + slides.length;
      s.append(f);
    }
    s.addEventListener('click', () => { if (document.body.classList.contains('overview')) { go(k); toggleOverview(); } });
  });

  function fit() {
    if (document.body.classList.contains('overview')) return;
    const vw = window.visualViewport ? visualViewport.width : innerWidth, vh = window.visualViewport ? visualViewport.height : innerHeight;
    const sc = Math.min(vw / 1280, vh / 720) * (vw < 900 ? 1 : 0.98);
    const rot = document.getElementById('rotate'); if (rot && !rot.dataset.closed) rot.classList.toggle('on', vw < vh && vw < 700);
    stage.style.transform = 'translate(-50%,-50%) scale(' + sc + ')';
  }
  function go(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    const note = slides[i].querySelector('.notes');
    notesPane.innerHTML = note ? note.innerHTML : '<em>Nessuna nota per questa slide.</em>';
    counter.textContent = (i + 1) + ' / ' + slides.length;
    bar.style.width = ((i + 1) / slides.length * 100) + '%';
    history.replaceState(null, '', '#' + (i + 1));
  }
  function toggleOverview() {
    document.body.classList.toggle('overview');
    if (!document.body.classList.contains('overview')) fit(); else slides[i].scrollIntoView({ block: 'center' });
  }
  function fullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.(); else document.exitFullscreen?.();
  }
  addEventListener('resize', fit);
  addEventListener('orientationchange', () => setTimeout(fit, 250));
  if (window.visualViewport) visualViewport.addEventListener('resize', fit);
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select')) return;
    const k = e.key;
    if (e.target.closest('button,a') && [' ', 'Enter'].includes(k)) return;
    if (k === 'r' || k === 'R') { const b = slides[i].querySelector('[data-reveal]'); if (b) b.click(); return; }
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) { e.preventDefault(); go(i + 1); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); go(i - 1); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(slides.length - 1);
    else if (k === 'f' || k === 'F') fullscreen();
    else if (k === 'n' || k === 'N') notesPane.classList.toggle('on');
    else if (k === 'o' || k === 'O' || k === 'Escape' && document.body.classList.contains('overview')) toggleOverview();
    else if (k === '?' || k === 'h' || k === 'H') document.getElementById('help').classList.toggle('on');
    else if (k === 'Escape') document.getElementById('help').classList.remove('on');
  });
  let x0 = null;
  addEventListener('touchstart', e => { x0 = e.target.closest('input,select,textarea,button,a,.hunt,.minilab,#notesPane') ? null : e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); x0 = null; });
  document.getElementById('prev').onclick = () => go(i - 1);
  document.getElementById('next').onclick = () => go(i + 1);
  document.getElementById('btnNotes').onclick = () => notesPane.classList.toggle('on');
  document.getElementById('btnFull').onclick = fullscreen;
  if (!(document.fullscreenEnabled || document.webkitFullscreenEnabled)) document.getElementById('btnFull').style.display = 'none';
  const rot = document.createElement('div'); rot.id = 'rotate'; rot.innerHTML = '<button type="button">OK</button>Ruota il telefono in orizzontale per vedere le slide a tutto schermo. Scorri con il dito per cambiare slide.'; document.body.append(rot);
  rot.querySelector('button').onclick = () => { rot.dataset.closed = '1'; rot.classList.remove('on'); };
  document.getElementById('btnGrid').onclick = toggleOverview;
  document.getElementById('btnPrint').onclick = () => window.print();
  document.getElementById('help').onclick = () => document.getElementById('help').classList.remove('on');
  let hideT;
  function showUi() { document.body.classList.add('show-ui'); clearTimeout(hideT); hideT = setTimeout(() => document.body.classList.remove('show-ui'), 2500); }
  addEventListener('mousemove', showUi);
  addEventListener('touchstart', showUi, { passive: true });
  showUi();
  initOps(slides);
  fit();
  go((parseInt(location.hash.slice(1), 10) || 1) - 1);
})();

/* ---------- componenti operativi ---------- */
function initOps(slides) {
  const fmt = (n, d = 1) => Number(n).toLocaleString('it-IT', { maximumFractionDigits: d });
  // copia testo (prompt)
  document.querySelectorAll('[data-copy]').forEach(b => {
    const label = b.textContent;
    b.addEventListener('click', async () => {
      const src = document.getElementById(b.dataset.copy).textContent.trim();
      try { await navigator.clipboard.writeText(src); b.textContent = 'Copiato ✓'; }
      catch (e) { b.textContent = 'Copia non riuscita: usa la pagina del corso'; }
      setTimeout(() => b.textContent = label, 1800);
    });
  });
  // soluzioni a scomparsa
  document.querySelectorAll('[data-reveal]').forEach(b => {
    const label = b.textContent;
    b.addEventListener('click', () => {
      const slide = b.closest('.slide');
      const hidden = [...slide.querySelectorAll('.sol:not(.on)')];
      if (b.dataset.reveal === 'step' && hidden.length) { hidden[0].classList.add('on'); if (hidden.length === 1) b.textContent = 'Nascondi'; return; }
      const on = slide.querySelectorAll('.sol.on').length && !hidden.length;
      slide.querySelectorAll('.sol').forEach(x => x.classList.toggle('on', !on));
      b.textContent = on ? label : 'Nascondi';
    });
  });
  // timer
  document.querySelectorAll('.timer').forEach(t => {
    const total = (+t.dataset.min || 10) * 60;
    let left = total, id = null;
    t.innerHTML = '<span aria-hidden="true">⏱</span><output aria-live="off"></output><button type="button" aria-label="Avvia o metti in pausa">▶</button><button type="button" aria-label="Azzera">↺</button>';
    const out = t.querySelector('output'), [play, reset] = t.querySelectorAll('button');
    const draw = () => { out.textContent = String(Math.floor(left / 60)).padStart(2, '0') + ':' + String(left % 60).padStart(2, '0'); };
    play.onclick = () => {
      if (id) { clearInterval(id); id = null; play.textContent = '▶'; return; }
      play.textContent = '⏸';
      id = setInterval(() => { left = Math.max(0, left - 1); draw(); if (!left) { clearInterval(id); id = null; play.textContent = '▶'; t.classList.add('done'); } }, 1000);
    };
    reset.onclick = () => { clearInterval(id); id = null; left = total; play.textContent = '▶'; t.classList.remove('done'); draw(); };
    draw();
  });
  // caccia all'errore
  document.querySelectorAll('.hunt').forEach(h => {
    const slide = h.closest('.slide'), list = slide.querySelector('.why'), cnt = slide.querySelector('.count');
    const errs = [...h.querySelectorAll('.err')];
    const upd = () => { cnt.textContent = errs.filter(e => e.classList.contains('found')).length + ' / ' + errs.length; };
    errs.forEach((e, k) => {
      e.tabIndex = 0; e.setAttribute('role', 'button');
      const act = () => {
        if (e.classList.contains('found')) return;
        e.classList.add('found');
        const li = document.createElement('li'); li.textContent = e.dataset.why; list.append(li); upd();
      };
      e.addEventListener('click', act);
      e.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); act(); } });
    });
    const all = slide.querySelector('[data-hunt-all]');
    if (all) all.onclick = () => errs.forEach(e => e.click());
    upd();
  });
  // sondaggi
  document.querySelectorAll('.poll').forEach(p => {
    const opts = [...p.querySelectorAll('button.opt')], ans = +p.dataset.answer;
    opts.forEach((o, k) => {
      o.setAttribute('aria-pressed', 'false');
      o.classList.add(k === ans ? 'ok' : 'wrong');
      o.insertAdjacentHTML('afterbegin', '<span class="letter">' + 'ABCD'[k] + '</span>');
      o.onclick = () => opts.forEach(x => x.setAttribute('aria-pressed', String(x === o)));
    });
    const slide = p.closest('.slide');
    const b = slide.querySelector('[data-poll-show]');
    if (b) b.onclick = () => { p.classList.add('shown'); slide.querySelectorAll('.sol').forEach(x => x.classList.add('on')); };
  });
  // mini FoodLab
  document.querySelectorAll('.minilab').forEach((m, n) => {
    const pre = (m.dataset.preset || '45,12,8,0,0').split(',').map(Number);
    const withMove = m.hasAttribute('data-move');
    const rows = [['c', 'Carboidrati', 100], ['p', 'Proteine', 100], ['g', 'Grassi', 100], ['f', 'Fibre', 50], ['pol', 'Polioli', 50]];
    m.innerHTML = '<div><div class="modes"><label><input type="radio" name="mm' + n + '" value="simple"> 4–4–9</label><label><input type="radio" name="mm' + n + '" value="ue"> Allegato XIV (UE)</label></div>' +
      rows.map(([k, l, max], j) => '<label data-k="' + k + '"><span>' + l + ' (g)</span><input type="range" min="0" max="' + max + '" step="0.1" value="' + pre[j] + '" data-k="' + k + '"><output></output></label>').join('') + '</div>' +
      '<div><div class="label kicker">Energia calcolata</div><div class="res"></div><div class="sub"></div>' +
      (withMove ? '<div class="mv"><select aria-label="Attività"><option value="4.8">Camminata svelta · 4,8 MET</option><option value="5.8">Nuoto lento · 5,8 MET</option><option value="7.0">Calcio amatoriale · 7,0 MET</option><option value="7.5">Pallacanestro · 7,5 MET</option><option value="8.5">Corsa ~8 km/h · 8,5 MET</option><option value="9.3" selected>Corsa ~10 km/h · 9,3 MET</option></select><p style="margin:10px 0 0;font-size:20px">Adulto di riferimento 70 kg: <b class="mvres"></b></p></div>' : '') + '</div>';
    const radios = m.querySelectorAll('input[type=radio]');
    radios[m.dataset.mode === 'ue' ? 1 : 0].checked = true;
    const calc = () => {
      const ue = radios[1].checked, v = {};
      m.querySelectorAll('input[type=range]').forEach(r => { v[r.dataset.k] = +r.value; r.nextElementSibling.textContent = fmt(r.value); });
      m.querySelectorAll('label[data-k=f],label[data-k=pol]').forEach(l => l.style.display = ue ? '' : 'none');
      m.querySelector('label[data-k=c] span').textContent = ue ? 'Carboidrati esclusi polioli (g)' : 'Carboidrati (g)';
      const kcal = v.c * 4 + v.p * 4 + v.g * 9 + (ue ? v.f * 2 + v.pol * 2.4 : 0);
      const kj = v.c * 17 + v.p * 17 + v.g * 37 + v.f * 8 + v.pol * 10;
      m.querySelector('.res').textContent = fmt(kcal) + ' kcal' + (ue ? ' · ' + fmt(kj, 0) + ' kJ' : '');
      m.querySelector('.sub').textContent = fmt(kcal / 2000 * 100) + '% di 2000 kcal (adulto medio, valore di popolazione)';
      if (withMove) { const kpm = +m.querySelector('select').value * 3.5 * 70 / 200; m.querySelector('.mvres').textContent = kcal ? '≈ ' + Math.round(kcal / kpm) + ' min' : '—'; }
    };
    m.addEventListener('input', calc); m.addEventListener('change', calc); calc();
  });
}
