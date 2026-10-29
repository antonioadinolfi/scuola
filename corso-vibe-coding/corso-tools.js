"use strict";
/* Strumenti di presentazione: evidenziatore dal vivo (CSS Custom Highlight API),
   gomma, riflettore e riepilogo dei punti chiave d'autore (mark.key / mark.warn). */
(()=>{
 const main=document.getElementById('contenuti');if(!main)return;
 const $=s=>document.querySelector(s);
 const store={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v);return true}catch{return false}},del(k){try{localStorage.removeItem(k)}catch{}}};

 /* ---------- 1. Punti chiave d'autore ---------- */
 const marks=[...main.querySelectorAll('mark.key,mark.warn')];
 marks.forEach((m,i)=>{if(!m.id)m.id='kp-'+(i+1)});
 const test=document.getElementById('test-finale');
 if(test&&marks.length){
  const box=document.createElement('aside');box.id='keyPoints';box.className='panel keypoints';
  box.innerHTML='<h3>Prima del test: i punti chiave della lezione</h3><p class="muted">Legenda: <mark class="key">concetto chiave</mark> · <mark class="warn">attenzione, errore tipico</mark>. Seleziona un punto per tornare al passaggio in cui compare.</p><ol></ol>';
  const ol=box.querySelector('ol');
  marks.forEach(m=>{const li=document.createElement('li');li.className=m.classList.contains('warn')?'warn':'key';const a=document.createElement('a');a.href='#'+m.id;const t=m.textContent.replace(/\s+/g,' ').trim();a.textContent=t.charAt(0).toUpperCase()+t.slice(1);
   a.addEventListener('click',e=>{e.preventDefault();const d=m.closest('details');if(d)d.open=true;m.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});m.classList.remove('flash');void m.offsetWidth;m.classList.add('flash');m.setAttribute('tabindex','-1');m.focus({preventScroll:true})});
   li.append(a);ol.append(li)});
  const h2=test.querySelector('h2');(h2||test.firstChild).after(box);
 }

 /* ---------- 2. Evidenziatore dal vivo ---------- */
 const hasHL=!!(window.CSS&&CSS.highlights&&window.Highlight);
 const COLORS=[['giallo','Giallo'],['verde','Verde'],['rosa','Rosa']];
 const KEY='vibeHlV1:'+location.pathname.replace(/index\.html$/,'');
 const SKIP='[role=status],[aria-live],.builder,#test-finale,#keyPoints,.hl-dock,script,style,noscript';
 const HL={};let items=[],mode='',color='giallo';
 if(hasHL)COLORS.forEach(([c])=>{HL[c]=new Highlight();CSS.highlights.set('vibe-'+c,HL[c])});

 const elOf=n=>n&&(n.nodeType===1?n:n.parentElement);
 const rootOf=n=>elOf(n)?.closest('section[id]')||main;
 const skipped=n=>!!elOf(n)?.closest(SKIP);
 function textNodes(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>skipped(n)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});const a=[];while(w.nextNode())a.push(w.currentNode);return a}
 function toOffset(root,container,offset){const point=document.createRange();point.setStart(container,offset);let total=0;for(const n of textNodes(root)){if(n===container)return total+offset;if(point.comparePoint(n,0)<0)total+=n.length;else break}return total}
 function fromOffset(root,off){let acc=0;const nodes=textNodes(root);for(const n of nodes){if(off<=acc+n.length)return [n,off-acc];acc+=n.length}const last=nodes.at(-1);return last?[last,last.length]:null}
 function build(it){const root=it.s?document.getElementById(it.s):main;if(!root||!main.contains(root))return null;const a=fromOffset(root,it.a),b=fromOffset(root,it.b);if(!a||!b)return null;try{const r=document.createRange();r.setStart(...a);r.setEnd(...b);return r.collapsed?null:r}catch{return null}}
 function render(){if(!hasHL)return;COLORS.forEach(([c])=>HL[c].clear());items.forEach(it=>{if(it.range&&HL[it.c])HL[it.c].add(it.range)})}
 function save(){const data=items.map(({s,a,b,c})=>({s,a,b,c}));if(data.length)store.set(KEY,JSON.stringify(data));else store.del(KEY)}
 function load(){try{const d=JSON.parse(store.get(KEY)||'[]');if(Array.isArray(d))items=d.filter(x=>x&&typeof x.a==='number'&&typeof x.b==='number'&&HL[x.c]).map(x=>({...x,range:build(x)})).filter(x=>x.range)}catch{items=[]}render()}

 /* ---------- 3. Riflettore ---------- */
 const SPOT='h2,h3,p,li,pre,figure,table,details,dl>div,.concept-card,.method-strip,.mode-card,.check,.task,.callout,.diagram,.contrast-grid>article,.actions,.steps-index,.lesson-nav,.home-toc,.builder,.assistant-picker,.prompt-label,.prompt-editor,.quiz-case,.spectrum,.table-wrap,.path-item,.glossary>div,.rule-grid>.panel,.kicker';
 let spot=null;
 const spotList=()=>[...main.querySelectorAll(SPOT)].filter(el=>el.offsetParent!==null&&!el.parentElement.closest(SPOT));
 function setSpot(el){spot=el;main.querySelectorAll('.hl-dim,.hl-spot').forEach(x=>x.classList.remove('hl-dim','hl-spot'));if(!el)return;el.classList.add('hl-spot');main.querySelectorAll(SPOT).forEach(x=>{if(!(x.contains(el)||el.contains(x)))x.classList.add('hl-dim')})}
 function moveSpot(dir){const list=spotList();if(!list.length)return;let i=spot?list.findIndex(x=>x===spot||x.contains(spot)):-1;i=i<0?(dir>0?0:list.length-1):Math.min(list.length-1,Math.max(0,i+dir));setSpot(list.at(i));spot.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}

 /* ---------- 4. Barra strumenti ---------- */
 const dock=document.createElement('div');dock.className='hl-dock';dock.setAttribute('role','toolbar');dock.setAttribute('aria-label','Strumenti di presentazione');
 dock.innerHTML='<button type="button" class="hl-open" aria-expanded="false" title="Strumenti per chi presenta: evidenziatore e riflettore">✎ Presenta</button>'+
  '<div class="hl-tools" hidden>'+
  '<button type="button" data-mode="evidenzia" aria-pressed="false" title="Seleziona una frase per evidenziarla (tasto E)">Evidenzia</button>'+
  COLORS.map(([c,l],i)=>'<button type="button" class="hl-swatch" data-c="'+c+'" aria-pressed="'+(c===color)+'" aria-label="Colore '+l+' (tasto '+(i+1)+')" title="'+l+' (tasto '+(i+1)+')"></button>').join('')+
  '<button type="button" data-mode="gomma" aria-pressed="false" title="Fai clic su un\'evidenziazione per toglierla (tasto G)">Gomma</button>'+
  '<button type="button" data-mode="riflettore" aria-pressed="false" title="Fai clic su un paragrafo per metterlo in risalto; frecce ↑ ↓ per spostarti (tasto R)">Riflettore</button>'+
  '<button type="button" class="hl-clear" title="Elimina tutte le evidenziazioni di questa pagina">Cancella tutto</button>'+
  '<button type="button" class="hl-close" aria-label="Chiudi gli strumenti (Esc)" title="Chiudi (Esc)">×</button>'+
  '<p class="hl-status" role="status" aria-live="polite"></p></div>';
 document.body.append(dock);
 const tools=dock.querySelector('.hl-tools'),openBtn=dock.querySelector('.hl-open'),status=dock.querySelector('.hl-status'),clearBtn=dock.querySelector('.hl-clear');
 const say=t=>{status.textContent=t};
 if(!hasHL){dock.querySelectorAll('[data-mode=evidenzia],[data-mode=gomma],.hl-swatch,.hl-clear').forEach(b=>{b.disabled=true;b.title='Questo browser non supporta l’evidenziazione: aggiornalo all’ultima versione'})}

 function setMode(m){mode=mode===m?'':m;document.body.classList.remove('hl-mode-evidenzia','hl-mode-gomma','hl-mode-riflettore');if(mode)document.body.classList.add('hl-mode-'+mode);
  dock.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
  if(mode!=='riflettore')setSpot(null);
  say(mode==='evidenzia'?'Seleziona una frase con il mouse: resterà evidenziata in '+color+'.':mode==='gomma'?'Fai clic su un’evidenziazione per toglierla.':mode==='riflettore'?'Fai clic su un paragrafo, oppure usa le frecce ↑ ↓. Esc per uscire.':'')}
 function setColor(c,user=true){color=c;document.body.dataset.hlColor=c;dock.querySelectorAll('.hl-swatch').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===c)));if(!user)return;if(mode!=='evidenzia'&&hasHL)setMode('evidenzia');else if(mode==='evidenzia')say('Colore: '+c+'.')}
 function openTools(on){tools.hidden=!on;openBtn.setAttribute('aria-expanded',String(on));openBtn.hidden=on;if(!on){if(mode)setMode(mode);say('')}else (tools.querySelector('button:not(:disabled)')||tools).focus()}
 setColor('giallo',false);
 openBtn.addEventListener('click',()=>openTools(true));
 dock.querySelector('.hl-close').addEventListener('click',()=>{openTools(false);openBtn.focus()});
 dock.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
 dock.querySelectorAll('.hl-swatch').forEach(b=>b.addEventListener('click',()=>setColor(b.dataset.c)));
 let armed=0;clearBtn.addEventListener('click',()=>{if(!items.length){say('Non ci sono evidenziazioni in questa pagina.');return}
  if(Date.now()-armed>4000){armed=Date.now();clearBtn.textContent='Conferma: cancella';say('Premi di nuovo per cancellare '+items.length+' evidenziazion'+(items.length===1?'e':'i')+'.');setTimeout(()=>{clearBtn.textContent='Cancella tutto'},4000);return}
  items=[];save();render();armed=0;clearBtn.textContent='Cancella tutto';say('Evidenziazioni cancellate.')});

 /* evidenziare */
 function capture(){if(mode!=='evidenzia'||!hasHL)return;const sel=getSelection();if(!sel||sel.isCollapsed||!sel.rangeCount)return;const r=sel.getRangeAt(0);
  if(!main.contains(r.commonAncestorContainer)){return}
  if(skipped(r.startContainer)||skipped(r.endContainer)){say('Questa parte della pagina non si può evidenziare (test, campi da compilare, messaggi).');return}
  const root=rootOf(r.startContainer);if(rootOf(r.endContainer)!==root){say('Evidenzia una frase alla volta, dentro la stessa sezione.');return}
  const a=toOffset(root,r.startContainer,r.startOffset),b=toOffset(root,r.endContainer,r.endOffset);if(b<=a)return;
  const it={s:root===main?'':root.id,a,b,c:color};it.range=build(it);if(!it.range)return;
  items=items.filter(x=>!(x.s===it.s&&x.a>=a&&x.b<=b));items.push(it);save();render();sel.removeAllRanges();
  say('Evidenziato. '+items.length+' evidenziazion'+(items.length===1?'e':'i')+' salvate in questo browser.')}
 main.addEventListener('pointerup',()=>setTimeout(capture,0));
 main.addEventListener('keyup',e=>{if(e.shiftKey)capture()});

 /* gomma e riflettore */
 function caretAt(x,y){if(document.caretPositionFromPoint){const p=document.caretPositionFromPoint(x,y);return p&&[p.offsetNode,p.offset]}if(document.caretRangeFromPoint){const r=document.caretRangeFromPoint(x,y);return r&&[r.startContainer,r.startOffset]}return null}
 main.addEventListener('click',e=>{
  if(mode==='gomma'){const p=caretAt(e.clientX,e.clientY);if(!p)return;const before=items.length;items=items.filter(it=>{try{return !it.range.isPointInRange(p[0],p[1])}catch{return true}});if(items.length<before){e.preventDefault();save();render();say('Evidenziazione rimossa.')}return}
  if(mode==='riflettore'){if(e.target.closest('a,button,input,select,textarea,summary,label'))return;const el=e.target.closest(SPOT);if(el&&main.contains(el))setSpot(el===spot?null:el)}
 },true);
 document.addEventListener('keydown',e=>{
  const typing=e.target.closest?.('input,textarea,select,[contenteditable]');
  if(e.key==='Escape'&&mode){setMode(mode);return}
  if(tools.hidden||typing||e.ctrlKey||e.metaKey||e.altKey)return;
  const k=e.key.toLowerCase();
  if(k==='e'&&hasHL)setMode('evidenzia');else if(k==='g'&&hasHL)setMode('gomma');else if(k==='r')setMode('riflettore');
  else if(['1','2','3'].includes(k)&&hasHL)setColor(COLORS.at(Number(k)-1)[0]);
  else if(mode==='riflettore'&&(e.key==='ArrowDown'||e.key==='ArrowUp')){e.preventDefault();moveSpot(e.key==='ArrowDown'?1:-1)}
 });
 load();
})();
