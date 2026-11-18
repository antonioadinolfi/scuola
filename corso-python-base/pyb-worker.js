/* Corso Introduzione a Python · esecuzione di Python (Pyodide) in un Web Worker.
   - input() legge i valori dalla casella «Input da tastiera» (una riga per ogni chiamata) e li mostra come in IDLE;
   - le verifiche possono rieseguire il programma con altri input: out = _run(['10', '0']);
   - _trace registra l'esecuzione riga per riga con le variabili (visualizzatore passo passo);
   - _repl esegue un comando alla volta in uno spazio dei nomi persistente (shell >>>).
   Il worker può essere terminato dalla pagina se il codice non termina (es. ciclo infinito). */
"use strict";
const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.28.3/full/';
importScripts(PYODIDE_URL + 'pyodide.js');

const HELPER = `
import sys, io, json, traceback, builtins, contextlib, types

class _FineInput(Exception):
    pass

_ORIG_INPUT = builtins.input

def _make_input(values, buf):
    vals = list(values)
    def _input(prompt=''):
        prompt = str(prompt)
        buf.write(prompt)
        if not vals:
            buf.write('\\n')
            raise _FineInput("Il programma chiede un altro input() ma la casella «Input da tastiera» è finita: aggiungi una riga.")
        v = vals.pop(0)
        buf.write(v + '\\n')
        return v
    return _input

def _info_errore(e):
    riga = None
    if isinstance(e, SyntaxError) and e.filename == '<studente>':
        riga = e.lineno
    else:
        for fr in traceback.extract_tb(e.__traceback__):
            if fr.filename == '<studente>':
                riga = fr.lineno
    tipo = 'InputMancante' if isinstance(e, _FineInput) else type(e).__name__
    return {'tipo': tipo, 'msg': str(e), 'riga': riga}

def _exec_src(src, inputs):
    ns = {'__name__': '__main__'}
    buf = io.StringIO()
    err = None
    builtins.input = _make_input(inputs, buf)
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            exec(compile(src, '<studente>', 'exec'), ns)
    except BaseException as e:
        err = e
    finally:
        builtins.input = _ORIG_INPUT
    return ns, buf.getvalue(), err

def _esegui(src, checks_json, stdin):
    inputs = stdin.split('\\n') if stdin else []
    if inputs and inputs[-1] == '':
        inputs.pop()
    ns, out, err = _exec_src(src, inputs)
    res = {'out': out, 'errore': _info_errore(err) if err else None, 'verifiche': None}
    if checks_json:
        def _run(values):
            _ns, _out, _err = _exec_src(src, [str(v) for v in values])
            if _err is not None:
                i = _info_errore(_err)
                raise AssertionError('con input ' + repr(list(values)) + ' il programma si interrompe: ' + i['tipo'] + ': ' + i['msg'])
            return _out
        def _vars(values):
            _ns, _out, _err = _exec_src(src, [str(v) for v in values])
            if _err is not None:
                i = _info_errore(_err)
                raise AssertionError('con input ' + repr(list(values)) + ' il programma si interrompe: ' + i['tipo'] + ': ' + i['msg'])
            return _ns
        esiti = []
        for c in json.loads(checks_json):
            needs_clean = '_run(' not in c and '_SRC' not in c
            if err is not None and needs_clean:
                esiti.append({'ok': False, 'msg': 'Il programma si interrompe con un errore: correggilo prima.'})
                continue
            env = dict(ns)
            env.update({'_OUTPUT': out, '_SRC': src, '_run': _run, '_vars': _vars})
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

def _vista(v):
    t = type(v).__name__
    try:
        r = repr(v)
    except Exception:
        r = '?'
    if len(r) > 60:
        r = r[:57] + '...'
    return {'v': r, 't': t}

def _snapshot(f_globals):
    out = {}
    for k, v in f_globals.items():
        if k.startswith('_') or isinstance(v, (types.ModuleType, types.FunctionType, type, types.BuiltinFunctionType)):
            continue
        out[k] = _vista(v)
    return out

def _trace(src, stdin):
    inputs = stdin.split('\\n') if stdin else []
    if inputs and inputs[-1] == '':
        inputs.pop()
    steps = []
    buf = io.StringIO()
    ns = {'__name__': '__main__'}
    LIMITE = 400
    class _Troppi(Exception):
        pass
    def tracer(frame, event, arg):
        if frame.f_code.co_filename != '<studente>':
            return None
        if event == 'line':
            if len(steps) >= LIMITE:
                raise _Troppi('Troppi passi: il visualizzatore si ferma dopo ' + str(LIMITE) + ' righe eseguite.')
            steps.append({'riga': frame.f_lineno, 'vars': _snapshot(frame.f_globals), 'out': buf.getvalue()})
        return tracer
    err = None
    builtins.input = _make_input(inputs, buf)
    try:
        code = compile(src, '<studente>', 'exec')
        sys.settrace(tracer)
        try:
            with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
                exec(code, ns)
        finally:
            sys.settrace(None)
    except BaseException as e:
        err = e
    finally:
        builtins.input = _ORIG_INPUT
    fine = {'riga': None, 'vars': _snapshot(ns), 'out': buf.getvalue(), 'fine': True}
    if err is not None:
        fine['errore'] = _info_errore(err)
        if fine['errore']['riga']:
            fine['riga'] = fine['errore']['riga']
    steps.append(fine)
    return json.dumps({'steps': steps})

_REPL_NS = {'__name__': '__main__'}
def _repl(src):
    buf = io.StringIO()
    err = None
    builtins.input = _make_input([], buf)
    try:
        with contextlib.redirect_stdout(buf), contextlib.redirect_stderr(buf):
            try:
                code = compile(src, '<studente>', 'single')
            except SyntaxError:
                code = compile(src, '<studente>', 'exec')
            exec(code, _REPL_NS)
    except BaseException as e:
        err = e
    finally:
        builtins.input = _ORIG_INPUT
    return json.dumps({'out': buf.getvalue(), 'errore': _info_errore(err) if err else None})
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
  const { id, mode, code, checks, stdin } = e.data;
  const py = await ready;
  try {
    const name = mode === 'trace' ? '_trace' : mode === 'repl' ? '_repl' : '_esegui';
    const fn = py.globals.get(name);
    const raw = mode === 'trace' ? fn(code, stdin || '') : mode === 'repl' ? fn(code) : fn(code, checks ? JSON.stringify(checks) : '', stdin || '');
    fn.destroy();
    postMessage({ type: 'result', id, ...JSON.parse(raw) });
  } catch (err) {
    postMessage({ type: 'result', id, out: '', errore: { tipo: 'ErroreInterno', msg: String(err), riga: null }, verifiche: null });
  }
};
