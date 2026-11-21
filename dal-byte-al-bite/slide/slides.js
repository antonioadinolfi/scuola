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
    const sc = Math.min(innerWidth / 1280, innerHeight / 720) * 0.98;
    stage.style.transform = 'scale(' + sc + ')';
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
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea')) return;
    const k = e.key;
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
  addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); x0 = null; });
  document.getElementById('prev').onclick = () => go(i - 1);
  document.getElementById('next').onclick = () => go(i + 1);
  document.getElementById('btnNotes').onclick = () => notesPane.classList.toggle('on');
  document.getElementById('btnFull').onclick = fullscreen;
  document.getElementById('btnGrid').onclick = toggleOverview;
  document.getElementById('btnPrint').onclick = () => window.print();
  document.getElementById('help').onclick = () => document.getElementById('help').classList.remove('on');
  let hideT;
  function showUi() { document.body.classList.add('show-ui'); clearTimeout(hideT); hideT = setTimeout(() => document.body.classList.remove('show-ui'), 2500); }
  addEventListener('mousemove', showUi);
  addEventListener('touchstart', showUi, { passive: true });
  showUi();
  fit();
  go((parseInt(location.hash.slice(1), 10) || 1) - 1);
})();
