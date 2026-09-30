const API_URL="https://script.google.com/macros/s/AKfycbwJ6QTeZAu7qI_Y75wH8IGMpmwYzc7O0nXTrw-GtuM1sRidCQmy-Hj_UL3i1zhKROCLdA/exec";
const KEY="adinolfi_agenda_v1";
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today=iso(new Date());
let events=JSON.parse(localStorage.getItem(KEY)||"[]");
let filter="all"; let deferredInstall=null;
const $=id=>document.getElementById(id);
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function saveLocal(){localStorage.setItem(KEY,JSON.stringify(events))}
function normalizeCloudEvent(e){
  const x={...e};
  if(typeof x.date==="string" && x.date.includes("T")) x.date=x.date.slice(0,10);
  if(x.date instanceof Date) x.date=iso(x.date);
  return x;
}
async function saveCloud(item){
  if(!API_URL)return;
  try{
    await fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"upsert",event:item}),redirect:"follow"});
    $("sync").textContent="Sincronizzato con Google Sheets.";
    $("sync").className="sync ok";
  }catch(_){
    $("sync").textContent="Salvato localmente; sincronizzazione cloud non riuscita.";
    $("sync").className="sync warn";
  }
}
function loadCloud(){
  return new Promise((resolve,reject)=>{
    if(!API_URL){resolve();return}
    const cb="agendaCallback_"+Date.now();
    const script=document.createElement("script");
    const cleanup=()=>{delete window[cb];script.remove()};
    window[cb]=(data)=>{
      cleanup();
      if(data&&data.ok&&Array.isArray(data.events)){
        events=data.events.map(normalizeCloudEvent); saveLocal(); render();
        $("sync").textContent="Sincronizzato con Google Sheets.";
        $("sync").className="sync ok"; resolve(data.events);
      }else reject(new Error("Risposta cloud non valida"));
    };
    script.onerror=()=>{cleanup();$("sync").textContent="Agenda locale: impossibile sincronizzare ora.";$("sync").className="sync warn";reject(new Error("Cloud non raggiungibile"))};
    script.src=API_URL+"?action=list&callback="+encodeURIComponent(cb)+"&t="+Date.now();
    document.head.appendChild(script);
  });
}
function weekBounds(){const d=new Date();const day=(d.getDay()+6)%7;const a=new Date(d);a.setHours(0,0,0,0);a.setDate(d.getDate()-day);const b=new Date(a);b.setDate(a.getDate()+6);b.setHours(23,59,59,999);return[a,b]}
function inWeek(e){if(!e.date)return false;const [a,b]=weekBounds(),d=new Date(e.date+"T12:00:00");return d>=a&&d<=b}
function matches(e){const q=$("search").value.trim().toLowerCase(),cat=$("cat").value;if(cat!=="all"&&e.category!==cat)return false;if(q&&!(e.title+" "+e.desc+" "+e.category).toLowerCase().includes(q))return false;if(filter==="today"&&e.date!==today)return false;if(filter==="week"&&!inWeek(e))return false;if(filter==="todo"&&e.status==="Completato")return false;if(filter==="high"&&e.priority!=="Alta")return false;return true}
function render(){const list=$("list");const arr=[...events].sort((a,b)=>(a.date||"9999").localeCompare(b.date||"9999")||(a.time||"99").localeCompare(b.time||"99"));const v=arr.filter(matches);list.innerHTML="";if(!v.length){list.innerHTML='<div class="empty">Nessun impegno trovato.</div>'}else v.forEach(e=>{const d=e.date?new Date(e.date+"T12:00:00").toLocaleDateString("it-IT",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"}):"Data da definire";const x=document.createElement("div");x.className="event "+e.priority.toLowerCase();x.innerHTML='<div class="bar"></div><div><h3>'+esc(e.title)+'</h3><div class="meta">'+d+(e.time?" · "+esc(e.time):"")+'</div><div><span class="badge">'+esc(e.category)+'</span><span class="badge">'+esc(e.priority)+'</span><span class="badge">'+esc(e.status)+'</span></div><div class="meta">'+esc(e.desc)+'</div></div><div class="actions"><button data-edit="'+e.id+'">Modifica</button><button data-done="'+e.id+'">'+(e.status==="Completato"?"Riapri":"Completa")+'</button></div>';list.appendChild(x)});$("sToday").textContent=events.filter(e=>e.date===today).length;$("sWeek").textContent=events.filter(inWeek).length;$("sTodo").textContent=events.filter(e=>e.status!=="Completato").length;$("sHigh").textContent=events.filter(e=>e.priority==="Alta"&&e.status!=="Completato").length}
function reset(){ $("id").value=""; $("date").value=today; $("time").value=""; $("title").value=""; $("desc").value=""; $("priority").value="Media"; $("reminder").value="Nessuno" }
$("form").addEventListener("submit",async ev=>{ev.preventDefault();const id=$("id").value||String(Date.now());const item={id,date:$("date").value,time:$("time").value,category:$("category").value,title:$("title").value.trim(),desc:$("desc").value.trim(),priority:$("priority").value,reminder:$("reminder").value,status:"Da fare"};const i=events.findIndex(x=>x.id===id);if(i>=0){item.status=events[i].status;events[i]=item}else events.push(item);saveLocal();render();await saveCloud(item);reset()});
$("cancel").onclick=reset;$("newBtn").onclick=()=>{reset();$("title").focus()};$("search").oninput=render;$("cat").onchange=render;
document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));render()});
$("list").addEventListener("click",async ev=>{const edit=ev.target.closest("[data-edit]"),done=ev.target.closest("[data-done]");const id=(edit||done)?.dataset?.[edit?"edit":"done"];if(!id)return;const e=events.find(x=>x.id===id);if(!e)return;if(edit){Object.entries({id:e.id,date:e.date,time:e.time,category:e.category,title:e.title,desc:e.desc,priority:e.priority,reminder:e.reminder}).forEach(([k,v])=>$(k).value=v);$("formPanel").scrollIntoView({behavior:"smooth",block:"start"})}else{e.status=e.status==="Completato"?"Da fare":"Completato";saveLocal();render();await saveCloud(e)}});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("install").hidden=false});$("install").onclick=async()=>{if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("install").hidden=true}};
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
reset();render();loadCloud().catch(()=>{});