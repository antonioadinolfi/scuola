/* Corso Python OOP · esecuzione di Python (Pyodide) in un Web Worker.
   Il worker può essere terminato dalla pagina se il codice non termina (es. ciclo infinito). */
"use strict";
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
importScripts(PYODIDE_URL + 'pyodide.js');

const HELPER = `
import sys, io, json, traceback, builtins, contextlib

def _no_input(*a, **k):
    raise RuntimeError("input() non è disponibile in questo editor: assegna i valori direttamente alle variabili.")
builtins.input = _no_input

def _info_errore(e):
    riga = None
    if isinstance(e, SyntaxError) and e.filename == '<studente>':
        riga = e.lineno
    else:
        for fr in traceback.extract_tb(e.__traceback__):
            if fr.filename == '<studente>':
                riga = fr.lineno
    return {'tipo': type(e).__name__, 'msg': str(e), 'riga': riga}

def _esegui(src, checks_json):
    ns = {'__name__': '__main__'}
    buf = io.StringIO()
    res = {'out': '', 'errore': None, 'verifiche': None}
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            exec(compile(src, '<studente>', 'exec'), ns)
    except BaseException as e:
        res['errore'] = _info_errore(e)
    res['out'] = buf.getvalue()
    if checks_json:
        esiti = []
        for c in json.loads(checks_json):
            if res['errore'] is not None:
                esiti.append({'ok': False, 'msg': 'Il programma si interrompe con un errore: correggilo prima.'})
                continue
            env = dict(ns)
            env['_OUTPUT'] = res['out']
            try:
                with contextlib.redirect_stdout(io.StringIO()):
                    exec(compile(c, '<verifica>', 'exec'), env)
                esiti.append({'ok': True})
            except AssertionError as e:
                esiti.append({'ok': False, 'msg': str(e)})
            except Exception as e:
                esiti.append({'ok': False, 'msg': type(e).__name__ + ': ' + str(e)})
        res['verifiche'] = esiti
    return json.dumps(res)
`;

const ready = loadPyodide({ indexURL: PYODIDE_URL }).then(py => {
  py.runPython(HELPER);
  postMessage({ type: 'ready' });
  return py;
}).catch(err => {
  postMessage({ type: 'fatal', message: String(err) });
  throw err;
});

onmessage = async (e) => {
  const { id, code, checks } = e.data;
  const py = await ready;
  try {
    const fn = py.globals.get('_esegui');
    const raw = fn(code, checks ? JSON.stringify(checks) : '');
    fn.destroy();
    postMessage({ type: 'result', id, ...JSON.parse(raw) });
  } catch (err) {
    postMessage({ type: 'result', id, out: '', errore: { tipo: 'ErroreInterno', msg: String(err), riga: null }, verifiche: null });
  }
};
