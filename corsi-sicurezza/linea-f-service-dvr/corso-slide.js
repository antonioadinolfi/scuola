"use strict";
/* Motore slide del corso sicurezza.
   Tasti: → spazio PgGiù avanti · ← PgSu indietro · Home/Fine · F schermo intero · N note
   O indice · B schermo nero · L puntatore laser · numero + Invio per saltare · Esc chiude.
   Vista relatore: pulsante "Vista relatore" (seconda finestra sincronizzata). */
(()=>{
 const frame=document.querySelector('.deck-frame');if(!frame)return;
 const stage=frame.querySelector('.deck-stage');
 const slides=[...stage.querySelectorAll('.slide')];
 const N=slides.length,W=1280,H=720;
 const lessonN=document.documentElement.dataset.lesson||'0';
 const moduleLabel=frame.dataset.module||'';
 const CAT={concetto:'Concetto',norma:'Norma',domanda:'Domanda',caso:'Caso in azienda',attivita:'Attività',attenzione:'Attenzione',checkpoint:'Checkpoint',dvr:'Dal nostro DVR',azienda:'Dato aziendale'};
 const $=id=>document.getElementById(id);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const isPresenter=location.hash==='#relatore';
 const chan='BroadcastChannel' in window?new BroadcastChannel('sic-deck-'+lessonN):null;

 /* --- preparazione delle slide: badge, piè di pagina, note stampabili --- */
 slides.forEach((s,k)=>{
  const cat=s.dataset.cat;
  if(cat){s.classList.add('cat-'+cat);if(!s.querySelector('.s-badge')){const b=document.createElement('span');b.className='s-badge';b.textContent=s.dataset.badge||CAT[cat]||cat;s.prepend(b)}}
  const f=document.createElement('div');f.className='s-foot';f.innerHTML='<span><b>'+moduleLabel+'</b> · Linea F Service S.a.s.</span><span>'+(k+1)+' / '+N+'</span>';s.append(f);
  s.setAttribute('role','group');s.setAttribute('aria-roledescription','slide');s.setAttribute('aria-label',(k+1)+' di '+N+': '+(s.dataset.title||''));
  const notes=s.querySelector('.notes');const pn=document.createElement('div');pn.className='slide-print-notes';pn.innerHTML='<b>Note del formatore — slide '+(k+1)+'</b>'+(notes?notes.innerHTML:'<p>—</p>');s.after(pn);
 });

 /* --- elementi interattivi --- */
 stage.addEventListener('click',e=>{const fl=e.target.closest('.flip');if(fl){fl.classList.toggle('open');fl.setAttribute('aria-expanded',fl.classList.contains('open'))}});
 stage.querySelectorAll('.flip').forEach(f=>f.setAttribute('aria-expanded','false'));
 // matrice dei rischi P×D (scala del DVR: molto basso 1, basso 2–4, medio 6–9, alto 12–16)
 stage.querySelectorAll('[data-matrix]').forEach(m=>{
  const out=m.parentElement.querySelector('.matrix-out');
  const cls=r=>r===1?['mb','Molto basso']:r<=4?['b','Basso']:r<=9?['m','Medio']:['a','Alto'];
  const P=['Improbabile','Poco probabile','Probabile','Molto probabile'],D=['Lieve','Modesto','Grave','Gravissimo'];
  let html='<div class="ax">P ↓ · D →</div>'+[1,2,3,4].map(d=>'<div class="ax">'+d+'<br><small>'+D[d-1]+'</small></div>').join('');
  for(let p=4;p>=1;p--){html+='<div class="ax">'+p+'<br><small>'+P[p-1].split(' ')[0]+'</small></div>';for(let d=1;d<=4;d++){const r=p*d,[c]=cls(r);html+='<button type="button" class="'+c+'" data-p="'+p+'" data-d="'+d+'" aria-label="P '+p+' per D '+d+'">'+r+'</button>'}}
  m.innerHTML=html;
  m.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;m.querySelectorAll('.sel').forEach(x=>x.classList.remove('sel'));b.classList.add('sel');const p=+b.dataset.p,d=+b.dataset.d,r=p*d,[,lab]=cls(r);if(out)out.innerHTML='<p><b>P = '+p+'</b> ('+P[p-1]+') × <b>D = '+d+'</b> ('+D[d-1]+')</p><p class="lead">R = <b>'+r+'</b> → rischio <b>'+lab.toLowerCase()+'</b></p>'+(r>=6?'<p class="small">Servono misure da programmare con priorità.</p>':'<p class="small">Si mantengono le misure e si controlla nel tempo.</p>')});
 });
 // abbinamento con menu a tendina
 stage.querySelectorAll('[data-match]').forEach(box=>{const btn=box.querySelector('.s-btn'),out=box.querySelector('.s-out');btn?.addEventListener('click',()=>{let ok=0;const sel=[...box.querySelectorAll('select')];sel.forEach(s=>{const good=s.value===s.dataset.ok;s.classList.toggle('ok',good);s.classList.toggle('ko',!good);if(good)ok++});if(out)out.textContent=ok+' su '+sel.length+' corretti'+(ok===sel.length?' — ottimo!':' — riguardiamo insieme quelli arancioni.')})});

 /* --- scala --- */
 function fit(){
  if(frame.classList.contains('deck-reading')){const z=Math.min(1,(frame.clientWidth||W)/W);frame.style.setProperty('--z',z.toFixed(4));return}
  const fw=frame.clientWidth,fh=frame.clientHeight;const s=frame.classList.contains('is-full')?Math.min(fw/W,fh/H):fw/W;
  const ox=frame.classList.contains('is-full')?(fw-W*s)/2:0,oy=frame.classList.contains('is-full')?(fh-H*s)/2:0;
  stage.style.transform='translate('+ox+'px,'+oy+'px) scale('+s+')';
 }
 new ResizeObserver(fit).observe(frame);addEventListener('resize',fit);

 /* --- navigazione --- */
 let i=0,st=0;
 const stepsOf=s=>[...s.querySelectorAll('[data-step]')].sort((a,b)=>(+a.dataset.step)-(+b.dataset.step));
 const count=$('deckCount'),bar=$('deckProgress'),notesBody=$('notesBody');
 function render(send=true){
  slides.forEach((s,k)=>s.classList.toggle('active',k===i));
  const steps=stepsOf(slides[i]);steps.forEach((x,k)=>x.classList.toggle('shown',k<st));
  if(count)count.textContent=(i+1)+' / '+N;
  if(bar)bar.style.width=((i+1)/N*100)+'%';
  const notes=slides[i].querySelector('.notes');if(notesBody)notesBody.innerHTML=notes?notes.innerHTML:'<p>Nessuna nota per questa slide.</p>';
  if(!isPresenter&&!frame.classList.contains('deck-reading'))history.replaceState(null,'','#s'+(i+1));
  if(send&&chan)chan.postMessage({t:'go',i,st});
  renderPresenter();
 }
 function go(n,s=0,send=true){i=Math.max(0,Math.min(N-1,n));st=s;render(send)}
 function next(){const steps=stepsOf(slides[i]);if(st<steps.length){st++;render()}else if(i<N-1)go(i+1,0)}
 function prev(){if(st>0){st--;render()}else if(i>0){go(i-1,stepsOf(slides[i-1]).length)}}
 chan&&chan.addEventListener('message',e=>{const d=e.data||{};if(d.t==='go'){i=d.i;st=d.st;render(false)}else if(d.t==='hello'&&!isPresenter){chan.postMessage({t:'go',i,st})}});

 /* --- schermo intero, laser, nero --- */
 const laser=document.createElement('div');laser.className='laser';frame.append(laser);
 const black=document.createElement('div');black.className='blackout';frame.append(black);
 const hint=document.createElement('div');hint.className='fs-hint';hint.textContent='← → per spostarti · Esc per uscire · N note · L laser · B nero';frame.append(hint);
 frame.addEventListener('mousemove',e=>{const r=frame.getBoundingClientRect();laser.style.left=(e.clientX-r.left)+'px';laser.style.top=(e.clientY-r.top)+'px';if(frame.classList.contains('is-full')){hint.classList.add('show');clearTimeout(hint._t);hint._t=setTimeout(()=>hint.classList.remove('show'),1800)}});
 function setFull(on){
  if(on){if(frame.requestFullscreen){frame.requestFullscreen().catch(()=>{frame.classList.add('fake-full','is-full');fit()})}else{frame.classList.add('fake-full','is-full');fit()}}
  else{if(document.fullscreenElement)document.exitFullscreen();frame.classList.remove('fake-full','is-full');fit()}
  frame.focus({preventScroll:true});
 }
 document.addEventListener('fullscreenchange',()=>{frame.classList.toggle('is-full',document.fullscreenElement===frame);if(!document.fullscreenElement)frame.classList.remove('fake-full');setTimeout(fit,30)});
 function toggleLaser(){const on=frame.classList.toggle('laser-on');$('btnLaser')?.setAttribute('aria-pressed',on)}
 function toggleBlack(){frame.classList.toggle('black')}

 /* --- indice --- */
 const ov=document.createElement('div');ov.className='overview';ov.hidden=true;ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Indice delle slide');
 ov.innerHTML='<h2>Indice delle slide</h2><button class="button primary close" type="button">Chiudi (Esc)</button><ol></ol>';document.body.append(ov);
 slides.forEach((s,k)=>{const li=document.createElement('li');const b=document.createElement('button');b.type='button';b.innerHTML='<small>'+(k+1)+' · '+(CAT[s.dataset.cat]||'Copertina')+'</small>'+(s.dataset.title||'Slide '+(k+1));b.onclick=()=>{ov.hidden=true;go(k,0);frame.focus({preventScroll:true})};li.append(b);ov.querySelector('ol').append(li)});
 ov.querySelector('.close').onclick=()=>{ov.hidden=true;frame.focus({preventScroll:true})};
 function overview(){ov.hidden=!ov.hidden;if(!ov.hidden){ov.querySelectorAll('button').forEach((b,k)=>b.classList.toggle('cur',k-1===i));(ov.querySelectorAll('ol button')[i]||ov).focus()}}

 /* --- note --- */
 const notesPanel=$('notesPanel');
 function toggleNotes(){if(!notesPanel)return;notesPanel.hidden=!notesPanel.hidden;$('btnNotes')?.setAttribute('aria-pressed',!notesPanel.hidden)}

 /* --- lettura e stampa --- */
 function reading(on){frame.classList.toggle('deck-reading',on);$('btnRead')?.setAttribute('aria-pressed',on);if($('btnRead'))$('btnRead').textContent=on?'Torna alla presentazione':'Leggi tutte le slide';fit();if(!on)render(false)}
 function printDeck(withNotes){
  const style=document.createElement('style');style.id='pageSize';
  style.textContent=withNotes?'@page{size:A4 portrait;margin:12mm}':'@page{size:338.67mm 190.5mm;margin:0}';
  document.head.append(style);document.documentElement.classList.add('printing');document.documentElement.classList.toggle('with-notes',withNotes);
  frame.style.setProperty('--pz',withNotes?'0.58':'1');
  const done=()=>{document.documentElement.classList.remove('printing','with-notes');style.remove();removeEventListener('afterprint',done);fit();render(false)};
  addEventListener('afterprint',done);setTimeout(()=>window.print(),60);
 }

 /* --- tastiera --- */
 let typed='';
 function onKey(e){
  if(e.target.closest&&e.target.closest('input,textarea,select,[contenteditable]'))return;
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  const inDeck=isPresenter||frame.contains(document.activeElement)||frame.classList.contains('is-full')||document.activeElement===frame;
  if(!ov.hidden){if(e.key==='Escape'){ov.hidden=true;frame.focus({preventScroll:true})}return}
  if(!inDeck||frame.classList.contains('deck-reading'))return;
  const k=e.key;
  if(['ArrowRight','PageDown',' '].includes(k)){e.preventDefault();next()}
  else if(['ArrowLeft','PageUp'].includes(k)){e.preventDefault();prev()}
  else if(k==='Home'){e.preventDefault();go(0)}else if(k==='End'){e.preventDefault();go(N-1)}
  else if(k==='f'||k==='F')setFull(!frame.classList.contains('is-full'))
  else if(k==='n'||k==='N')toggleNotes()
  else if(k==='o'||k==='O')overview()
  else if(k==='b'||k==='B'||k==='.')toggleBlack()
  else if(k==='l'||k==='L')toggleLaser()
  else if(/^[0-9]$/.test(k)){typed+=k;clearTimeout(onKey._t);onKey._t=setTimeout(()=>typed='',1500)}
  else if(k==='Enter'&&typed){go(+typed-1);typed=''}
  else if(k==='Escape'&&frame.classList.contains('fake-full'))setFull(false);
 }
 document.addEventListener('keydown',onKey);
 frame.addEventListener('click',e=>{if(e.target.closest('button,select,input,label,a,.flip,.matrix'))return;frame.focus({preventScroll:true})});
 // scorrimento al tocco
 let tx=null;frame.addEventListener('touchstart',e=>{tx=e.touches[0].clientX},{passive:true});frame.addEventListener('touchend',e=>{if(tx===null)return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>50)(dx<0?next:prev)();tx=null});

 /* --- pulsanti --- */
 const bind=(id,fn,refocus=true)=>{const b=$(id);if(b)b.onclick=()=>{fn();if(refocus&&!frame.classList.contains('deck-reading'))frame.focus({preventScroll:true})}};
 bind('btnPrev',prev);bind('btnNext',next);bind('btnFull',()=>setFull(true));bind('btnNotes',toggleNotes);bind('btnOverview',overview);bind('btnLaser',toggleLaser);
 bind('btnRead',()=>reading(!frame.classList.contains('deck-reading')),false);
 bind('btnPrint',()=>printDeck(false),false);bind('btnPrintNotes',()=>printDeck(true),false);
 bind('btnStart',()=>{document.getElementById('slide')?.scrollIntoView({behavior:reduced?'auto':'smooth'});go(0);setFull(true)});
 bind('btnPresenter',()=>{const w=window.open(location.pathname+'#relatore','relatore-'+lessonN,'width=1200,height=760');if(!w)alert('Il browser ha bloccato la finestra: consenti i pop-up per questo sito.')},false);

 /* --- vista relatore --- */
 let pv=null,t0=Date.now();
 function renderPresenter(){if(!pv)return;const notes=slides[i].querySelector('.notes');pv.querySelector('.pv-notes-body').innerHTML=notes?notes.innerHTML:'<p>Nessuna nota.</p>';pv.querySelector('.pv-count').textContent='Slide '+(i+1)+' / '+N+(stepsOf(slides[i]).length?' · passo '+st+'/'+stepsOf(slides[i]).length:'');pv.querySelector('.pv-next').textContent=i<N-1?'Prossima: '+(slides[i+1].dataset.title||''):'Ultima slide del modulo'}
 if(isPresenter){
  document.body.classList.add('presenter');
  pv=document.createElement('div');pv.id='presenterView';
  pv.innerHTML='<div><div class="pv-frame"></div><div class="pv-head"><button type="button" data-a="prev">← Indietro</button><button type="button" data-a="next">Avanti →</button><span class="pv-count"></span><span class="pv-timer">00:00</span><button type="button" data-a="reset">Azzera tempo</button></div><p class="pv-next"></p></div><div class="pv-notes"><h2>Note del formatore</h2><div class="pv-notes-body"></div></div>';
  document.body.append(pv);pv.querySelector('.pv-frame').append(frame);frame.style.borderRadius='0';
  pv.addEventListener('click',e=>{const a=e.target.closest('button')?.dataset.a;if(a==='prev')prev();else if(a==='next')next();else if(a==='reset')t0=Date.now()});
  setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000);pv.querySelector('.pv-timer').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')},1000);
  document.title='Relatore · '+document.title;chan&&chan.postMessage({t:'hello'});
 }

 /* --- avvio --- */
 const m=/^#s(\d+)$/.exec(location.hash);if(m)i=Math.min(N,Math.max(1,+m[1]))-1;
 fit();render(false);
 window.SicDeck={go,next,prev,get index(){return i},count:N};
})();
