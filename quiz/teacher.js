"use strict";

/*
  Supporta i JSON di consegna creati dal tuo quiz, con schema simile:
  {
    schema: "invalsi-quiz-export/v1",
    quiz: { classe, title, startedAt, finishedAt, score:{ok,total,pct} ... },
    student: { name },
    answers: [...]
  }

  Se lo schema cambia, la dashboard non muore: prova a ricostruire comunque.
*/

const $ = (s) => document.querySelector(s);

let rows = [];
let sortKey = "classe";
let sortDir = 1;

const histBands = [
  {name:"0–49", a:0, b:49},
  {name:"50–59", a:50, b:59},
  {name:"60–69", a:60, b:69},
  {name:"70–79", a:70, b:79},
  {name:"80–89", a:80, b:89},
  {name:"90–100", a:90, b:100}
];

function safeStr(x){ return (x==null) ? "" : String(x); }

function parseAnyScore(obj){
  // 1) score già presente
  const sc = obj?.quiz?.score;
  if(sc && Number.isFinite(sc.pct) && Number.isFinite(sc.ok) && Number.isFinite(sc.total)){
    return {ok:+sc.ok, total:+sc.total, pct:+sc.pct};
  }

  // 2) punteggio / totale in altri campi
  if(Number.isFinite(obj?.punteggio) && Number.isFinite(obj?.totale)){
    const ok = +obj.punteggio, total = +obj.totale;
    const pct = total>0 ? Math.round((ok/total)*100) : 0;
    return {ok, total, pct};
  }

  // 3) prova da answers con correct? (se disponibile)
  const ans = obj?.answers;
  if(Array.isArray(ans) && ans.length){
    // se c'è selected e correct/answer
    let ok=0, total=0;
    for(const it of ans){
      const sel = it?.selected;
      const corr = it?.correct ?? it?.answer;
      if(sel==null || corr==null) { total++; continue; }
      total++;
      if(sel === corr) ok++;
    }
    const pct = total>0 ? Math.round((ok/total)*100) : 0;
    return {ok, total, pct};
  }

  return {ok:null, total:null, pct:null};
}

function normalizeRecord(fileName, obj){
  const classe = obj?.quiz?.classe || obj?.classe || obj?.class || "—";
  const studente = obj?.student?.name || obj?.studente || obj?.studentName || fileName.replace(/\.json$/i,"");
  const when = obj?.quiz?.finishedAt || obj?.finishedAt || obj?.data || obj?.timestamp || "";
  const score = parseAnyScore(obj);

  return {
    classe: safeStr(classe),
    studente: safeStr(studente),
    pct: score.pct,
    ok: score.ok,
    total: score.total,
    when: safeStr(when),
    file: fileName
  };
}

async function readJsonFile(file){
  const text = await file.text();
  const obj = JSON.parse(text);
  return normalizeRecord(file.name, obj);
}

function updateKpis(filtered){
  $("#kCount").textContent = String(filtered.length);

  const classes = [...new Set(filtered.map(r => r.classe).filter(Boolean))].sort();
  $("#kClasses").textContent = classes.length ? classes.join(", ") : "—";

  const pcts = filtered.map(r => r.pct).filter(v => Number.isFinite(v));
  if(!pcts.length){
    $("#kAvg").textContent = "—";
    $("#kMinMax").textContent = "—";
    return;
  }
  const avg = Math.round(pcts.reduce((a,b)=>a+b,0)/pcts.length);
  const mn = Math.min(...pcts);
  const mx = Math.max(...pcts);
  $("#kAvg").textContent = `${avg}%`;
  $("#kMinMax").textContent = `${mn}% / ${mx}%`;
}

function buildHist(filtered){
  const pcts = filtered.map(r => r.pct).filter(v => Number.isFinite(v));
  const total = pcts.length || 1;

  const counts = histBands.map(b => pcts.filter(p => p>=b.a && p<=b.b).length);
  const maxC = Math.max(...counts, 1);

  const host = $("#hist");
  host.innerHTML = "";

  histBands.forEach((b, i)=>{
    const c = counts[i];
    const pct = Math.round((c/total)*100);
    const w = Math.round((c/maxC)*100);

    const row = document.createElement("div");
    row.className = "barRow";
    row.innerHTML = `
      <div class="muted small">${b.name}</div>
      <div class="bar"><div class="fill" style="width:${w}%"></div></div>
      <div class="small"><b>${c}</b> (${pct}%)</div>
    `;
    host.appendChild(row);
  });
}

function fillClassFilter(){
  const sel = $("#fClass");
  const current = sel.value;
  const classes = [...new Set(rows.map(r => r.classe).filter(Boolean))].sort();
  sel.innerHTML = `<option value="">Tutte le classi</option>` + classes.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  sel.value = current;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

function applyFilters(){
  const c = $("#fClass").value.trim();
  const q = $("#fSearch").value.trim().toLowerCase();

  let out = rows.slice();

  if(c) out = out.filter(r => r.classe === c);
  if(q){
    out = out.filter(r => (r.studente||"").toLowerCase().includes(q) || (r.file||"").toLowerCase().includes(q));
  }

  // sort
  out.sort((a,b)=>{
    const av = a[sortKey], bv = b[sortKey];
    if(sortKey === "pct" || sortKey === "ok" || sortKey === "total"){
      const an = Number.isFinite(av) ? av : -1;
      const bn = Number.isFinite(bv) ? bv : -1;
      return (an - bn) * sortDir;
    }
    return safeStr(av).localeCompare(safeStr(bv), "it", {numeric:true, sensitivity:"base"}) * sortDir;
  });

  return out;
}

function renderTable(filtered){
  const tb = $("#tbl tbody");
  tb.innerHTML = "";

  for(const r of filtered){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(r.classe)}</td>
      <td>${escapeHtml(r.studente)}</td>
      <td>${Number.isFinite(r.pct) ? `<b>${r.pct}%</b>` : "—"}</td>
      <td>${Number.isFinite(r.ok) ? r.ok : "—"}</td>
      <td>${Number.isFinite(r.total) ? r.total : "—"}</td>
      <td>${escapeHtml(r.when)}</td>
      <td class="muted small">${escapeHtml(r.file)}</td>
    `;
    tb.appendChild(tr);
  }

  $("#btnExportCsv").disabled = (filtered.length === 0);
  updateKpis(filtered);
  buildHist(filtered);
}

function refresh(){
  fillClassFilter();
  const filtered = applyFilters();
  renderTable(filtered);
}

function exportCsv(){
  const filtered = applyFilters();
  const lines = [];
  lines.push(["Classe","Studente","Percentuale","OK","Totale","Consegna","File"].join(";"));
  for(const r of filtered){
    lines.push([
      r.classe,
      r.studente,
      Number.isFinite(r.pct) ? r.pct : "",
      Number.isFinite(r.ok) ? r.ok : "",
      Number.isFinite(r.total) ? r.total : "",
      r.when,
      r.file
    ].map(v => `"${String(v).replaceAll('"','""')}"`).join(";"));
  }

  const blob = new Blob([lines.join("\n")], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `report_quiz_${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 800);
}

// ---- Import handlers ----
async function importFiles(fileList){
  const errors = [];
  const files = [...fileList].filter(f => f.name.toLowerCase().endsWith(".json"));
  for(const f of files){
    try{
      const rec = await readJsonFile(f);
      rows.push(rec);
    }catch(e){
      errors.push(`${f.name}: ${e?.message || e}`);
    }
  }

  if(errors.length){
    $("#errors").style.display = "";
    $("#errors").textContent = "Alcuni file non sono stati importati:\n" + errors.join("\n");
  }else{
    $("#errors").style.display = "none";
    $("#errors").textContent = "";
  }

  refresh();
}

function clearAll(){
  rows = [];
  $("#errors").style.display = "none";
  $("#errors").textContent = "";
  refresh();
}

function initSorting(){
  document.querySelectorAll("#tbl thead th[data-sort]").forEach(th=>{
    th.addEventListener("click", ()=>{
      const k = th.getAttribute("data-sort");
      if(sortKey === k) sortDir *= -1;
      else { sortKey = k; sortDir = 1; }
      refresh();
    });
  });
}

// ---- init ----
(function(){
  const dz = $("#dropZone");
  dz.addEventListener("dragover", (e)=>{ e.preventDefault(); dz.classList.add("drag"); });
  dz.addEventListener("dragleave", ()=> dz.classList.remove("drag"));
  dz.addEventListener("drop", (e)=>{
    e.preventDefault();
    dz.classList.remove("drag");
    if(e.dataTransfer?.files?.length) importFiles(e.dataTransfer.files);
  });

  $("#fileInput").addEventListener("change", (e)=>{
    if(e.target.files?.length) importFiles(e.target.files);
    e.target.value = ""; // reset
  });

  $("#fClass").addEventListener("change", refresh);
  $("#fSearch").addEventListener("input", refresh);

  $("#btnExportCsv").addEventListener("click", exportCsv);
  $("#btnClear").addEventListener("click", clearAll);

  initSorting();
  refresh();
})();
