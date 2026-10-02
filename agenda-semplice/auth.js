(function(){
"use strict";
const CONFIG={
  clientId:"1011752872320-713mjtge9ofhtnclhjfvdoc2h2q2uelv.apps.googleusercontent.com",
  allowedEmail:"antonioadinolfi@lscortese.com",
  sessionKey:"agenda_semplice_private_session_v1",
  maxAgeMinutes:480
};
function decodeJwt(token){
  try{
    const p=token.split(".")[1];
    const n=p.replace(/-/g,"+").replace(/_/g,"/");
    return JSON.parse(decodeURIComponent(atob(n).split("").map(c=>"%"+("00"+c.charCodeAt(0).toString(16)).slice(-2)).join("")));
  }catch(e){return null}
}
function clear(){sessionStorage.removeItem(CONFIG.sessionKey);localStorage.removeItem(CONFIG.sessionKey)}
function get(){
  try{
    const s=JSON.parse(sessionStorage.getItem(CONFIG.sessionKey)||localStorage.getItem(CONFIG.sessionKey)||"null");
    if(!s||s.email!==CONFIG.allowedEmail||!s.expiresAt||s.expiresAt<Date.now()){clear();return null}
    return s;
  }catch(e){clear();return null}
}
function showApp(){
  const gate=document.getElementById("authGate"), app=document.getElementById("agendaApp");
  if(gate)gate.hidden=true;
  if(app){app.hidden=false;app.removeAttribute("aria-hidden")}\n  window.dispatchEvent(new CustomEvent("agenda-auth-ready"));
  const badge=document.getElementById("privateUser");
  if(badge)badge.textContent=CONFIG.allowedEmail;
}
function deny(){
  clear();
  const e=document.getElementById("authError");
  if(e)e.textContent="Accesso negato. Questa agenda è riservata esclusivamente all'account "+CONFIG.allowedEmail+".";
}
window.agendaPrivateAuth={
  init:function(){
    const s=get();
    if(s){showApp();return}
    const app=document.getElementById("agendaApp");
    if(app)app.hidden=true;
    const gate=document.getElementById("authGate");
    if(gate)gate.hidden=false;
    window.handleAgendaCredential=function(response){
      const p=decodeJwt(response.credential);
      if(!p||!p.email||p.email.toLowerCase()!==CONFIG.allowedEmail||p.email_verified!==true){
        deny();return;
      }
      const session={email:p.email.toLowerCase(),name:p.name||"",picture:p.picture||"",createdAt:Date.now(),expiresAt:Date.now()+CONFIG.maxAgeMinutes*60*1000};
      sessionStorage.setItem(CONFIG.sessionKey,JSON.stringify(session));
      localStorage.setItem(CONFIG.sessionKey,JSON.stringify(session));
      showApp();
    };
    function render(){
      if(!window.google||!google.accounts||!google.accounts.id){setTimeout(render,100);return}
      google.accounts.id.initialize({
        client_id:CONFIG.clientId,
        callback:window.handleAgendaCredential,
        auto_select:false,
        cancel_on_tap_outside:false
      });
      const mount=document.getElementById("googleButton");
      if(mount){
        mount.innerHTML="";
        google.accounts.id.renderButton(mount,{type:"standard",theme:"outline",size:"large",text:"signin_with",shape:"rectangular",logo_alignment:"left"});
      }
    }
    render();
  },
  logout:function(){
    clear();
    try{if(window.google&&google.accounts&&google.accounts.id)google.accounts.id.disableAutoSelect()}catch(e){}
    location.reload();
  }
};
document.addEventListener("DOMContentLoaded",function(){window.agendaPrivateAuth.init()});
})();