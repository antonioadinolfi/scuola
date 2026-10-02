(function(){
"use strict";

const CONFIG = {
  clientId: "1011752872320-713mjtge9ofhtnclhjfvdoc2h2q2uelv.apps.googleusercontent.com",
  scope: "https://www.googleapis.com/auth/drive.appdata",
  fileName: "agenda-semplice-data.json",
  updatedKey: "agenda_semplice_cloud_updated_v1"
};

let tokenClient = null;
let accessToken = null;
let fileId = null;
let ready = false;
let saving = false;
let saveQueued = false;
let saveTimer = null;

function setStatus(text, error=false){
  const el=document.getElementById("cloudStatus");
  if(el){
    el.textContent=text;
    el.style.color=error ? "#b42318" : "#667085";
  }
}

function waitForGIS(){
  return new Promise((resolve,reject)=>{
    const started=Date.now();
    (function poll(){
      if(window.google && google.accounts && google.accounts.oauth2) return resolve();
      if(Date.now()-started>15000) return reject(new Error("Google Identity Services non disponibile"));
      setTimeout(poll,100);
    })();
  });
}

async function getAccessToken(prompt=""){
  await waitForGIS();
  if(!tokenClient){
    tokenClient=google.accounts.oauth2.initTokenClient({
      client_id:CONFIG.clientId,
      scope:CONFIG.scope,
      include_granted_scopes:true,
      callback:()=>{}
    });
  }
  return new Promise((resolve,reject)=>{
    tokenClient.callback=(response)=>{
      if(response && response.access_token){
        accessToken=response.access_token;
        resolve(accessToken);
      }else{
        reject(new Error(response?.error_description || response?.error || "Autorizzazione Google non concessa"));
      }
    };
    tokenClient.requestAccessToken({prompt});
  });
}

async function api(url, options={}, retry=true){
  if(!accessToken) await getAccessToken("");
  const headers=new Headers(options.headers||{});
  headers.set("Authorization","Bearer "+accessToken);
  const response=await fetch(url,{...options,headers});
  if(response.status===401 && retry){
    accessToken=null;
    await getAccessToken("");
    return api(url,options,false);
  }
  if(!response.ok){
    let detail="";
    try{detail=await response.text()}catch(_){}
    throw new Error("Google Drive HTTP "+response.status+(detail?": "+detail.slice(0,220):""));
  }
  return response;
}

function localState(){
  if(!window.agendaCloudBridge) throw new Error("Agenda non pronta");
  return window.agendaCloudBridge.getState();
}

async function findDataFile(){
  const q=encodeURIComponent("name='"+CONFIG.fileName+"' and trashed=false");
  const url="https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q="+q+"&pageSize=10&fields=files(id,name,modifiedTime)";
  const r=await api(url);
  const data=await r.json();
  return data.files?.[0] || null;
}

async function readData(id){
  const r=await api("https://www.googleapis.com/drive/v3/files/"+encodeURIComponent(id)+"?alt=media");
  return await r.json();
}

async function createData(payload){
  const boundary="agenda_boundary_"+crypto.randomUUID();
  const metadata={name:CONFIG.fileName,parents:["appDataFolder"],mimeType:"application/json"};
  const body=new Blob([
    "--"+boundary+"\r\n",
    "Content-Type: application/json; charset=UTF-8\r\n\r\n",
    JSON.stringify(metadata),
    "\r\n--"+boundary+"\r\n",
    "Content-Type: application/json\r\n\r\n",
    JSON.stringify(payload),
    "\r\n--"+boundary+"--\r\n"
  ]);
  const r=await api("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",{
    method:"POST",
    headers:{"Content-Type":"multipart/related; boundary="+boundary},
    body
  });
  const data=await r.json();
  fileId=data.id;
  return data;
}

async function writeData(payload){
  if(!fileId) await createData(payload);
  else {
    await api("https://www.googleapis.com/upload/drive/v3/files/"+encodeURIComponent(fileId)+"?uploadType=media",{
      method:"PATCH",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
  }
  localStorage.setItem(CONFIG.updatedKey,payload.updatedAt);
}

async function saveNow(){
  if(!ready || saving || !window.agendaCloudBridge) return;
  saving=true;
  try{
    const state=localState();
    state.updatedAt=new Date().toISOString();
    await writeData(state);
    setStatus("☁️ Sincronizzato · "+new Date().toLocaleTimeString("it-IT",{hour:"2-digit",minute:"2-digit"}));
  }catch(err){
    console.warn("Agenda cloud save:",err);
    setStatus("☁️ Sincronizzazione non riuscita",true);
  }finally{
    saving=false;
    if(saveQueued){
      saveQueued=false;
      scheduleSave();
    }
  }
}

function scheduleSave(){
  if(!ready) return;
  saveQueued=true;
  clearTimeout(saveTimer);
  saveTimer=setTimeout(()=>{
    saveQueued=false;
    saveNow();
  },900);
}

async function init(){
  if(ready) return;
  try{
    setStatus("☁️ Collegamento al cloud…");
    await getAccessToken("");
    ready=true;
    const remoteFile=await findDataFile();
    if(remoteFile){
      fileId=remoteFile.id;
      const remote=await readData(fileId);
      const remoteTime=Date.parse(remote.updatedAt||"");
      const localTime=Date.parse(localStorage.getItem(CONFIG.updatedKey)||"");
      if(remoteTime && (!localTime || remoteTime>=localTime)){
        window.agendaCloudBridge.applyCloudState(remote);
        localStorage.setItem(CONFIG.updatedKey,remote.updatedAt);
      }else{
        await saveNow();
      }
    }else{
      await saveNow();
    }
    ready=true;
    setStatus("☁️ Agenda sincronizzata");
  }catch(err){
    console.warn("Agenda cloud init:",err);
    setStatus("☁️ Attiva la sincronizzazione cloud",true);
    ready=false;
  }
}

window.agendaCloudSync={
  init,
  scheduleSave,
  authorize: async function(){
    try{
      await getAccessToken("consent");
      await init();
    }catch(err){
      console.warn(err);
      setStatus("☁️ Autorizzazione non concessa",true);
    }
  }
};
})();