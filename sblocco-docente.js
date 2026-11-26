/*
  sblocco-docente.js · Riapertura di una prova a tempo scaduto da parte del docente.

  Uso in una pagina di verifica:
    SbloccoDocente.init({
      nome: 'Verifica OOP',
      scaduta:  () => true/false,      // la prova è chiusa per tempo scaduto?
      riaperta: () => data o null,      // quando è stata riaperta dal docente (null se non lo è)
      riapri:   info => { ... },        // riapre la prova (info.alle: Date, info.modo: 'codice' | 'account')
      richiudi: () => { ... }           // facoltativo: richiude la prova riaperta
    });

  Compare un pulsante «Sblocco docente» solo quando la prova è scaduta o riaperta. Il docente digita il
  codice sul dispositivo dello studente; se nel browser è attiva la sessione del sito con l'account del
  docente, il codice non serve. Nel codice c'è solo l'impronta SHA-256 del codice.
  Il timer non viene modificato: la prova resta «a tempo scaduto», ma le risposte tornano modificabili
  e la riapertura viene indicata nella consegna.
  Controllo lato client: impedisce lo sblocco accidentale, non resiste a chi manomette il browser.
*/
(function () {
  "use strict";
  const HASHES = ["c4f2a18391aa8905942ecbb145b0a414b7057f055b997019bd5b051b38868025"];
  const TEACHER_EMAIL = "antonioadinolfi@lscortese.com", SITE_SESSION = "lsc_auth_session_v1";

  function teacherSession() {
    for (const s of ["sessionStorage", "localStorage"]) {
      try {
        const v = JSON.parse(window[s].getItem(SITE_SESSION) || "null");
        if (v && v.expiresAt > Date.now() && String(v.email || "").toLowerCase().trim() === TEACHER_EMAIL) return true;
      } catch (e) { /* storage non disponibile */ }
    }
    return false;
  }
  async function sha256(t) {
    const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return [...new Uint8Array(d)].map(x => x.toString(16).padStart(2, "0")).join("");
  }
  const ora = d => new Date(d).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  const CSS = `
  #sd-btn{position:fixed;right:16px;bottom:16px;z-index:2147483000;border:0;border-radius:999px;padding:10px 16px;font:700 14px system-ui,Segoe UI,Arial,sans-serif;background:#102a43;color:#fff;box-shadow:0 6px 20px rgba(0,0,0,.3);cursor:pointer}
  #sd-btn:focus-visible{outline:3px solid #f4b942;outline-offset:3px}
  #sd-banner{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:2147483000;background:#fff1b8;color:#5c3c00;border:2px solid #d9a227;border-radius:12px;padding:8px 16px;font:700 14px system-ui,Segoe UI,Arial,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.18);max-width:calc(100% - 24px);text-align:center}
  #sd-dlg{border:0;border-radius:16px;padding:0;max-width:440px;width:calc(100% - 32px);font:15px/1.5 system-ui,Segoe UI,Arial,sans-serif;color:#172b4d;box-shadow:0 20px 60px rgba(0,0,0,.35)}
  #sd-dlg::backdrop{background:rgba(16,42,67,.55)}
  #sd-dlg form{padding:22px}
  #sd-dlg h2{margin:0 0 8px;font-size:1.25rem}
  #sd-dlg p{margin:0 0 12px}
  #sd-dlg input{width:100%;box-sizing:border-box;border:1px solid #a9bfce;border-radius:10px;padding:11px 12px;font:inherit}
  #sd-dlg .sd-row{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-top:14px}
  #sd-dlg button{border:1px solid #a9bfce;border-radius:10px;padding:9px 14px;font:700 14px system-ui,Segoe UI,Arial,sans-serif;background:#fff;color:#102a43;cursor:pointer}
  #sd-dlg button.sd-main{background:#102a43;color:#fff;border-color:#102a43}
  #sd-dlg button.sd-warn{background:#fde4d4;border-color:#d9822b;color:#7a2e0b}
  #sd-dlg .sd-msg{min-height:1.4em;font-weight:700;color:#9a3b12;margin:10px 0 0}
  #sd-dlg .sd-ok{color:#145d53}
  @media print{#sd-btn,#sd-banner{display:none!important}}`;

  function init(opts) {
    if (!opts || typeof opts.scaduta !== "function" || typeof opts.riapri !== "function") return;
    const st = document.createElement("style"); st.textContent = CSS; document.head.append(st);
    const btn = document.createElement("button"); btn.type = "button"; btn.id = "sd-btn"; btn.hidden = true;
    const banner = document.createElement("div"); banner.id = "sd-banner"; banner.hidden = true; banner.setAttribute("role", "status");
    const dlg = document.createElement("dialog"); dlg.id = "sd-dlg"; dlg.setAttribute("aria-labelledby", "sd-tit");
    document.body.append(btn, banner, dlg);
    const riaperta = () => (typeof opts.riaperta === "function" ? opts.riaperta() : null);

    function aggiorna() {
      const r = riaperta(), sc = !r && opts.scaduta();
      btn.hidden = !(r || sc);
      btn.textContent = r ? "🔓 Prova riaperta · docente" : "🔒 Sblocco docente";
      banner.hidden = !r;
      if (r) banner.textContent = "🔓 Prova riaperta dal docente alle " + ora(r) + " · il tempo è scaduto, ma puoi continuare e consegnare";
    }

    function apri() {
      const r = riaperta(), account = teacherSession();
      if (r) {
        dlg.innerHTML = `<form method="dialog"><h2 id="sd-tit">Prova riaperta</h2>
          <p>La prova di questo studente è stata riaperta alle <strong>${ora(r)}</strong>.</p>
          ${typeof opts.richiudi === "function" ? "<p>Puoi richiuderla: le risposte tornano bloccate" + (opts.notaRichiudi ? " " + opts.notaRichiudi : "") + ".</p>" : ""}
          <div class="sd-row"><button value="annulla">Chiudi</button>${typeof opts.richiudi === "function" ? '<button class="sd-warn" value="richiudi" id="sd-richiudi">Richiudi la prova</button>' : ""}</div></form>`;
        dlg.showModal();
        const rb = dlg.querySelector("#sd-richiudi");
        if (rb) rb.addEventListener("click", ev => { ev.preventDefault(); dlg.close(); opts.richiudi(); aggiorna(); });
        return;
      }
      dlg.innerHTML = `<form><h2 id="sd-tit">Sblocco docente</h2>
        <p>Il tempo della prova è scaduto. Il docente può <strong>riaprirla</strong>: le risposte tornano modificabili, il timer resta scaduto e la riapertura viene indicata nella consegna.</p>
        ${account ? '<p class="sd-ok">✓ Accesso docente attivo su questo browser: il codice non serve.</p>' : '<label for="sd-code"><strong>Codice del docente</strong></label><input id="sd-code" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" required>'}
        <p class="sd-msg" id="sd-msg" role="alert"></p>
        <div class="sd-row"><button type="button" id="sd-annulla">Annulla</button><button class="sd-main" type="submit">Riapri la prova</button></div></form>`;
      dlg.showModal();
      const form = dlg.querySelector("form"), msg = dlg.querySelector("#sd-msg"), code = dlg.querySelector("#sd-code");
      if (code) code.focus();
      dlg.querySelector("#sd-annulla").onclick = () => dlg.close();
      let tentativi = 0;
      form.onsubmit = async ev => {
        ev.preventDefault();
        let ok = account, modo = "account";
        if (!ok) {
          modo = "codice";
          try { ok = HASHES.includes(await sha256(code.value)); } catch (e) { msg.textContent = "Questo browser non permette la verifica del codice."; return; }
        }
        if (!ok) {
          tentativi++; code.value = ""; code.focus();
          msg.textContent = "Codice non valido." + (tentativi >= 3 ? " Il pulsante resta bloccato per alcuni secondi." : "");
          if (tentativi >= 3) { const b = form.querySelector("button[type=submit]"); b.disabled = true; setTimeout(() => { b.disabled = false; }, 5000 * (tentativi - 2)); }
          return;
        }
        dlg.close();
        opts.riapri({ alle: new Date(), modo });
        aggiorna();
      };
    }
    btn.addEventListener("click", apri);
    aggiorna();
    setInterval(aggiorna, 1000);
    return { aggiorna };
  }
  window.SbloccoDocente = { init, ora };
})();
