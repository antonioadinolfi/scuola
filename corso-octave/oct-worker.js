/* Corso Octave · esecuzione dell'interprete in un Web Worker.
   La pagina può terminare il worker se il codice non termina (es. ciclo while infinito).
   Le sessioni (Command Window) conservano le variabili tra un comando e l'altro. */
"use strict";
importScripts('./oct-interp.js?v=1', './oct-eval.js?v=1');
const sessions = new Map();
postMessage({ type: 'ready' });
onmessage = e => {
  const { id, code, checks, session, reset } = e.data;
  if (reset) { sessions.delete(session); postMessage({ type: 'result', id, out: '', workspace: [], figures: [] }); return; }
  let ip = null;
  if (session) { ip = sessions.get(session); if (!ip) { ip = new self.OctEval.Interp(); sessions.set(session, ip); } }
  try {
    const r = self.OctEval.runProgram(code, checks, ip);
    postMessage(Object.assign({ type: 'result', id }, r));
  } catch (err) {
    postMessage({ type: 'result', id, out: '', errore: { msg: 'errore interno del simulatore: ' + String(err && err.message || err), riga: null }, verifiche: null, figures: [], workspace: [] });
  }
};
