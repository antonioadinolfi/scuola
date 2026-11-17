"use strict";
/* Layout a schede per le lezioni (prova). Riorganizza la pagina esistente senza cambiarne i contenuti:
   schede, indice laterale, passi uno alla volta, approfondimenti richiudibili. */
(()=>{
 const main=document.getElementById('contenuti');if(!main||!document.body.classList.contains('layout-v2'))return;
 const $$=(s,r=document)=>[...r.querySelectorAll(s)];
 const TABS=[
  {id:'capire',label:'Capire',hint:'Concetti ed esempio guida'},
  {id:'fare',label:'Fare',hint:'Passi guidati e laboratorio'},
  {id:'classe',label:'In classe',hint:'Attività per gli studenti'},
  {id:'test',label:'Test',hint:'Verifica finale'},
  {id:'materiali',label:'Materiali',hint:'File e fonti'}
 ];
 const sections=$$(':scope > section',main);
 if(!document.getElementById('materiali')){const t=TABS.find(t=>t.id==='materiali');if(t){t.label='Fonti';t.hint='Fonti e approfondimenti'}}
 const stepsSection=sections.find(s=>s.getAttribute('aria-label')==='Attività guidate');
 const where=s=>{
  if(s===stepsSection)return 'fare';
  if(['tecniche','la-tua-disciplina','laboratorio-prompt','prova-app'].includes(s.id))return 'fare';
  if(s.classList.contains('panel')&&!s.id)return 'fare';
  if(s.id==='in-classe')return 'classe';
  if(s.id==='test-finale')return 'test';
  if(['materiali','fonti'].includes(s.id))return 'materiali';
  return 'capire';
 };
 const ORDER={fare:[stepsSection,'la-tua-disciplina','laboratorio-prompt','prova-app','tecniche','__panel']};

 // ---- struttura: barra schede, indice, pannelli
 const shell=document.createElement('div');shell.className='lv2-shell';
 const side=document.createElement('aside');side.className='lv2-side';side.setAttribute('aria-label','Indice della scheda');
 const content=document.createElement('div');content.className='lv2-content';
 const bar=document.createElement('div');bar.className='lv2-tabs';bar.setAttribute('role','tablist');bar.setAttribute('aria-label','Parti della lezione');
 const panels={};
 TABS.forEach((t,i)=>{
  const b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.id='tab-'+t.id;b.setAttribute('aria-controls','panel-'+t.id);b.dataset.tab=t.id;
  b.innerHTML='<span class="lv2-n">'+(i+1)+'</span><span class="lv2-l">'+t.label+'</span>';bar.append(b);
  const p=document.createElement('div');p.className='lv2-panel';p.id='panel-'+t.id;p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby','tab-'+t.id);p.hidden=true;panels[t.id]=p;content.append(p);
 });
 const lessonNav=main.querySelector(':scope > .lesson-nav');
 sections.forEach(s=>panels[where(s)].append(s));
 // ordine della scheda Fare: prima i passi, poi tecniche, disciplina, laboratorio, elaborato, prova
 const fare=panels.fare;
 ORDER.fare.forEach(k=>{const el=k==='__panel'?$$(':scope > section.panel',fare).find(s=>!s.id):(typeof k==='string'?fare.querySelector(':scope > #'+CSS.escape(k)):k);if(el)fare.append(el)});
 shell.append(side,content);
 main.append(bar,shell);
 if(lessonNav)main.insertBefore(lessonNav,bar);

 // ---- passi guidati: uno alla volta
 const steps=stepsSection?$$(':scope > article.step',stepsSection):[];
 let stepIdx=0,stepNav=null;
 if(steps.length){
  stepsSection.id=stepsSection.id||'passi';
  const h=document.createElement('h2');h.textContent='I cinque passi guidati';stepsSection.prepend(h);
  stepNav=document.createElement('div');stepNav.className='lv2-stepper';stepNav.setAttribute('role','group');stepNav.setAttribute('aria-label','Passi guidati');
  steps.forEach((st,i)=>{const b=document.createElement('button');b.type='button';b.dataset.step=String(i);const t=(st.querySelector('h3')?.textContent||'').replace(/^\d+\.\s*/,'');b.innerHTML='<span class="lv2-n">'+(i+1)+'</span><span class="lv2-l"></span>';b.querySelector('.lv2-l').textContent=t;b.addEventListener('click',()=>showStep(i,true));stepNav.append(b)});
  h.after(stepNav);
  const foot=document.createElement('div');foot.className='lv2-stepfoot actions';foot.innerHTML='<button type="button" class="button" data-dir="-1">← Passo precedente</button><span class="muted lv2-stepcount" aria-live="polite"></span><button type="button" class="button primary" data-dir="1">Passo successivo →</button>';
  stepsSection.append(foot);
  foot.addEventListener('click',e=>{const d=e.target.closest('[data-dir]');if(!d)return;const n=stepIdx+Number(d.dataset.dir);if(n>=steps.length){reveal(document.getElementById('la-tua-disciplina')||fare,true);return}showStep(n,true)});
  const oldIndex=main.querySelector('.steps-index');if(oldIndex)oldIndex.hidden=true;
 }
 function showStep(i,scroll){stepIdx=Math.max(0,Math.min(steps.length-1,i));steps.forEach((s,j)=>s.classList.toggle('lv2-off',j!==stepIdx));
  $$('button',stepNav).forEach((b,j)=>{b.setAttribute('aria-current',j===stepIdx?'step':'false')});
  const f=stepsSection.querySelector('.lv2-stepfoot');f.querySelector('[data-dir="-1"]').disabled=stepIdx===0;f.querySelector('[data-dir="1"]').textContent=stepIdx===steps.length-1?'Applica alla tua disciplina →':'Passo successivo →';
  f.querySelector('.lv2-stepcount').textContent='Passo '+(stepIdx+1)+' di '+steps.length;
  if(scroll)stepsSection.scrollIntoView({block:'start',behavior:smooth()})}

 // ---- approfondimenti richiudibili (senza cambiare l'ordine del testo)
 function fold(el,headSel,open){const head=headSel.map(q=>el.querySelector(':scope > '+q)).filter(Boolean);if(!head.length)return;const d=document.createElement('details');d.className='lv2-fold';d.open=!!open;const sum=document.createElement('summary');head.forEach(h=>sum.append(h));while(el.firstChild)d.append(el.firstChild);d.prepend(sum);el.append(d)}
 $$('#tecniche .technique').forEach(t=>fold(t,['.kicker','h3'],false));
 $$('.case-example').forEach(c=>fold(c,['h4'],false));
 const fonti=document.getElementById('fonti');
 if(fonti){const d=document.createElement('details');d.className='lv2-fold panel';const sum=document.createElement('summary');const h=fonti.querySelector(':scope > h2');if(h){sum.append(h);d.append(sum);while(fonti.firstChild)d.append(fonti.firstChild);fonti.append(d)}}

 // ---- pulsanti avanti/indietro in fondo a ogni scheda
 TABS.forEach((t,i)=>{const nav=document.createElement('div');nav.className='lv2-pager';const prev=TABS[i-1],next=TABS[i+1];
  nav.innerHTML=(prev?'<button type="button" class="button" data-go="'+prev.id+'">← '+prev.label+'</button>':'<span></span>')+(next?'<button type="button" class="button primary" data-go="'+next.id+'">Avanti: '+next.label+' →</button>':'<span></span>');
  panels[t.id].append(nav)});
 main.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)activate(g.dataset.go,true)});

 // ---- attivazione schede e indice laterale
 const smooth=()=>matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
 let current='';const KEY='vibeLv2Tab:'+location.pathname;
 function buildSide(id){const t=TABS.find(x=>x.id===id),i=TABS.indexOf(t);side.textContent='';
  const h=document.createElement('p');h.className='lv2-side-h';h.textContent='Scheda '+(i+1)+' di '+TABS.length+' · '+t.label;side.append(h);
  const ul=document.createElement('ul');
  $$(':scope > section',panels[id]).forEach(s=>{const h2=s.querySelector('h2');if(!h2)return;if(!s.id)s.id='sez-'+Math.random().toString(36).slice(2,8);const li=document.createElement('li');if(s.dataset.level)li.dataset.level=s.dataset.level;const a=document.createElement('a');a.href='#'+s.id;a.textContent=h2.textContent.trim();li.append(a);ul.append(li)});
  side.append(ul);const lg=document.createElement('p');lg.className='lv2-legend';lg.innerHTML='<span class="lv2-dot ess"></span>Essenziale · in aula<br><span class="lv2-dot app"></span>Approfondimento · studio personale';side.append(lg);const prog=document.createElement('div');prog.className='lv2-prog';prog.innerHTML='<span style="width:'+((i+1)/TABS.length*100)+'%"></span>';side.append(prog);spy()}
 function activate(id,scroll){if(!panels[id])return;current=id;TABS.forEach(t=>{const on=t.id===id;panels[t.id].hidden=!on;const b=document.getElementById('tab-'+t.id);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});
  buildSide(id);note();try{sessionStorage.setItem(KEY,id)}catch{}
  if(scroll)bar.scrollIntoView({block:'start',behavior:smooth()})}
 bar.addEventListener('click',e=>{const b=e.target.closest('[role=tab]');if(b)activate(b.dataset.tab,true)});
 bar.addEventListener('keydown',e=>{const i=TABS.findIndex(t=>t.id===current);let n=-1;if(e.key==='ArrowRight')n=(i+1)%TABS.length;else if(e.key==='ArrowLeft')n=(i-1+TABS.length)%TABS.length;else if(e.key==='Home')n=0;else if(e.key==='End')n=TABS.length-1;if(n<0)return;e.preventDefault();activate(TABS[n].id,false);document.getElementById('tab-'+TABS[n].id).focus()});
 function spy(){const links=$$('a',side);let active=null;links.forEach(a=>{const el=document.getElementById(a.getAttribute('href').slice(1));if(el&&el.getBoundingClientRect().top<160)active=a});links.forEach(a=>a.classList.toggle('on',a===(active||links[0])))}
 addEventListener('scroll',()=>requestAnimationFrame(spy),{passive:true});

 // ---- rivelare un elemento ovunque si trovi (scheda, passo, riquadro chiuso)
 function reveal(el,scroll){if(!el||!main.contains(el))return false;if(mode==='aula'&&el.closest('[data-level="approfondimento"]')&&!el.closest('#panel-materiali'))setMode('completo');const p=el.closest('.lv2-panel');if(p&&p.hidden)activate(p.id.replace('panel-',''),false);
  const st=el.closest('article.step');if(st&&steps.includes(st))showStep(steps.indexOf(st),false);
  for(let d=el.closest('details');d;d=d.parentElement?.closest('details'))d.open=true;
  if(el.tagName==='DETAILS')el.open=true;
  if(scroll)el.scrollIntoView({block:el.tagName==='MARK'?'center':'start',behavior:smooth()});return true}
 window.VibeLayout={reveal,activate,setMode:m=>setMode(m)};
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=decodeURIComponent(a.getAttribute('href').slice(1));if(!id)return;const el=document.getElementById(id);if(el&&main.contains(el)){if(a.closest('#keyPoints')){reveal(el,false);return}e.preventDefault();reveal(el,true);history.replaceState(null,'','#'+id)}},true);
 addEventListener('hashchange',()=>{const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(el)reveal(el,true)});
 addEventListener('beforeprint',()=>{document.body.classList.add('lv2-print');$$('details',main).forEach(d=>{d.dataset.wasOpen=d.open?'1':'';d.open=true})});
 addEventListener('afterprint',()=>{document.body.classList.remove('lv2-print');$$('details',main).forEach(d=>{if(d.dataset.wasOpen==='')d.open=false})});

 // ---- essenziale / approfondimento: etichette, separatori e percorso «in aula»
 const LV={essenziale:'Essenziale · in aula',approfondimento:'Approfondimento · studio personale'};
 $$('.case-example',main).forEach(c=>{c.dataset.level='approfondimento'});
 $$('[data-level]',main).forEach(el=>{const b=document.createElement('span');const l=el.dataset.level;b.className='lv2-level '+(l==='essenziale'?'ess':'app');b.textContent=LV[l]||l;
  if(el.tagName==='DETAILS'){const sm=el.querySelector(':scope > summary');if(sm)sm.append(' ',b)}else{const w=document.createElement('div');w.className='lv2-levelrow';w.append(b);el.prepend(w)}});
 Object.values(panels).forEach(p=>{const secs=$$(':scope > section',p);const first=secs.find((s,i)=>s.dataset.level==='approfondimento'&&secs.slice(0,i).some(x=>x.dataset.level==='essenziale'));
  if(first){const d=document.createElement('p');d.className='lv2-divider';d.dataset.level='approfondimento';d.textContent='Approfondimenti · per lo studio personale';first.before(d)}});
 const MKEY='vibeLv2Mode';let mode='completo';try{if(localStorage.getItem(MKEY)==='aula')mode='aula'}catch{}
 const modeBar=document.createElement('div');modeBar.className='lv2-mode';modeBar.setAttribute('role','group');modeBar.setAttribute('aria-label','Percorso da mostrare');
 modeBar.innerHTML='<span class="lv2-mode-l">Percorso</span><button type="button" data-mode="aula"><span class="lv2-dot ess"></span>In aula · solo l’essenziale</button><button type="button" data-mode="completo"><span class="lv2-dot app"></span>Completo · con approfondimenti</button>';
 bar.after(modeBar);
 const notes={};Object.keys(panels).forEach(id=>{const n=document.createElement('p');n.className='lv2-hidnote';n.hidden=true;panels[id].querySelector('.lv2-pager').before(n);notes[id]=n});
 function note(){Object.keys(notes).forEach(id=>{const n=notes[id];const k=id==='materiali'?0:$$('[data-level="approfondimento"]',panels[id]).filter(e=>!e.classList.contains('lv2-divider')&&!e.parentElement.closest('[data-level="approfondimento"]')).length;
  if(mode==='aula'&&k){n.hidden=false;n.innerHTML='In questa scheda '+(k===1?'c’è <strong>1 approfondimento</strong>':'ci sono <strong>'+k+' approfondimenti</strong>')+' per lo studio personale, ora nascost'+(k===1?'o':'i')+'. <button type="button" class="lv2-link" data-mode="completo">Mostra tutto</button>'}else n.hidden=true})}
 function setMode(m){mode=m==='aula'?'aula':'completo';document.body.classList.toggle('lv2-aula',mode==='aula');$$('button',modeBar).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));try{localStorage.setItem(MKEY,mode)}catch{}note();if(current)spy()}
 main.addEventListener('click',e=>{const b=e.target.closest('[data-mode]');if(b)setMode(b.dataset.mode)});

 // ---- intestazione: restano solo i comandi, la navigazione passa alle schede
 $$('header .actions a[href^="#"]').forEach(a=>a.remove());

 // ---- avvio
 if(steps.length)showStep(0,false);
 setMode(mode);
 let start='capire';try{const s=sessionStorage.getItem(KEY);if(panels[s])start=s}catch{}
 activate(start,false);
 const target=location.hash.length>1&&!location.hash.startsWith('#formatore')?document.getElementById(decodeURIComponent(location.hash.slice(1))):null;
 if(target)setTimeout(()=>reveal(target,true),50);
})();
