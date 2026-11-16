"use strict";
/* UD12 · Lezione 3 — simulazioni interattive delle slide di approfondimento.
   Ogni simulazione si monta su un elemento [data-sim="nome"]. Nessun dato lascia il browser. */
(()=>{
const $=(r,s)=>r.querySelector(s),$$=(r,s)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=(n,d=0)=>Number(n).toLocaleString('it-IT',{minimumFractionDigits:d,maximumFractionDigits:d});
const now=()=>new Date().toLocaleTimeString('it-IT');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const S={};

/* 1. Online / offline e sincronizzazione */
S.sync=el=>{
 el.innerHTML=`<div class="row" style="justify-content:space-between"><h3>Preventivo_Rossi.docx</h3><div class="row"><span>Connessione:</span><button class="btn" data-a="net" aria-pressed="true">📶 Online</button></div></div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px">
  <div><b>Sul tuo computer</b><div class="mini-doc" contenteditable="true" spellcheck="false">Gentile Sig. Rossi,
le inviamo il preventivo per la fornitura di 20 magliette personalizzate.</div></div>
  <div><b>Nel cloud</b> <span class="tag ok" data-o="st">Sincronizzato</span><div class="mini-doc" data-o="cloud" style="background:#f3f7fb"></div></div>
 </div><p class="out" data-o="msg" style="margin-top:8px">Scrivi nel documento a sinistra, poi prova a togliere la connessione.</p>`;
 const doc=$(el,'.mini-doc'),cloud=$(el,'[data-o=cloud]'),st=$(el,'[data-o=st]'),msg=$(el,'[data-o=msg]'),b=$(el,'[data-a=net]');
 let online=true,queue=0,t;cloud.textContent=doc.textContent;
 const push=()=>{cloud.textContent=doc.textContent;st.className='tag ok';st.textContent='Sincronizzato';msg.textContent='Salvato nel cloud alle '+now()+'.'};
 doc.addEventListener('input',()=>{if(online){st.className='tag wait';st.textContent='Salvataggio…';clearTimeout(t);t=setTimeout(push,700)}else{queue++;st.className='tag ko';st.textContent='Non sincronizzato';msg.textContent=queue+' modifiche in attesa: restano solo su questo computer.'}});
 b.onclick=()=>{online=!online;b.setAttribute('aria-pressed',online);b.textContent=online?'📶 Online':'✈️ Offline';
  if(online){if(queue){st.className='tag wait';st.textContent='Sincronizzazione…';msg.textContent='Connessione tornata: invio '+queue+' modifiche…';setTimeout(()=>{push();msg.textContent='Sincronizzate '+queue+' modifiche alle '+now()+'.';queue=0},1200)}else msg.textContent='Di nuovo online.'}
  else msg.textContent='Offline: con un programma installato continui a lavorare; un’app solo web smetterebbe di funzionare.'};
};

/* 2. Mini foglio di calcolo con formule */
S.foglio=el=>{
 const init=[['Voce','€ al mese'],['Ricavi','4500'],['Affitto','700'],['Materiali','1200'],['Utenze e telefono','250'],['Costi totali','=SOMMA(B3:B5)'],['Utile','=B2-B6'],['Margine %','=B7/B2*100']];
 const R=init.length,C=2,cols='AB';const data=init.map(r=>[...r]);
 el.innerHTML=`<div class="fx"><b data-o="ref">B2</b><span>ƒx</span><span data-o="raw"></span></div><table class="sheet"><thead><tr><th></th><th>A</th><th>B</th></tr></thead><tbody></tbody></table><p class="small muted" style="margin:8px 0 0">Prova: cambia i Ricavi in B2, oppure scrivi in B6 <code>=B3+B4+B5</code>. Le celle verdi sono calcolate da formule.</p>`;
 const tb=$(el,'tbody');
 for(let r=0;r<R;r++){const tr=document.createElement('tr');tr.innerHTML='<th>'+(r+1)+'</th>'+[0,1].map(c=>'<td><input data-r="'+r+'" data-c="'+c+'" aria-label="Cella '+cols[c]+(r+1)+'"></td>').join('');tb.append(tr)}
 const val=(r,c,seen=new Set())=>{const raw=data[r]?.[c]??'';if(!String(raw).startsWith('='))return parseFloat(String(raw).replace(',','.'))||0;const k=r+','+c;if(seen.has(k))throw Error('ciclo');seen.add(k);
  let e=raw.slice(1).toUpperCase().replace(/(SOMMA|MEDIA)\(([AB])(\d+):([AB])(\d+)\)/g,(m,f,c1,r1,c2,r2)=>{const v=[];for(let rr=+r1;rr<=+r2;rr++)for(let cc=cols.indexOf(c1);cc<=cols.indexOf(c2);cc++)v.push(val(rr-1,cc,new Set(seen)));const s=v.reduce((a,b)=>a+b,0);return '('+(f==='SOMMA'?s:s/v.length)+')'});
  e=e.replace(/([AB])(\d+)/g,(m,cc,rr)=>'('+val(+rr-1,cols.indexOf(cc),new Set(seen))+')').replace(/,/g,'.');
  if(!/^[0-9+\-*/().\s]*$/.test(e))throw Error('formula');const v=Function('return '+e)();if(!isFinite(v))throw Error('div0');return v};
 const show=()=>$$(tb,'input').forEach(i=>{const r=+i.dataset.r,c=+i.dataset.c,raw=data[r][c];const td=i.parentElement;td.classList.toggle('calc',String(raw).startsWith('='));td.classList.remove('err');
  if(document.activeElement===i){i.value=raw;return}
  if(String(raw).startsWith('=')){try{const v=val(r,c);i.value=fmt(v,r===7?1:0)+(r===7?' %':'')}catch(e){i.value='#ERRORE';td.classList.add('err')}}else i.value=c===1&&r>0&&raw!==''&&!isNaN(parseFloat(raw))?fmt(parseFloat(raw)):raw});
 tb.addEventListener('focusin',e=>{const i=e.target;if(!i.dataset)return;$(el,'[data-o=ref]').textContent=cols[i.dataset.c]+(+i.dataset.r+1);$(el,'[data-o=raw]').textContent=data[i.dataset.r][i.dataset.c];i.value=data[i.dataset.r][i.dataset.c]});
 tb.addEventListener('input',e=>{const i=e.target;data[i.dataset.r][i.dataset.c]=i.value;$(el,'[data-o=raw]').textContent=i.value});
 tb.addEventListener('focusout',()=>setTimeout(show,0));
 tb.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const i=e.target,n=$(tb,'input[data-r="'+(+i.dataset.r+1)+'"][data-c="'+i.dataset.c+'"]');(n||i).focus();if(!n)i.blur()}});
 show();
};

/* 3. Stili e indice automatico */
S.stili=el=>{
 const P=[['Titolo 1','Piano di impresa'],['Titolo 2','L’idea'],['Corpo','Stampa digitale su abbigliamento per scuole e società sportive.'],['Titolo 2','Il mercato'],['Corpo','Nel comune ci sono 9 scuole e 14 associazioni sportive.'],['Titolo 2','Le spese'],['Corpo','Plotter, pressa termica, PC e software.']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1.1fr;gap:16px"><div><h3>Assegna gli stili</h3><div data-o="list"></div><div class="row" style="margin-top:8px"><button class="btn gold" data-a="font">Cambia l’aspetto di tutti i «Titolo 2»</button></div></div><div><h3>Anteprima del documento</h3><div class="mini-doc" data-o="prev" style="min-height:300px;white-space:normal"></div></div></div>`;
 const list=$(el,'[data-o=list]'),prev=$(el,'[data-o=prev]');let alt=false;
 P.forEach((p,k)=>{const d=document.createElement('div');d.className='row';d.style.margin='0 0 5px';d.innerHTML='<select data-k="'+k+'"><option>Titolo 1</option><option>Titolo 2</option><option>Corpo</option></select><span style="font-size:16px">'+esc(p[1])+'</span>';$(d,'select').value=p[0];list.append(d)});
 const draw=()=>{const toc=P.filter(p=>p[0]!=='Corpo');prev.innerHTML='<div style="border:1px dashed #a9bfce;border-radius:8px;padding:6px 10px;margin-bottom:10px;font-size:15px"><b>Indice (generato automaticamente)</b>'+toc.map(p=>'<div style="padding-left:'+(p[0]==='Titolo 2'?18:0)+'px">'+esc(p[1])+'</div>').join('')+'</div>'+P.map(p=>p[0]==='Titolo 1'?'<div style="font-size:26px;font-weight:800;color:#102a43">'+esc(p[1])+'</div>':p[0]==='Titolo 2'?'<div style="font-size:20px;font-weight:800;margin-top:6px;color:'+(alt?'#d9822b':'#176b87')+';'+(alt?'text-transform:uppercase;letter-spacing:.06em':'')+'">'+esc(p[1])+'</div>':'<div style="font-size:16px">'+esc(p[1])+'</div>').join('')};
 list.addEventListener('change',e=>{P[e.target.dataset.k][0]=e.target.value;draw()});
 $(el,'[data-a=font]').onclick=()=>{alt=!alt;draw()};draw();
};

/* 4. Collaborazione in tempo reale e cronologia delle versioni */
S.collab=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px"><div><div class="row" style="justify-content:space-between"><h3>Volantino_inaugurazione</h3><div class="row"><span class="tag" style="background:#d8eefb">Anna</span><span class="tag" style="background:#fde4d4">Marco</span></div></div><div class="mini-doc" data-o="doc" style="min-height:190px;white-space:normal"></div><div class="row" style="margin-top:8px"><button class="btn gold" data-a="play">▶ Avvia la simulazione</button><button class="btn ghost" data-a="reset">Ricomincia</button></div></div>
 <div><h3>Cronologia delle versioni</h3><ol data-o="hist" style="font-size:16px;padding-left:22px"></ol><p class="small muted" style="font-size:15px">Clicca una versione per ripristinarla.</p></div></div>`;
 const doc=$(el,'[data-o=doc]'),hist=$(el,'[data-o=hist]');let versions=[],timers=[];
 const base='<p><b>Inaugurazione del laboratorio</b></p><p>Sabato vi aspettiamo per l’apertura.</p>';
 const steps=[[600,'Anna','<p><b>Inaugurazione del laboratorio</b></p><p>Sabato <span style="background:#d8eefb">14 marzo, ore 17</span> vi aspettiamo per l’apertura.</p>','Anna aggiunge data e ora'],
  [1800,'Marco','<p><b>Inaugurazione del laboratorio</b></p><p>Sabato <span style="background:#d8eefb">14 marzo, ore 17</span> vi aspettiamo per l’apertura.</p><p style="background:#fde4d4">Gadget personalizzato in omaggio ai primi 30 visitatori!</p>','Marco aggiunge l’omaggio'],
  [3000,'Anna','<p><b>Inaugurazione del laboratorio</b></p><p>Sabato <span style="background:#d8eefb">14 marzo, ore 17</span> vi aspettiamo per l’apertura.</p><p style="background:#fde4d4">Gadget personalizzato in omaggio ai primi 30 visitatori!</p><p style="font-size:14px;border-left:4px solid #f4b942;padding-left:8px">💬 Anna: «30 o 50? Verifichiamo le scorte.»</p>','Anna inserisce un commento'],
  [4300,'Marco','<p><b>Inaugurazione del laboratorio</b></p><p>Sabato vi aspettiamo per l’apertura.</p>','Marco cancella per errore due paragrafi']];
 const addV=(who,html,what)=>{versions.push({who,html,what,t:now()});const li=document.createElement('li');li.innerHTML='<button class="chip" style="font-size:14px">'+esc(versions.at(-1).t)+' · '+esc(what)+'</button>';const k=versions.length-1;li.firstChild.onclick=()=>{doc.innerHTML=versions[k].html;addV('Tu',versions[k].html,'Ripristinata la versione '+(k+1))};hist.append(li)};
 const reset=()=>{timers.forEach(clearTimeout);timers=[];versions=[];hist.innerHTML='';doc.innerHTML=base;addV('Anna',base,'Versione iniziale')};
 $(el,'[data-a=play]').onclick=()=>{reset();steps.forEach(([ms,who,html,what])=>timers.push(setTimeout(()=>{doc.innerHTML=html;addV(who,html,what)},reduced?ms/4:ms)))};
 $(el,'[data-a=reset]').onclick=reset;reset();
};

/* 5. Matrice di scelta del software con pesi */
S.scelta=el=>{
 const crit=[['Compatibilità con i file Office',[3,3,5]],['Collaborazione in tempo reale',[1,5,4]],['Lavoro senza connessione',[5,2,4]],['Costo contenuto',[5,4,2]],['Controllo dei dati (dove sono salvati)',[5,2,3]],['Facilità d’uso',[3,5,4]],['Supporto e assistenza',[3,3,4]]];
 const sw=[['LibreOffice','#2a9d8f'],['Google Documenti/Fogli','#176b87'],['Microsoft 365 / Office','#d9822b']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.25fr 1fr;gap:20px"><div><h3>Quanto conta per te? (peso 0–5)</h3><div data-o="w"></div></div><div><h3>Punteggio pesato</h3><div data-o="bars"></div><p class="small muted" style="font-size:15px;margin-top:8px">Punteggi da 1 a 5 indicativi, da discutere in aula: cambiano con la versione e il piano scelto.</p></div></div>`;
 const w=$(el,'[data-o=w]'),bars=$(el,'[data-o=bars]');
 crit.forEach((c,k)=>{const l=document.createElement('label');l.className='sl';l.innerHTML='<span>'+esc(c[0])+'</span><input type="range" min="0" max="5" value="3" data-k="'+k+'"><b>3</b>';w.append(l)});
 const draw=()=>{const ws=$$(w,'input').map(i=>+i.value);$$(w,'label b').forEach((b,k)=>b.textContent=ws[k]);const max=ws.reduce((a,b)=>a+b,0)*5||1;
  const tot=sw.map((s,j)=>crit.reduce((a,c,k)=>a+c[1][j]*ws[k],0));const best=Math.max(...tot);
  bars.innerHTML=sw.map((s,j)=>'<div style="margin:0 0 12px"><div class="row" style="justify-content:space-between"><b>'+s[0]+'</b><span>'+tot[j]+' / '+max+(tot[j]===best?' ★':'')+'</span></div><div class="meter" style="height:22px"><span style="width:'+(tot[j]/max*100)+'%;background:'+s[1]+'"></span></div></div>').join('')};
 w.addEventListener('input',draw);draw();
};

/* 6. Da CSV a grafico, con controllo dei metadati */
S.csv=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:.9fr 1.3fr;gap:18px"><div><h3>Dati (CSV, separatore ;)</h3><textarea data-o="t" rows="6" style="width:100%;font-family:ui-monospace,Consolas,monospace;font-size:16px">anno;nuove imprese
2021;118
2022;131
2023;127
2024;142
2025;150</textarea><p class="small muted" style="font-size:14px;margin:4px 0">Dati di esempio, non reali: sostituiscili con un dataset vero scaricato in aula.</p>
 <h3 style="margin-top:6px">Metadati presenti?</h3><div class="chips" data-o="m"><button class="chip" data-m>Ente che pubblica</button><button class="chip" data-m>Licenza (es. CC BY 4.0)</button><button class="chip" data-m>Data di aggiornamento</button><button class="chip" data-m>Unità di misura</button><button class="chip" data-m>Territorio di riferimento</button></div></div>
 <div><svg class="ig" data-o="g" viewBox="0 0 560 300" role="img" aria-label="Grafico a barre dei dati"></svg><p class="out" data-o="v"></p></div></div>`;
 const t=$(el,'[data-o=t]'),g=$(el,'[data-o=g]'),v=$(el,'[data-o=v]');
 const draw=()=>{const rows=t.value.trim().split(/\n/).map(r=>r.split(/[;,\t]/));const head=rows.shift()||[];const pts=rows.filter(r=>r.length>1&&!isNaN(parseFloat(r[1]))).map(r=>[r[0],parseFloat(r[1])]);
  if(!pts.length){g.innerHTML='<text x="20" y="40" font-size="18" fill="#8a3d06">Nessun dato numerico valido nella seconda colonna.</text>';return}
  const max=Math.max(...pts.map(p=>p[1]))*1.15,bw=440/pts.length;
  g.innerHTML='<line x1="60" y1="250" x2="540" y2="250" stroke="#9aa9b8"/><text x="60" y="22" font-size="16" font-weight="700" fill="#102a43">'+esc(head[1]||'valore')+' per '+esc(head[0]||'categoria')+'</text>'+pts.map((p,k)=>{const h=p[1]/max*210,x=70+k*bw;return '<rect x="'+(x+6)+'" y="'+(250-h)+'" width="'+(bw-12)+'" height="'+h+'" rx="5" fill="#176b87"><animate attributeName="height" from="0" to="'+h+'" dur=".5s"/><animate attributeName="y" from="250" to="'+(250-h)+'" dur=".5s"/></rect><text x="'+(x+bw/2)+'" y="'+(244-h)+'" text-anchor="middle" font-size="15" font-weight="700" fill="#102a43">'+fmt(p[1])+'</text><text x="'+(x+bw/2)+'" y="272" text-anchor="middle" font-size="15" fill="#52657a">'+esc(p[0])+'</text>'}).join('')};
 const meta=()=>{const on=$$(el,'[data-m].sel').length;v.textContent=on===5?'✓ Dataset documentato: si può citare e riutilizzare secondo la licenza.':on>=3?'Quasi: mancano '+(5-on)+' metadati. Senza licenza o fonte il riuso è a rischio.':'Dati poco affidabili: senza metadati non sai chi li ha prodotti, quando, con quale licenza.'};
 $(el,'[data-o=m]').addEventListener('click',e=>{const c=e.target.closest('[data-m]');if(c){c.classList.toggle('sel');meta()}});
 t.addEventListener('input',draw);draw();meta();
};

/* 7. Le 5 stelle degli open data */
S.stelle=el=>{
 const L=[['Sul web con licenza aperta','Un PDF con la tabella dei prezzi, pubblicato con licenza CC BY.','Lo leggi, ma per analizzarlo devi ricopiare i numeri a mano.'],['Dati strutturati','Un file Excel (.xlsx).','Puoi fare calcoli, ma serve un programma specifico.'],['Formato aperto','Un CSV, leggibile da qualsiasi programma.','Il formato più comune nei portali open data.'],['Identificatori web (URI)','Ogni dato ha un indirizzo web proprio (es. RDF).','Altri possono puntare al singolo dato.'],['Dati collegati (Linked Data)','I dati rimandano ad altri dataset (es. Comune → ISTAT).','Il livello più alto: i dati si combinano tra loro.']];
 el.innerHTML='<div class="stars">'+L.map((l,k)=>'<button class="star" data-k="'+k+'"><b>'+'★'.repeat(k+1)+'</b>'+esc(l[0])+'</button>').join('')+'</div><div class="s-box blue" data-o="d" style="margin-top:14px;font-size:20px">Tocca una stella.</div>';
 el.addEventListener('click',e=>{const b=e.target.closest('.star');if(!b)return;const k=+b.dataset.k;$$(el,'.star').forEach((s,j)=>s.classList.toggle('on',j<=k));$(el,'[data-o=d]').innerHTML='<b>'+(k+1)+' '+(k?'stelle':'stella')+' · '+esc(L[k][0])+'</b><br>Esempio: '+esc(L[k][1])+'<br>'+esc(L[k][2])});
};

/* 8. Classificazione a clic: scegli una scheda, poi il contenitore */
S.classifica=el=>{
 const cfg=JSON.parse(el.dataset.cfg);
 el.innerHTML='<p class="small" style="margin:0 0 8px;font-size:17px">Tocca una scheda, poi il contenitore giusto. Alla fine premi «Controlla».</p><div class="chips" data-o="pool"></div><div class="bins" style="grid-template-columns:repeat('+cfg.bins.length+',1fr);margin-top:12px">'+cfg.bins.map((b,k)=>'<div class="bin" tabindex="0" data-b="'+k+'"><h4>'+esc(b)+'</h4><div class="chips"></div></div>').join('')+'</div><div class="row" style="margin-top:10px"><button class="btn gold" data-a="chk">Controlla</button><button class="btn ghost" data-a="rst">Ricomincia</button><span class="out" data-o="o"></span></div>';
 const pool=$(el,'[data-o=pool]');let sel=null;
 const reset=()=>{pool.innerHTML='';$$(el,'.bin .chips').forEach(c=>c.innerHTML='');cfg.items.forEach(([t,b])=>{const c=document.createElement('button');c.className='chip';c.textContent=t;c.dataset.ok=b;pool.append(c)});$(el,'[data-o=o]').textContent=''};
 el.addEventListener('click',e=>{const c=e.target.closest('.chip'),bin=e.target.closest('.bin');
  if(bin&&sel&&c!==sel){bin.querySelector('.chips').append(sel);sel.classList.remove('sel');sel=null;return}
  if(c&&el.contains(c)&&c.dataset.ok!==undefined){$$(el,'.chip.sel').forEach(x=>x.classList.remove('sel'));sel=c;c.classList.add('sel');c.classList.remove('ok','ko');return}
  if(bin&&sel){bin.querySelector('.chips').append(sel);sel.classList.remove('sel');sel=null}});
 el.addEventListener('keydown',e=>{const bin=e.target.closest('.bin');if(bin&&(e.key==='Enter'||e.key===' ')&&sel){e.preventDefault();bin.querySelector('.chips').append(sel);sel.classList.remove('sel');sel=null}});
 $(el,'[data-a=chk]').onclick=()=>{let ok=0,n=0;$$(el,'.bin').forEach(b=>$$(b,'.chip').forEach(c=>{n++;const g=c.dataset.ok===b.dataset.b;c.classList.toggle('ok',g);c.classList.toggle('ko',!g);if(g)ok++}));const left=$$(pool,'.chip').length;$(el,'[data-o=o]').textContent=ok+' su '+cfg.items.length+' corrette'+(left?' · '+left+' ancora da collocare':ok===cfg.items.length?' — ottimo!':' — riguardiamo le arancioni.')};
 $(el,'[data-a=rst]').onclick=reset;reset();
};

/* 9. Antivirus: firme e analisi del comportamento */
S.antivirus=el=>{
 const F=[['foto_vetrina.jpg','pulito','Nessuna corrispondenza con le firme note.'],['fattura_marzo.pdf.exe','comportamento','Doppia estensione: si finge un PDF ma è un programma eseguibile.'],['listino_2026.xlsx','pulito','Nessuna macro, nessuna firma nota.'],['ordine_cliente.docm','comportamento','Contiene una macro che scarica file da Internet all’apertura.'],['aggiornamento_flash.exe','firma','L’impronta del file coincide con un malware già catalogato.']];
 el.innerHTML='<div class="row" style="justify-content:space-between"><h3>Cartella «Download»</h3><div class="row"><button class="btn gold" data-a="scan">🔍 Avvia la scansione</button><button class="btn ghost" data-a="rst">Ricomincia</button></div></div><div class="meter" style="margin:10px 0"><span data-o="p" style="background:#176b87"></span></div><table class="rules"><thead><tr><th>File</th><th>Esito</th><th>Perché</th></tr></thead><tbody>'+F.map(f=>'<tr><td><code>'+esc(f[0])+'</code></td><td class="r">—</td><td class="w" style="font-size:15px">—</td></tr>').join('')+'</tbody></table><p class="out" data-o="o" style="margin-top:8px"></p>';
 let t=[];const rows=$$(el,'tbody tr');
 const rst=()=>{t.forEach(clearTimeout);t=[];$(el,'[data-o=p]').style.width='0';rows.forEach(r=>{r.querySelector('.r').textContent='—';r.querySelector('.w').textContent='—'});$(el,'[data-o=o]').textContent=''};
 $(el,'[data-a=scan]').onclick=()=>{rst();F.forEach((f,k)=>t.push(setTimeout(()=>{$(el,'[data-o=p]').style.width=((k+1)/F.length*100)+'%';const r=rows[k];r.querySelector('.r').innerHTML=f[1]==='pulito'?'<span class="tag ok">Pulito</span>':f[1]==='firma'?'<span class="tag ko">Malware (firma)</span>':'<span class="tag wait">Sospetto → quarantena</span>';r.querySelector('.w').textContent=f[2];if(k===F.length-1)$(el,'[data-o=o]').textContent='Trovate 3 minacce su 5 file: 1 per firma, 2 per comportamento sospetto. Nessun antivirus garantisce il 100%.'},(k+1)*(reduced?150:700))))};
 $(el,'[data-a=rst]').onclick=rst;
};

/* 10. Firewall: regole e pacchetti */
S.firewall=el=>{
 const R=[['Uscita','Navigazione web HTTPS (porta 443)','Consenti'],['Uscita','Risoluzione nomi DNS (porta 53)','Consenti'],['Entrata','Desktop remoto da Internet (porta 3389)','Blocca'],['Entrata','Condivisione file da Internet (porta 445)','Blocca'],['Entrata','Risposta a una pagina che hai richiesto','Consenti']];
 const P=[[0,'→ HTTPS 443','Uscita'],[4,'← risposta del sito','Entrata'],[2,'← RDP 3389 da IP sconosciuto','Entrata'],[1,'→ DNS 53','Uscita'],[3,'← SMB 445 da Internet','Entrata']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:16px"><div><h3>Regole del firewall</h3><table class="rules"><thead><tr><th>Dir.</th><th>Traffico</th><th>Azione</th></tr></thead><tbody>${R.map((r,k)=>'<tr><td>'+r[0]+'</td><td style="font-size:15px">'+r[1]+'</td><td><select data-k="'+k+'"><option>Consenti</option><option>Blocca</option></select></td></tr>').join('')}</tbody></table><p class="small muted" style="font-size:15px;margin-top:6px">Tutto ciò che non è previsto viene bloccato (regola predefinita).</p></div>
 <div><div class="net" data-o="net"><div class="node" style="left:8px"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#e9f3f8" stroke="#176b87" stroke-width="3"/><path d="M6 32h52M32 6c10 10 10 42 0 52M32 6c-10 10-10 42 0 52" stroke="#176b87" stroke-width="3" fill="none"/></svg>Internet</div><div class="wall" title="Firewall"></div><div class="node" style="right:8px"><svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="32" rx="4" fill="#e9f3f8" stroke="#102a43" stroke-width="3"/><path d="M20 54h24M32 44v10" stroke="#102a43" stroke-width="3"/></svg>Il tuo PC</div></div>
 <div class="row" style="margin:8px 0"><button class="btn gold" data-a="go">▶ Invia il traffico</button></div><div class="log" data-o="log" aria-live="polite"></div></div></div>`;
 $$(el,'select').forEach((s,k)=>s.value=R[k][2]);
 const net=$(el,'[data-o=net]'),log=$(el,'[data-o=log]');let busy=false;
 $(el,'[data-a=go]').onclick=()=>{if(busy)return;busy=true;log.textContent='';const W=net.clientWidth;
  P.forEach(([k,lab,dir],n)=>setTimeout(()=>{const allow=$$(el,'select')[k].value==='Consenti';const p=document.createElement('div');p.className='pkt';p.textContent=lab;net.append(p);const pw=p.offsetWidth;const inbound=dir==='Entrata';
   const start=inbound?120:W-120-pw,wall=inbound?W/2-pw-14:W/2+14,end=inbound?W-120-pw:120;p.style.left=start+'px';p.style.top=(30+n*42)+'px';p.style.marginTop='0';
   requestAnimationFrame(()=>requestAnimationFrame(()=>{p.style.left=(allow?end:wall)+'px'}));
   setTimeout(()=>{p.classList.add(allow?'ok':'blocked');log.textContent+=new Date().toLocaleTimeString('it-IT')+'  '+(allow?'CONSENTITO':'BLOCCATO ')+'  '+dir.toUpperCase()+'  '+R[k][1]+'\n';log.scrollTop=1e4},reduced?100:1650);
   setTimeout(()=>{p.style.opacity='0';setTimeout(()=>p.remove(),400)},reduced?900:3200);if(n===P.length-1)setTimeout(()=>busy=false,reduced?1000:3400)},n*(reduced?120:700)))};
};

/* 11. VPN: chi vede che cosa */
S.vpn=el=>{
 el.innerHTML=`<div class="row" style="justify-content:space-between"><h3>Sei al bar, sul Wi-Fi gratuito, e apri il sito della banca</h3><button class="btn" data-a="v" aria-pressed="false">🔒 VPN: spenta</button></div>
 <div class="net" data-o="net" style="height:330px;margin-top:8px"><div class="tunnel"></div>
  <div class="node" style="left:8px;top:32%"><svg viewBox="0 0 64 64"><rect x="16" y="6" width="32" height="52" rx="6" fill="#e9f3f8" stroke="#102a43" stroke-width="3"/><circle cx="32" cy="50" r="3" fill="#102a43"/></svg>Il tuo telefono</div>
  <div class="node" style="left:34%;top:32%"><svg viewBox="0 0 64 64"><path d="M10 26a32 32 0 0 1 44 0M18 34a20 20 0 0 1 28 0M26 42a8 8 0 0 1 12 0" stroke="#d9822b" stroke-width="4" fill="none"/><circle cx="32" cy="50" r="4" fill="#d9822b"/></svg>Wi-Fi del bar</div>
  <div class="node" style="left:58%;top:32%" data-o="vnode"><svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="36" rx="6" fill="#f3e9f8" stroke="#7a3e9d" stroke-width="3"/><text x="32" y="38" text-anchor="middle" font-size="13" font-weight="800" fill="#7a3e9d">VPN</text></svg>Server VPN</div>
  <div class="node" style="right:8px;top:32%"><svg viewBox="0 0 64 64"><path d="M8 26 32 10l24 16v4H8z" fill="#e9f3f8" stroke="#102a43" stroke-width="3"/><path d="M14 32v18M26 32v18M38 32v18M50 32v18M8 54h48" stroke="#102a43" stroke-width="3"/></svg>Sito della banca</div>
  <div class="eye" style="left:10px" data-o="e1"></div><div class="eye" style="left:calc(50% - 125px)" data-o="e2"></div><div class="eye" style="right:10px" data-o="e3"></div></div>
 <p class="out" data-o="o" style="margin-top:8px"></p>`;
 const net=$(el,'[data-o=net]'),b=$(el,'[data-a=v]');let on=false;
 const draw=()=>{net.classList.toggle('vpn-on',on);$(el,'[data-o=vnode]').style.opacity=on?1:.25;b.setAttribute('aria-pressed',on);b.textContent=on?'🔒 VPN: accesa':'🔓 VPN: spenta';
  $(el,'[data-o=e1]').innerHTML='<b>Gestore del Wi-Fi vede</b><br>'+(on?'solo che parli con un server VPN; il contenuto è cifrato.':'il nome del sito (banca.it) e quando ti colleghi. Il contenuto è comunque cifrato da HTTPS.');
  $(el,'[data-o=e2]').innerHTML='<b>Il provider VPN vede</b><br>'+(on?'i siti che visiti: devi fidarti di lui.':'— (non coinvolto)');
  $(el,'[data-o=e3]').innerHTML='<b>La banca vede</b><br>'+(on?'l’indirizzo IP della VPN, ma tu fai il login: sa chi sei.':'il tuo indirizzo IP e, dopo il login, chi sei.');
  $(el,'[data-o=o]').textContent=on?'La VPN sposta la fiducia dal Wi-Fi al provider VPN. Non ti rende anonimo e non ferma phishing o malware.':'Senza VPN: HTTPS protegge password e dati, ma la rete vede quali siti visiti.'};
 b.onclick=()=>{on=!on;draw()};draw();
};

/* 12. Robustezza della password (calcolo solo locale) */
S.password=el=>{
 const common=['password','123456','12345678','qwerty','admin','ciao','amore','napoli','juventus','inter','milan','roma','password1','111111','iloveyou','forzanapoli','123456789','abc123','qwerty123','ciao123'];
 const W=['mela','treno','vetrina','sabbia','nuvola','faro','pesce','matita','limone','cortile','zaino','lampada','giardino','tamburo','ferro','vela','fragola','ponte','gatto','tazza','bosco','cometa','scala','orologio','pepe','ruota','fiume','biscotto','quadro','sedia','vulcano','marmo'];
 el.innerHTML=`<label for="pw-${Math.random().toString(36).slice(2)}" class="small" style="font-size:17px">Scrivi una password di prova (non usarne una vera: il calcolo avviene solo su questo computer)</label><input class="pw-in" type="text" autocomplete="off" spellcheck="false" placeholder="es. Napoli2026!"><div class="meter" style="height:20px;margin:10px 0"><span data-o="m"></span></div><div class="row" style="justify-content:space-between"><span class="out" data-o="o">—</span><span data-o="t" class="tag">—</span></div><ul class="checks" data-o="c"></ul><div class="row"><button class="btn gold" data-a="gen">🎲 Genera come un password manager</button><span class="small muted" style="font-size:16px">Stima indicativa basata su lunghezza, tipi di caratteri e parole note.</span></div>`;
 const inp=$(el,'.pw-in'),lab=el.querySelector('label');lab.htmlFor=inp.id='pw-'+Math.random().toString(36).slice(2);
 const calc=()=>{const p=inp.value;const low=/[a-z]/.test(p),up=/[A-Z]/.test(p),dig=/\d/.test(p),sym=/[^A-Za-z0-9]/.test(p);const pool=(low?26:0)+(up?26:0)+(dig?10:0)+(sym?33:0);let bits=p.length*Math.log2(pool||1);
  const lc=p.toLowerCase();const isCommon=common.includes(lc.replace(/[^a-z0-9]/g,''))||common.some(c=>c.length>4&&lc.includes(c));const seq=/(0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf)/i.test(p);const words=p.split(/[\s\-_.]+/).filter(x=>W.includes(x.toLowerCase())).length;
  if(isCommon)bits=Math.min(bits,common.includes(lc.replace(/[^a-z0-9]/g,''))?10:28);if(words>=2)bits=Math.min(bits,words*Math.log2(W.length)+12);if(seq)bits-=10;if(/(.)\1\1/.test(p))bits-=6;bits=Math.max(0,bits);
  const secs=Math.pow(2,bits)/2/1e10;const t=secs<1?'meno di un secondo':secs<3600?Math.round(secs/60)+' minuti':secs<86400*2?Math.round(secs/3600)+' ore':secs<86400*365*2?Math.round(secs/86400)+' giorni':secs<3.15e7*1e6?fmt(secs/3.15e7)+' anni':'più di un milione di anni';
  const lv=bits<35?['Molto debole','#c0392b',15]:bits<50?['Debole','#d9822b',35]:bits<65?['Discreta','#c9a227',60]:bits<80?['Forte','#2a9d8f',82]:['Molto forte','#145d53',100];
  const m=$(el,'[data-o=m]');m.style.width=(p?lv[2]:0)+'%';m.style.background=lv[1];$(el,'[data-o=o]').textContent=p?lv[0]+' · circa '+Math.round(bits)+' bit':'—';$(el,'[data-o=t]').textContent=p?'Tempo stimato per indovinarla: '+t:'—';
  $(el,'[data-o=c]').innerHTML=[[p.length>=12,'Almeno 12 caratteri'],[low&&up,'Maiuscole e minuscole'],[dig,'Numeri'],[sym,'Simboli o spazi'],[!isCommon,'Non è tra le più usate'],[!seq,'Nessuna sequenza (1234, qwer)']].map(([o,t])=>'<li class="'+(o?'ok':'')+'">'+t+'</li>').join('')};
 inp.addEventListener('input',calc);$(el,'[data-a=gen]').onclick=()=>{const cs='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!#$%&*+-=?@';const a=new Uint32Array(16);crypto.getRandomValues(a);inp.value=[...a].map(x=>cs[x%cs.length]).join('');calc()};calc();
};

/* 13. Cifrario di Cesare e attacco a forza bruta */
S.cesare=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div><label class="small" style="font-size:17px">Messaggio in chiaro<input data-o="m" value="ORDINE DI 20 MAGLIETTE" style="width:100%;font-family:ui-monospace,Consolas,monospace;font-size:20px;padding:6px 10px;margin-top:4px"></label>
 <label class="sl" style="grid-template-columns:110px 1fr 40px;margin-top:10px"><span>Chiave</span><input type="range" min="1" max="25" value="3" data-o="k"><b data-o="kv">3</b></label>
 <p style="margin:8px 0 4px"><b>Messaggio cifrato</b></p><div class="mini-doc" data-o="c" style="min-height:0;font-family:ui-monospace,Consolas,monospace;font-size:22px;letter-spacing:.06em"></div>
 <p class="small" style="font-size:16px;margin-top:8px">Il cifrario di Cesare ha solo 25 chiavi: un computer le prova tutte in un istante. Gli algoritmi moderni (es. AES-256) hanno 2<sup>256</sup> chiavi possibili.</p></div>
 <div><div class="row" style="justify-content:space-between"><b>Attacco a forza bruta</b><button class="btn gold" data-a="bf">Prova tutte le chiavi</button></div><div class="log" data-o="bf" style="height:330px;margin-top:6px;white-space:pre"></div></div></div>`;
 const enc=(s,k)=>s.toUpperCase().replace(/[A-Z]/g,c=>String.fromCharCode((c.charCodeAt(0)-65+k)%26+65));
 const draw=()=>{const k=+$(el,'[data-o=k]').value;$(el,'[data-o=kv]').textContent=k;$(el,'[data-o=c]').textContent=enc($(el,'[data-o=m]').value,k)};
 $(el,'[data-o=k]').oninput=draw;$(el,'[data-o=m]').oninput=draw;
 $(el,'[data-a=bf]').onclick=()=>{const c=$(el,'[data-o=c]').textContent;const k0=+$(el,'[data-o=k]').value;$(el,'[data-o=bf]').textContent=Array.from({length:25},(_,j)=>{const k=j+1;return 'chiave '+String(k).padStart(2,' ')+': '+enc(c,26-k)+(k===k0?'   ← trovato!':'')}).join('\n')};draw();
};

/* 14. Backup: che cosa si salva in caso di incidente */
S.backup=el=>{
 const ST=[['sync','Cartella sincronizzata nel cloud (senza versioni)'],['usb','Chiavetta USB sempre collegata al PC'],['ext','Disco esterno, collegato solo durante il backup e tenuto in un altro luogo'],['ver','Backup in cloud con versioni (conserva 90 giorni)']];
 const EV=[['ransom','Ransomware cifra i file del PC',{sync:0,usb:0,ext:1,ver:1},'La sincronizzazione copia nel cloud anche i file cifrati; la chiavetta collegata viene cifrata con il PC.'],['furto','Furto del portatile con la chiavetta in borsa',{sync:1,usb:0,ext:1,ver:1},'Quello che è fisicamente con il PC si perde con il PC.'],['del','Cancelli per errore una cartella e te ne accorgi dopo 2 mesi',{sync:0,usb:0,ext:1,ver:1},'La sincronizzazione propaga la cancellazione; il backup a versioni conserva le copie precedenti (il disco esterno solo se non l’hai sovrascritto).'],['guasto','Si rompe il disco del PC',{sync:1,usb:1,ext:1,ver:1},'Qualsiasi copia fuori dal disco guasto salva i dati.'],['incendio','Allagamento o incendio del laboratorio',{sync:1,usb:0,ext:1,ver:1},'Serve una copia fuori sede.']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div><h3>1 · Le tue protezioni</h3>${ST.map(s=>'<label style="display:flex;gap:8px;font-size:17px;margin:0 0 6px"><input type="checkbox" value="'+s[0]+'">'+s[1]+'</label>').join('')}
 <h3 style="margin-top:10px">2 · Che cosa succede?</h3><select data-o="e" style="width:100%">${EV.map((e,k)=>'<option value="'+k+'">'+e[1]+'</option>').join('')}</select></div>
 <div><h3>Esito</h3><div data-o="r" style="font-size:18px"></div></div></div>`;
 const draw=()=>{const on=$$(el,'input:checked').map(i=>i.value);const e=EV[+$(el,'[data-o=e]').value];const saved=on.filter(s=>e[2][s]);
  $(el,'[data-o=r]').innerHTML=(on.length?ST.filter(s=>on.includes(s[0])).map(s=>'<div style="margin:0 0 6px">'+(e[2][s[0]]?'<span class="tag ok">Salva i dati</span> ':'<span class="tag ko">Perduto</span> ')+esc(s[1])+'</div>').join(''):'<p><span class="tag ko">Nessuna copia</span></p>')+'<p class="s-box '+(saved.length?'teal':'orange')+'" style="font-size:18px;margin-top:10px">'+(saved.length?'<b>Dati recuperati.</b> ':'<b>Dati persi.</b> ')+esc(e[3])+'</p>'};
 el.addEventListener('change',draw);draw();
};

/* 15. Navigazione: chi vede che cosa */
S.incognito=el=>{
 const M=[['Normale',0,0],['In incognito',1,0],['Con VPN',0,1],['Incognito + VPN',1,1]];
 const O=[['Chi usa dopo di te lo stesso PC (cronologia, cookie)',(i,v)=>!i],['I siti, se fai il login',()=>true],['I siti, tramite il tuo indirizzo IP',(i,v)=>!v],['Il gestore della rete (Wi-Fi, ufficio, provider)',(i,v)=>!v],['Il fornitore della VPN',(i,v)=>v],['File scaricati e preferiti salvati',()=>true]];
 el.innerHTML='<div class="row" data-o="m">'+M.map((m,k)=>'<button class="btn ghost" data-k="'+k+'" aria-pressed="'+(k===1)+'">'+m[0]+'</button>').join('')+'</div><table class="rules" style="margin-top:12px;font-size:18px"><thead><tr><th>Chi o che cosa</th><th>Vede o resta traccia?</th></tr></thead><tbody data-o="b"></tbody></table><p class="out" data-o="o" style="margin-top:8px"></p>';
 let cur=1;const draw=()=>{const [,i,v]=M[cur];$$(el,'[data-k]').forEach((b,k)=>b.setAttribute('aria-pressed',k===cur));$(el,'[data-o=b]').innerHTML=O.map(o=>'<tr><td>'+o[0]+'</td><td>'+(o[1](i,v)?'<span class="tag ko">Sì</span>':'<span class="tag ok">No</span>')+'</td></tr>').join('');$(el,'[data-o=o]').textContent=cur===1?'L’incognito protegge solo da chi usa il tuo stesso dispositivo dopo di te.':cur===3?'Anche insieme non rendono anonimi: il login e il provider VPN restano.':''};
 $(el,'[data-o=m]').onclick=e=>{const b=e.target.closest('[data-k]');if(b){cur=+b.dataset.k;draw()}};draw();
};

/* 16. Banner dei cookie */
S.cookie=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:18px"><div style="position:relative;height:330px;border:1px solid var(--line);border-radius:12px;background:#f3f7fb;overflow:hidden"><div style="padding:14px 18px;font-size:16px"><b style="font-size:20px">Stampa&Co — negozio online</b><p>Magliette, tazze e gadget personalizzati.</p></div>
 <div data-o="ban" style="position:absolute;left:12px;right:12px;bottom:12px;background:#fff;border-radius:12px;box-shadow:0 6px 24px #0003;padding:12px 14px;font-size:15px"><button data-a="x" class="btn ghost" style="position:absolute;right:8px;top:6px;padding:2px 8px" aria-label="Chiudi">✕</button><b>Questo sito usa cookie</b><p style="margin:4px 0 8px">Tecnici, necessari al carrello; e, con il tuo consenso, di statistica e di profilazione pubblicitaria.</p><div class="row"><button class="btn" data-a="all">Accetta tutti</button><button class="btn" data-a="none">Rifiuta</button><button class="btn ghost" data-a="cust">Personalizza</button></div><div data-o="cust" hidden style="margin-top:8px"><label><input type="checkbox" checked disabled> Tecnici (sempre attivi)</label><br><label><input type="checkbox" data-c="stat"> Statistica</label><br><label><input type="checkbox" data-c="prof"> Profilazione pubblicitaria</label><br><button class="btn gold" data-a="save" style="margin-top:6px">Salva le scelte</button></div></div></div>
 <div><h3>Cookie installati</h3><div data-o="r" style="font-size:18px"></div><p class="small muted" style="font-size:15px;margin-top:10px">Regola utile (Garante privacy, linee guida 2021): rifiutare deve essere facile come accettare; chiudere il banner con la X equivale a rifiutare i cookie non tecnici.</p><button class="btn ghost" data-a="rst">Ricomincia</button></div></div>`;
 const r=$(el,'[data-o=r]'),ban=$(el,'[data-o=ban]');
 const set=(s,p,how)=>{ban.hidden=true;r.innerHTML='<div><span class="tag ok">Sì</span> Tecnici (carrello, lingua)</div><div style="margin-top:6px">'+(s?'<span class="tag wait">Sì</span>':'<span class="tag ok">No</span>')+' Statistica</div><div style="margin-top:6px">'+(p?'<span class="tag ko">Sì</span>':'<span class="tag ok">No</span>')+' Profilazione pubblicitaria</div><p style="margin-top:10px"><b>'+how+'</b></p>'};
 el.addEventListener('click',e=>{const a=e.target.closest('[data-a]')?.dataset.a;if(!a)return;
  if(a==='all')set(1,1,'Hai accettato tutto: il sito e i partner possono profilarti.');if(a==='none')set(0,0,'Hai rifiutato: restano solo i cookie tecnici.');if(a==='x')set(0,0,'Chiudere con la X equivale a rifiutare.');
  if(a==='cust')$(el,'[data-o=cust]').hidden=false;if(a==='save')set($(el,'[data-c=stat]').checked,$(el,'[data-c=prof]').checked,'Scelte salvate: puoi cambiarle in ogni momento dal link «Preferenze cookie».');
  if(a==='rst'){ban.hidden=false;$(el,'[data-o=cust]').hidden=true;r.innerHTML='<p class="muted">Nessuna scelta ancora.</p>'}});
 r.innerHTML='<p class="muted">Nessuna scelta ancora.</p>';
};

/* 17. Imbuto di conversione */
S.funnel=el=>{
 const F=[['vis','Visitatori al mese',200,10000,3000,100,''],['cr','Tasso di conversione',0.2,6,1.5,0.1,' %'],['aov','Scontrino medio',5,150,35,1,' €'],['ads','Spesa pubblicitaria al mese',0,2000,300,10,' €']];
 el.innerHTML='<div style="display:grid;grid-template-columns:1fr 1.1fr;gap:20px"><div>'+F.map(f=>'<label class="sl" style="grid-template-columns:190px 1fr 86px"><span>'+f[1]+'</span><input type="range" data-f="'+f[0]+'" min="'+f[2]+'" max="'+f[3]+'" value="'+f[4]+'" step="'+f[5]+'"><b></b></label>').join('')+'<p class="small muted" style="font-size:15px;margin-top:8px">Tasso di conversione = ordini ÷ visitatori × 100. Va sempre detto su quale base è calcolato. Il carrello è stimato come 4 volte gli ordini (ipotesi didattica).</p></div><div data-o="f"></div></div>';
 const draw=()=>{const v={};$$(el,'[data-f]').forEach((i,k)=>{v[i.dataset.f]=+i.value;i.parentElement.querySelector('b').textContent=fmt(+i.value,F[k][0]==='cr'?1:0)+F[k][6]});
  const carts=v.vis*Math.min(1,v.cr*4/100),orders=v.vis*v.cr/100,rev=orders*v.aov,cpa=orders?v.ads/orders:0,roas=v.ads?rev/v.ads:0;
  const bar=(lab,n,w,c)=>'<div class="funnel-bar" style="width:'+w+'%;background:'+c+'">'+lab+': '+fmt(n)+'</div>';
  $(el,'[data-o=f]').innerHTML=bar('Visitatori',v.vis,100,'#102a43')+bar('Carrello (stima)',carts,Math.max(62,carts/v.vis*100),'#176b87')+bar('Ordini',orders,Math.max(40,orders/v.vis*100),'#2a9d8f')+'<div class="s-grid c3" style="margin-top:12px"><div class="s-card gold" style="padding:10px 12px;font-size:17px"><b>Ricavi</b><br><span style="font-size:26px;font-weight:800">'+fmt(rev)+' €</span></div><div class="s-card orange" style="padding:10px 12px;font-size:17px"><b>Costo per ordine</b><br><span style="font-size:26px;font-weight:800">'+(orders?fmt(cpa,2)+' €':'—')+'</span></div><div class="s-card blue" style="padding:10px 12px;font-size:17px"><b>Ricavi ÷ pubblicità</b><br><span style="font-size:26px;font-weight:800">'+(v.ads?fmt(roas,1):'—')+'</span></div></div>'};
 el.addEventListener('input',draw);draw();
};

/* 18. Tasso di coinvolgimento di un post */
S.engagement=el=>{
 const F=[['like','Mi piace',120],['com','Commenti',14],['sha','Condivisioni',9],['sav','Salvataggi',22],['reach','Persone raggiunte (copertura)',2400]];
 el.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:center"><div>'+F.map(f=>'<label class="sl" style="grid-template-columns:230px 1fr"><span>'+f[1]+'</span><input type="number" min="0" value="'+f[2]+'" data-f="'+f[0]+'" style="padding:4px 8px"></label>').join('')+'</div><div style="text-align:center"><div style="font-size:18px">Tasso di coinvolgimento</div><div data-o="er" style="font-size:64px;font-weight:800;color:#102a43">—</div><div class="small muted" style="font-size:15px">(mi piace + commenti + condivisioni + salvataggi) ÷ copertura × 100</div><p class="out" data-o="o" style="margin-top:8px"></p></div></div>';
 const draw=()=>{const v={};$$(el,'[data-f]').forEach(i=>v[i.dataset.f]=Math.max(0,+i.value||0));const inter=v.like+v.com+v.sha+v.sav;const er=v.reach?inter/v.reach*100:0;$(el,'[data-o=er]').textContent=v.reach?fmt(er,1)+' %':'—';$(el,'[data-o=o]').textContent=v.reach?(v.com+v.sha>v.like/4?'Molti commenti e condivisioni: il contenuto genera conversazione.':'Interazioni soprattutto passive: prova una domanda o una call to action.'):'Inserisci la copertura.'};
 el.addEventListener('input',draw);draw();
};


/* 34. Mercato potenziale dai dati demografici */
S.mercato=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.2fr 1fr;gap:18px"><div>
 <label class="sl" style="grid-template-columns:250px 1fr 90px"><span>Residenti del comune (ISTAT)</span><input type="range" data-f="pop" min="1000" max="200000" step="500" value="38000"><b></b></label>
 <label class="sl" style="grid-template-columns:250px 1fr 90px"><span>Quota del vostro pubblico (%)</span><input type="range" data-f="q" min="1" max="60" value="18"><b></b></label>
 <label class="sl" style="grid-template-columns:250px 1fr 90px"><span>Quanti riuscite a raggiungere (%)</span><input type="range" data-f="r" min="1" max="30" value="5"><b></b></label>
 <label class="sl" style="grid-template-columns:250px 1fr 90px"><span>Spesa media a persona all’anno (€)</span><input type="range" data-f="s" min="10" max="1000" step="10" value="60"><b></b></label>
 <p class="small muted" style="font-size:14px;margin-top:4px">Esempio: stampa personalizzata per famiglie con figli a scuola. Dati: ISTAT, popolazione residente per comune ed età.</p></div>
 <div data-o="r" style="font-size:18px"></div></div>`;
 const draw=()=>{const v={};$$(el,'input').forEach(i=>{v[i.dataset.f]=+i.value;i.parentElement.querySelector('b').textContent=fmt(+i.value)+(i.dataset.f==='s'?' €':i.dataset.f==='pop'?'':' %')});
  const target=v.pop*v.q/100,cli=target*v.r/100,ric=cli*v.s;
  $(el,'[data-o=r]').innerHTML='<div class="flow" style="grid-template-columns:1fr;gap:6px"><div style="padding:8px 12px"><span class="n">1</span><b>'+fmt(v.pop)+' residenti</b></div><div style="padding:8px 12px"><span class="n">2</span><b>'+fmt(target)+' persone nel vostro pubblico</b></div><div style="padding:8px 12px"><span class="n">3</span><b>'+fmt(cli)+' clienti raggiungibili</b></div></div><div class="s-card gold" style="margin-top:8px;padding:8px;text-align:center"><b>Ricavi potenziali</b><br><span style="font-size:34px;font-weight:800">'+fmt(ric)+' € / anno</span></div><p class="small" style="margin-top:8px">'+(ric<15000?'Con un solo comune non basta: pensate ai comuni vicini o alla vendita online.':ric<40000?'Mercato sufficiente per una ditta individuale, se i costi restano bassi.':'Mercato ampio: la sfida sarà raggiungerlo davvero.')+'</p>'};
 el.addEventListener('input',draw);draw();
};

/* 35. Concorrenti: densità per 1.000 abitanti */
S.concorrenti=el=>{
 const B=[['Vostro comune',38000,9],['Comune vicino',21000,3],['Provincia',900000,260],['Regione',5600000,1700]];
 el.innerHTML=`<p style="font-size:17px;margin:0 0 8px">Imprese attive nel vostro settore (codice ATECO) dal Registro Imprese, e popolazione ISTAT. Modificate i numeri del vostro comune.</p>
 <table class="rules" style="font-size:17px"><thead><tr><th>Territorio</th><th>Abitanti</th><th>Imprese del settore</th><th>Ogni 1.000 abitanti</th><th>Abitanti per impresa</th></tr></thead><tbody>${B.map((b,k)=>'<tr><td>'+b[0]+'</td><td><input type="number" data-r="'+k+'" data-c="0" value="'+b[1]+'" style="width:110px" '+(k?'disabled':'')+'></td><td><input type="number" data-r="'+k+'" data-c="1" value="'+b[2]+'" style="width:90px" '+(k?'disabled':'')+'></td><td class="d"></td><td class="a"></td></tr>').join('')}</tbody></table>
 <p class="out" data-o="o" style="margin-top:10px;font-weight:400"></p>`;
 const draw=()=>{const rows=$$(el,'tbody tr');const d=rows.map(r=>{const p=+r.querySelector('[data-c="0"]').value||0,n=+r.querySelector('[data-c="1"]').value||0;const dd=p?n/p*1000:0;r.querySelector('.d').textContent=fmt(dd,2);r.querySelector('.a').textContent=n?fmt(p/n):'—';return dd});
  const mine=d[0],ref=d[2];$(el,'[data-o=o]').innerHTML=mine>ref*1.3?'<span class="tag ko">Zona affollata</span> Nel vostro comune ci sono più imprese per abitante che in provincia: serve un’offerta diversa dai concorrenti.':mine<ref*0.7?'<span class="tag ok">C’è spazio</span> Meno imprese per abitante rispetto alla provincia: la domanda potrebbe non essere coperta.':'<span class="tag wait">Nella media</span> Densità simile a quella provinciale: contano qualità e prezzo.'};
 el.addEventListener('input',draw);draw();
};

/* 36. Affitto del locale con le quotazioni OMI */
S.affitto=el=>{
 const Z=[['Centrale',8.5,10.5],['Semicentrale',6,7.8],['Periferica',4,5.5],['Zona industriale / artigianale',3,4.2]];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div>
 <label class="sl" style="grid-template-columns:150px 1fr"><span>Zona OMI</span><select data-f="z">${Z.map((z,k)=>'<option value="'+k+'">'+z[0]+' · '+z[1]+'–'+z[2]+' €/m²/mese</option>').join('')}</select></label>
 <label class="sl" style="grid-template-columns:150px 1fr 70px"><span>Superficie (m²)</span><input type="range" data-f="mq" min="20" max="300" step="5" value="45"><b></b></label>
 <label class="sl" style="grid-template-columns:150px 1fr 70px"><span>Ricavi mensili attesi (€)</span><input type="range" data-f="ric" min="500" max="20000" step="100" value="3500"><b></b></label>
 <p class="small muted" style="font-size:15px">Quotazioni di esempio nello stile dell’Osservatorio del mercato immobiliare (Agenzia delle Entrate): per il vostro comune cercate «OMI quotazioni» e scegliete la zona e la destinazione «negozi» o «laboratori».</p></div>
 <div data-o="r" style="font-size:18px"></div></div>`;
 const draw=()=>{const z=Z[+$(el,'[data-f=z]').value],mq=+$(el,'[data-f=mq]').value,ric=+$(el,'[data-f=ric]').value;$$(el,'input').forEach(i=>i.parentElement.querySelector('b').textContent=fmt(+i.value));
  const lo=z[1]*mq,hi=z[2]*mq,pct=(lo+hi)/2/ric*100;
  $(el,'[data-o=r]').innerHTML='<div class="s-card blue" style="text-align:center"><b>Canone stimato</b><br><span style="font-size:30px;font-weight:800">'+fmt(lo)+' – '+fmt(hi)+' € / mese</span><br>'+fmt(lo*12)+' – '+fmt(hi*12)+' € all’anno</div><div class="meter" style="margin:12px 0;height:20px"><span style="width:'+Math.min(100,pct)+'%;background:'+(pct>25?'#c0392b':pct>15?'#d9822b':'#2a9d8f')+'"></span></div><p>L’affitto pesa per il <b>'+fmt(pct,1)+' %</b> dei ricavi. '+(pct>25?'Troppo: cercate una zona meno cara o un locale più piccolo.':pct>15?'Sostenibile, ma con margini stretti.':'Peso contenuto.')+'</p><p class="small">Ricordate: l’affitto non è una spesa ammissibile al voucher o al contributo.</p>'};
 el.addEventListener('input',draw);el.addEventListener('change',draw);draw();
};

/* 37. Scheda del dataset e citazione */
S.citazione=el=>{
 const F=[['ente','Ente che pubblica','ISTAT'],['tit','Titolo del dataset','Popolazione residente per età e comune'],['anno','Anno di riferimento','2025'],['agg','Data di aggiornamento','2026-03-15'],['lic','Licenza','CC BY 4.0'],['url','Indirizzo web','https://demo.istat.it'],['unita','Unità di misura','persone']];
 el.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div>'+F.map(f=>'<label class="sl" style="grid-template-columns:160px 1fr"><span>'+f[1]+'</span><input data-f="'+f[0]+'" placeholder="'+f[2]+'"></label>').join('')+'<p class="small muted" style="font-size:15px">Compilate i campi: la citazione si scrive da sola.</p></div><div><b>Scheda compilata</b><div class="meter" style="margin:6px 0"><span data-o="m" style="background:#2a9d8f"></span></div><b style="display:block;margin-top:10px">Citazione pronta per il piano d’impresa</b><div class="mini-doc" data-o="c" style="min-height:0;white-space:normal;font-size:17px"></div><p class="out" data-o="o" style="font-weight:400;margin-top:8px"></p></div></div>';
 const draw=()=>{const v={};let n=0;$$(el,'input').forEach(i=>{v[i.dataset.f]=i.value.trim();if(i.value.trim())n++});$(el,'[data-o=m]').style.width=n/F.length*100+'%';
  $(el,'[data-o=c]').textContent=(v.ente||'[ente]')+', «'+(v.tit||'[titolo]')+'», dati '+(v.anno||'[anno]')+', aggiornamento '+(v.agg||'[data]')+', licenza '+(v.lic||'[licenza]')+', '+(v.url||'[url]')+' (consultato il '+new Date().toLocaleDateString('it-IT')+').';
  $(el,'[data-o=o]').textContent=n===F.length?'Completa: chi legge il piano può verificare il dato in un minuto.':!v.lic?'Senza licenza non sapete se potete riutilizzare il dato.':!v.agg&&!v.anno?'Senza data il dato potrebbe essere vecchio.':'Mancano '+(F.length-n)+' campi.'};
 el.addEventListener('input',draw);draw();
};

/* 38. Pulisci i dati */
S.pulizia=el=>{
 const R=[['Maddaloni','38.120','2025','ok'],['MADDALONI','38120','2025','dup','Doppione: stessa riga scritta diversamente'],['Caserta','n.d.','2025','nd','Valore mancante scritto come testo: nei calcoli dà errore'],['Marcianise','39,45','2025','fmt','Numero con la virgola decimale: è un dato di migliaia? Verificare l’unità'],['S. Maria C.V.','31 800','2025','sp','Spazio nel numero: il foglio lo legge come testo'],['Capua','17.900','2O25','typo','Anno con la lettera O al posto dello zero'],['Aversa','52.300','2025','ok']];
 el.innerHTML='<p style="font-size:17px;margin:0 0 8px">Un dataset scaricato ha spesso qualche riga da sistemare. Cliccate le righe che vi sembrano sbagliate.</p><table class="rules" style="font-size:17px"><thead><tr><th>Comune</th><th>Residenti</th><th>Anno</th><th>Problema</th></tr></thead><tbody>'+R.map((r,k)=>'<tr data-k="'+k+'" style="cursor:pointer"><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+r[2]+'</td><td class="p" style="font-size:15px"></td></tr>').join('')+'</tbody></table><p class="out" data-o="o" style="margin-top:8px"></p>';
 let found=0;const bad=R.filter(r=>r[3]!=='ok').length;
 $(el,'tbody').onclick=e=>{const tr=e.target.closest('tr');if(!tr||tr.dataset.done)return;tr.dataset.done=1;const r=R[+tr.dataset.k];if(r[3]==='ok'){tr.querySelector('.p').innerHTML='<span class="tag ok">Riga corretta</span>'}else{found++;tr.style.background='#fde4d4';tr.querySelector('.p').innerHTML='<span class="tag ko">'+esc(r[4])+'</span>'}$(el,'[data-o=o]').textContent=found+' problemi trovati su '+bad+(found===bad?' — tutti! Pulire i dati prima di analizzarli è metà del lavoro.':'')};
};

/* 39. Quale grafico? */
S.grafico=el=>{
 const Q=[['Come sono cambiati i turisti a Caserta negli ultimi 10 anni?','linea','L’andamento nel tempo si legge con una linea.'],['Quante imprese ci sono in ciascuno dei 5 comuni vicini?','barre','Confronto tra categorie: barre.'],['Che quota dei residenti ha meno di 30 anni?','torta','Parti di un tutto, con poche fette: torta (o barra impilata).'],['Dove sono concentrati i concorrenti in provincia?','mappa','Un dato con una posizione si mostra su una mappa.'],['Spendono di più le famiglie con più figli?','dispersione','Relazione tra due numeri: grafico a dispersione (punti).'],['Qual è il numero esatto di residenti per età?','tabella','Se servono i numeri precisi, la tabella batte il grafico.']];
 const K=[['linea','📈 Linea'],['barre','📊 Barre'],['torta','🥧 Torta'],['mappa','🗺️ Mappa'],['dispersione','⚬ Dispersione'],['tabella','▦ Tabella']];let i=0,ok=0;
 el.innerHTML='<div class="row" style="justify-content:space-between"><span class="tag" data-o="n"></span><span data-o="s"></span></div><h3 data-o="q" style="margin:10px 0;min-height:50px"></h3><div class="row" data-o="b">'+K.map(k=>'<button class="btn ghost" data-k="'+k[0]+'" style="font-size:18px">'+k[1]+'</button>').join('')+'</div><p class="out" data-o="r" style="margin-top:10px;font-weight:400;min-height:50px"></p><button class="btn gold" data-a="n" hidden>Prossima →</button>';
 const show=()=>{if(i>=Q.length){$(el,'[data-o=q]').textContent='Fine: '+ok+' su '+Q.length+'.';$(el,'[data-o=b]').hidden=true;$(el,'[data-a=n]').hidden=true;return}$(el,'[data-o=n]').textContent='Domanda '+(i+1)+' di '+Q.length;$(el,'[data-o=s]').textContent=ok+' corrette';$(el,'[data-o=q]').textContent=Q[i][0];$(el,'[data-o=r]').innerHTML='';$(el,'[data-a=n]').hidden=true;$$(el,'[data-k]').forEach(b=>b.disabled=false)};
 $(el,'[data-o=b]').onclick=e=>{const b=e.target.closest('[data-k]');if(!b||b.disabled)return;const g=b.dataset.k===Q[i][1];if(g)ok++;$$(el,'[data-k]').forEach(x=>x.disabled=true);$(el,'[data-o=r]').innerHTML=(g?'<span class="tag ok">Giusto</span> ':'<span class="tag ko">Meglio: '+K.find(k=>k[0]===Q[i][1])[1]+'</span> ')+esc(Q[i][2]);$(el,'[data-a=n]').hidden=false};
 $(el,'[data-a=n]').onclick=()=>{i++;show()};show();
};

/* 40. Trova i dataset per il tuo progetto */
S.dataset=el=>{
 const D={'Bar, ristorante, street food':[['Quante persone passano di qui?','Flussi pendolari e turistici: ISTAT (matrice pendolarismo), dati turistici regionali, orari trasporto pubblico (dati.gov.it)'],['Quanti concorrenti?','Imprese attive ATECO 56 per comune: Registro Imprese / Camera di Commercio'],['Quanto costa il locale?','Quotazioni OMI «negozi»: Agenzia delle Entrate'],['Eventi in zona?','Calendario eventi e mercati del Comune (open data o albo)']],
  'Negozio o laboratorio artigiano':[['Chi abita qui?','Popolazione per età e famiglie per comune: ISTAT'],['Quanto spendono?','Spesa media delle famiglie per regione: ISTAT «Spese per consumi»'],['Quanti concorrenti?','Imprese attive per ATECO: Registro Imprese'],['Dove aprire?','OMI + mappa dei servizi (scuole, uffici) del Comune']],
  'E-commerce / vendita online':[['Quanti comprano online?','ISTAT «Cittadini e ICT»: % di chi acquista online per regione ed età'],['Il settore cresce?','Dati Eurostat e-commerce; Osservatori Politecnico (report pubblici)'],['Quanto costa spedire?','Non open data: listini corrieri (da raccogliere)'],['Concorrenti online?','Registro Imprese ATECO 47.91']],
  'Servizi alla persona (estetica, fitness, cura)':[['Quante persone del mio target?','Popolazione per età e sesso: ISTAT'],['Quanti concorrenti?','ATECO 96.02 / 93.13 per comune: Registro Imprese'],['Reddito medio della zona?','Dichiarazioni per comune: MEF, Dipartimento Finanze (open data)'],['Dove?','OMI + mobilità']],
  'Turismo e ospitalità':[['Quanti turisti e per quanto?','Arrivi e presenze per comune: ISTAT e Regione Campania (open data)'],['Quando vengono?','Stagionalità mensile: stessi dataset'],['Quanti B&B ci sono già?','Elenco strutture ricettive regionale'],['Dove?','Attrattori, siti UNESCO, eventi: Comune e Regione']],
  'Agricoltura e trasformazione alimentare':[['Che cosa si produce qui?','Censimento agricoltura ISTAT; dati PAC (AGEA)'],['Mercati e prezzi?','ISMEA prezzi all’ingrosso (open data)'],['Concorrenti?','Registro Imprese ATECO 10'],['Clienti?','Ristoranti e negozi in zona: Registro Imprese ATECO 56 e 47']]};
 el.innerHTML='<label class="sl" style="grid-template-columns:150px 1fr"><span>Il vostro settore</span><select data-o="s">'+Object.keys(D).map(k=>'<option>'+k+'</option>').join('')+'</select></label><table class="rules" style="font-size:17px;margin-top:10px"><thead><tr><th style="width:36%">Domanda da farsi</th><th>Dove trovare il dato</th></tr></thead><tbody data-o="t"></tbody></table><p class="small muted" style="font-size:15px;margin-top:8px">Portali di partenza: dati.gov.it · istat.it (demo.istat.it, dati.istat.it) · dati.regione.campania.it · registroimprese.it · agenziaentrate.gov.it (OMI) · data.europa.eu</p>';
 const draw=()=>{$(el,'[data-o=t]').innerHTML=D[$(el,'[data-o=s]').value].map(r=>'<tr><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td></tr>').join('')};
 $(el,'[data-o=s]').onchange=draw;draw();
};

/* 41. Trend e proiezione */
S.trend=el=>{
 const Y=[2019,2021,2022,2023,2024,2025],V=[128,61,112,139,151,160];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:18px"><div><svg class="ig" data-o="g" viewBox="0 0 620 300" role="img" aria-label="Presenze turistiche per anno"></svg><p class="small muted" style="font-size:15px">Presenze turistiche in migliaia, dati di esempio (il 2020 è escluso). Fonte reale: ISTAT «Movimento dei clienti negli esercizi ricettivi».</p></div>
 <div><label class="sl" style="grid-template-columns:170px 1fr 60px"><span>Anni futuri</span><input type="range" data-f="n" min="1" max="5" value="2"><b>2</b></label><label style="font-size:16px"><input type="checkbox" data-f="x" checked> Escludi il 2021 (anno anomalo) dal calcolo</label><div data-o="r" style="margin-top:10px;font-size:18px"></div></div></div>`;
 const g=$(el,'[data-o=g]');
 const draw=()=>{const n=+$(el,'[data-f=n]').value;$(el,'label.sl b').textContent=n;const ex=$(el,'[data-f=x]').checked;const pts=Y.map((y,k)=>[y,V[k]]).filter(p=>!(ex&&p[0]===2021));
  const g1=pts[0][1],g2=pts[pts.length-1][1],yrs=pts[pts.length-1][0]-pts[0][0];const cagr=Math.pow(g2/g1,1/yrs)-1;const proj=[];for(let k=1;k<=n;k++)proj.push([2025+k,g2*Math.pow(1+cagr,k)]);
  const all=[...Y.map((y,k)=>[y,V[k]]),...proj];const max=Math.max(...all.map(p=>p[1]))*1.15,x0=2019,x1=2025+n;const X=y=>40+(y-x0)/(x1-x0)*560,Yy=v=>270-v/max*240;
  g.innerHTML='<line x1="40" y1="270" x2="600" y2="270" stroke="#9aa9b8"/>'+'<polyline fill="none" stroke="#176b87" stroke-width="3" points="'+Y.map((y,k)=>X(y)+','+Yy(V[k])).join(' ')+'"/>'+'<polyline fill="none" stroke="#d9822b" stroke-width="3" stroke-dasharray="7 5" points="'+[[2025,160],...proj].map(p=>X(p[0])+','+Yy(p[1])).join(' ')+'"/>'+all.map(p=>'<circle cx="'+X(p[0])+'" cy="'+Yy(p[1])+'" r="5" fill="'+(p[0]>2025?'#d9822b':'#176b87')+'"/><text x="'+X(p[0])+'" y="'+(Yy(p[1])-10)+'" text-anchor="middle" font-size="13" fill="#102a43">'+fmt(p[1])+'</text><text x="'+X(p[0])+'" y="290" text-anchor="middle" font-size="13" fill="#52657a">'+p[0]+'</text>').join('');
  $(el,'[data-o=r]').innerHTML='<div class="s-card gold" style="text-align:center"><b>Crescita media annua</b><br><span style="font-size:32px;font-weight:800">'+(cagr>=0?'+':'')+fmt(cagr*100,1)+' %</span></div><p style="margin-top:10px">Nel '+(2025+n)+': circa <b>'+fmt(proj[n-1][1])+' mila</b> presenze, se la tendenza continua.</p><p class="small">'+(ex?'Senza il 2021 la stima è più realistica.':'Con il 2021 dentro, la crescita sembra enorme: è l’effetto del rimbalzo dopo l’anno anomalo.')+' Una proiezione è un’ipotesi, non una promessa: nel piano d’impresa scrivete sempre da quali anni l’avete calcolata.</p>'};
 el.addEventListener('input',draw);draw();
};

/* 42. Scegli la zona: mappa con i dati */
S.zona=el=>{
 const Z=[['Centro storico',{pop:6500,conc:5,aff:9.5,pass:9},'#176b87',60,70],['Stazione',{pop:9000,conc:3,aff:7,pass:8},'#2a9d8f',320,70],['Quartiere nuovo',{pop:14000,conc:1,aff:5.5,pass:4},'#7a3e9d',60,230],['Zona artigianale',{pop:1500,conc:2,aff:3.5,pass:3},'#d9822b',320,230]];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><svg class="ig" viewBox="0 0 580 380" role="img" aria-label="Mappa schematica con quattro zone" style="height:380px;width:auto">${Z.map((z,k)=>'<g data-z="'+k+'" style="cursor:pointer"><rect x="'+z[3]+'" y="'+z[4]+'" width="200" height="110" rx="14" fill="'+z[2]+'" opacity=".85"/><text x="'+(z[3]+100)+'" y="'+(z[4]+40)+'" text-anchor="middle" font-size="18" font-weight="800" fill="#fff">'+z[0]+'</text><text x="'+(z[3]+100)+'" y="'+(z[4]+70)+'" text-anchor="middle" font-size="14" fill="#fff">'+fmt(z[1].pop)+' ab. · '+z[1].conc+' concorrenti</text><text x="'+(z[3]+100)+'" y="'+(z[4]+92)+'" text-anchor="middle" font-size="14" fill="#fff">affitto '+z[1].aff+' €/m² · passaggio '+z[1].pass+'/10</text></g>').join('')}<path d="M290 20V360M20 190H560" stroke="#fff" stroke-width="8"/><text x="290" y="372" text-anchor="middle" font-size="12" fill="#52657a">Mappa schematica, dati di esempio</text></svg>
 <div><p style="font-size:17px">Che cosa conta di più per la vostra attività?</p><label class="sl" style="grid-template-columns:150px 1fr 40px"><span>Abitanti vicini</span><input type="range" data-w="pop" min="0" max="5" value="3"><b>3</b></label><label class="sl" style="grid-template-columns:150px 1fr 40px"><span>Pochi concorrenti</span><input type="range" data-w="conc" min="0" max="5" value="3"><b>3</b></label><label class="sl" style="grid-template-columns:150px 1fr 40px"><span>Affitto basso</span><input type="range" data-w="aff" min="0" max="5" value="3"><b>3</b></label><label class="sl" style="grid-template-columns:150px 1fr 40px"><span>Passaggio di persone</span><input type="range" data-w="pass" min="0" max="5" value="3"><b>3</b></label><div data-o="r" style="margin-top:10px;font-size:17px"></div></div></div>`;
 const norm=(k,v)=>{const vals=Z.map(z=>z[1][k]);const mn=Math.min(...vals),mx=Math.max(...vals);let t=(v-mn)/(mx-mn||1);if(k==='conc'||k==='aff')t=1-t;return t};
 const draw=()=>{const w={};$$(el,'[data-w]').forEach(i=>{w[i.dataset.w]=+i.value;i.parentElement.querySelector('b').textContent=i.value});const sc=Z.map(z=>Object.keys(w).reduce((a,k)=>a+w[k]*norm(k,z[1][k]),0));const best=sc.indexOf(Math.max(...sc));
  $$(el,'[data-z] rect').forEach((r,k)=>r.setAttribute('stroke',k===best?'#f4b942':'none')),$$(el,'[data-z] rect').forEach((r,k)=>r.setAttribute('stroke-width',k===best?8:0));
  $(el,'[data-o=r]').innerHTML='<table class="rules" style="font-size:16px">'+Z.map((z,k)=>'<tr><td>'+z[0]+'</td><td><div class="meter" style="width:140px;display:inline-block;vertical-align:middle"><span style="width:'+(sc[k]/Math.max(...sc)*100)+'%;background:'+z[2]+'"></span></div></td><td>'+(k===best?'<span class="tag ok">migliore</span>':'')+'</td></tr>').join('')+'</table><p class="small" style="margin-top:6px">Cambiate i pesi: la zona migliore cambia con le priorità. Nel piano d’impresa motivate la scelta con questi dati.</p>'};
 el.addEventListener('input',draw);draw();
};

/* 43. Contacaratteri per la Descrizione dell'iniziativa */
S.caratteri=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:18px"><div><textarea data-o="t" rows="9" style="width:100%;font-size:17px;padding:8px 10px" placeholder="Incollate qui la bozza della vostra idea di business…"></textarea></div>
 <div><div class="s-card gold" style="text-align:center"><b>Caratteri (spazi inclusi)</b><br><span data-o="n" style="font-size:40px;font-weight:800">0</span><span style="font-size:18px"> / 5.000</span></div><div class="meter" style="margin:10px 0;height:18px"><span data-o="m" style="background:#2a9d8f"></span></div><p data-o="o" style="font-size:17px"></p>
 <div class="s-box teal small" style="font-size:15px;margin-top:8px"><b>Scaletta consigliata</b><br>1. Chi siete ed esperienza (600)<br>2. Bisogno di mercato, con i dati (1.200)<br>3. Offerta e clienti (1.200)<br>4. Spese e strumenti (900)<br>5. Ricavi attesi e sostenibilità (1.100)</div></div></div>`;
 const t=$(el,'[data-o=t]');const draw=()=>{const n=t.value.length,w=t.value.trim()?t.value.trim().split(/\s+/).length:0;$(el,'[data-o=n]').textContent=fmt(n);const m=$(el,'[data-o=m]');m.style.width=Math.min(100,n/50)+'%';m.style.background=n>5000?'#c0392b':n>4500?'#d9822b':'#2a9d8f';$(el,'[data-o=o]').textContent=n>5000?'Oltre il limite di '+fmt(n-5000)+' caratteri: tagliate.':n===0?'Il limite della Descrizione dell’iniziativa è 5.000 caratteri.':fmt(w)+' parole · restano '+fmt(5000-n)+' caratteri.'};
 t.addEventListener('input',draw);draw();
};

/* montaggio */
function mount(){document.querySelectorAll('[data-sim]').forEach(el=>{if(el.dataset.ready)return;el.classList.add('sim');const f=S[el.dataset.sim];if(f){try{f(el);el.dataset.ready='1'}catch(e){el.textContent='Simulazione non disponibile: '+e.message;console.error(e)}}})}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount):mount();
window.UD12Sim=S;
})();
