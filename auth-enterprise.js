/*
  auth-enterprise.js v4
  Protezione didattica stile Google Classroom per sito statico.
  Fix v4: nella pagina index.html, dopo il login, NON ricarica inutilmente la pagina:
  nasconde login-wall e mostra protected-content direttamente.
*/

(function () {
  "use strict";

  const CONFIG = {
    clientId: "1011752872320-713mjtge9ofhtnclhjfvdoc2h2q2uelv.apps.googleusercontent.com",
    allowedDomain: "lscortese.com",
    sessionKey: "lsc_auth_session_v1",
    maxAgeMinutes: 480
  };

  function now() {
    return Date.now();
  }

  function decodeJwt(token) {
    try {
      const payload = token.split(".")[1];
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(normalized)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json);
    } catch (err) {
      console.error("JWT non leggibile", err);
      return null;
    }
  }

  function isAllowedEmail(email) {
    return typeof email === "string" &&
      email.toLowerCase().trim().endsWith("@" + CONFIG.allowedDomain);
  }

  function saveSession(profile) {
    const session = {
      email: String(profile.email || "").toLowerCase().trim(),
      name: profile.name || profile.given_name || profile.email,
      picture: profile.picture || "",
      hd: profile.hd || "",
      createdAt: now(),
      expiresAt: now() + CONFIG.maxAgeMinutes * 60 * 1000
    };
    sessionStorage.setItem(CONFIG.sessionKey, JSON.stringify(session));
    localStorage.setItem(CONFIG.sessionKey, JSON.stringify(session));
    return session;
  }

  function getSession() {
    const raw = sessionStorage.getItem(CONFIG.sessionKey) || localStorage.getItem(CONFIG.sessionKey);
    if (!raw) return null;

    try {
      const session = JSON.parse(raw);
      if (!session.email || !isAllowedEmail(session.email)) {
        clearSession();
        return null;
      }
      if (!session.expiresAt || session.expiresAt < now()) {
        clearSession();
        return null;
      }
      return session;
    } catch {
      clearSession();
      return null;
    }
  }

  function clearSession() {
    sessionStorage.removeItem(CONFIG.sessionKey);
    localStorage.removeItem(CONFIG.sessionKey);
  }

  function redirectToLogin(loginUrl) {
    const current = window.location.href;
    const url = new URL(loginUrl || "login.html", window.location.href);
    url.searchParams.set("return", current);
    window.location.replace(url.toString());
  }

  function getReturnUrl(defaultUrl) {
    const params = new URLSearchParams(window.location.search);
    return params.get("return") || defaultUrl || "index.html#didattica";
  }

  function showDenied(message) {
    let box = document.getElementById("auth-error");
    if (!box) {
      box = document.createElement("div");
      box.id = "auth-error";
      box.style.cssText = "margin:18px auto;max-width:720px;padding:14px 16px;border:1px solid #fecaca;background:#fff1f2;color:#991b1b;border-radius:14px;font:600 15px/1.45 Inter,Arial,sans-serif;";
      const mount = document.getElementById("google-login") || document.getElementById("google-login-inline") || document.body;
      mount.parentNode.insertBefore(box, mount.nextSibling);
    }
    box.textContent = message;
  }

  function updateAuthBadge() {
    const session = getSession();
    const badge = document.getElementById("auth-info");
    if (!badge) return;

    if (!session) {
      badge.innerHTML = "";
      return;
    }

    badge.innerHTML =
      '<span class="auth-user-pill" style="display:inline-flex;align-items:center;gap:8px;">' +
      (session.picture ? '<img src="' + session.picture + '" alt="" style="width:24px;height:24px;border-radius:50%;">' : "") +
      '<span>' + session.email + '</span>' +
      '<button type="button" id="auth-logout-btn" style="margin-left:8px;border:0;border-radius:999px;padding:6px 10px;background:#0b3b75;color:#fff;cursor:pointer;font-weight:800;">Esci</button>' +
      '</span>';

    const btn = document.getElementById("auth-logout-btn");
    if (btn) {
      btn.addEventListener("click", function () {
        clearSession();
        window.location.href = "index.html#didattica";
        window.location.reload();
      });
    }
  }

  function openDidatticaProtected(loginWallId, protectedId) {
    const loginWall = document.getElementById(loginWallId || "login-wall");
    const protectedContent = document.getElementById(protectedId || "protected-content");

    if (loginWall) {
      loginWall.style.display = "none";
      loginWall.setAttribute("hidden", "");
      loginWall.classList.add("auth-hidden");
    }

    if (protectedContent) {
      protectedContent.style.display = "";
      protectedContent.removeAttribute("hidden");
      protectedContent.classList.add("auth-visible");
    }

    /* Forza apertura tab Didattica, se la funzione esiste. */
    if (typeof window.showTab === "function") {
      try { window.showTab("didattica"); } catch (e) {}
    }

    /* Forza il blocco Quadro orario come primo pannello visibile. */
    document.querySelectorAll(".didattica-block").forEach(function (el) {
      el.classList.remove("active");
      el.style.display = "none";
    });

    const first = document.getElementById("didattica-percorsi");
    if (first) {
      first.classList.add("active");
      first.style.display = "";
    }

    document.querySelectorAll(".didattica-subnav a").forEach(function (a) {
      a.classList.remove("active");
    });

    const a = document.querySelector('.didattica-subnav a[data-target="didattica-percorsi"]');
    if (a) a.classList.add("active");

    updateAuthBadge();
  }

  function requireAuth(options) {
    const opts = options || {};
    const session = getSession();

    document.documentElement.classList.add("auth-checking");

    if (!session) {
      redirectToLogin(opts.loginUrl || "login.html");
      return false;
    }

    document.documentElement.classList.remove("auth-checking");
    document.documentElement.classList.add("auth-ok");
    updateAuthBadge();

    if (opts.protectedSelector) {
      const el = document.querySelector(opts.protectedSelector);
      if (el) el.style.display = "";
    }

    return true;
  }

  function initIndexDidattica(options) {
    const opts = options || {};
    const session = getSession();

    const loginWallId = opts.loginWallId || "login-wall";
    const protectedId = opts.protectedId || "protected-content";

    const loginWall = document.getElementById(loginWallId);
    const protectedContent = document.getElementById(protectedId);

    if (session) {
      openDidatticaProtected(loginWallId, protectedId);
      return true;
    }

    if (loginWall) {
      loginWall.style.display = "";
      loginWall.removeAttribute("hidden");
    }
    if (protectedContent) {
      protectedContent.style.display = "none";
      protectedContent.setAttribute("hidden", "");
    }

    renderLogin({
      mountId: opts.mountId || "google-login-inline",
      afterLogin: opts.afterLogin || "index.html#didattica",
      mode: "inline",
      onSuccess: function () {
        openDidatticaProtected(loginWallId, protectedId);
      }
    });

    return false;
  }

  function renderLogin(options) {
    const opts = options || {};
    const mountId = opts.mountId || "google-login";
    const mount = document.getElementById(mountId);

    window.handleCredentialResponse = function (response) {
      const profile = decodeJwt(response.credential);

      if (!profile || !profile.email) {
        showDenied("Accesso non riuscito: credenziali Google non valide.");
        return;
      }

      if (!isAllowedEmail(profile.email)) {
        clearSession();
        showDenied("Accesso negato. Usa esclusivamente l’account istituzionale @" + CONFIG.allowedDomain + ".");
        return;
      }

      const session = saveSession(profile);
      updateAuthBadge();

      if (typeof opts.onSuccess === "function") {
        opts.onSuccess(session);
        return;
      }

      const target = getReturnUrl(opts.afterLogin || "index.html#didattica");
      window.location.href = target;
    };

    function doRender() {
      if (!window.google || !google.accounts || !google.accounts.id) {
        setTimeout(doRender, 100);
        return;
      }

      google.accounts.id.initialize({
        client_id: CONFIG.clientId,
        callback: window.handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false
      });

      if (mount) {
        mount.innerHTML = "";
        google.accounts.id.renderButton(mount, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left"
        });
      }

      if (!opts.noPrompt) {
        try { google.accounts.id.prompt(); } catch(e) {}
      }
    }

    doRender();
  }

  window.LSCAuth = {
    config: CONFIG,
    decodeJwt,
    isAllowedEmail,
    saveSession,
    getSession,
    clearSession,
    requireAuth,
    renderLogin,
    initIndexDidattica,
    openDidatticaProtected,
    updateAuthBadge,
    logout: function () {
      clearSession();
      window.location.href = "index.html#didattica";
      window.location.reload();
    }
  };

  document.addEventListener("DOMContentLoaded", updateAuthBadge);
})();
