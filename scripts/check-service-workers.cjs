const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function load(file, scope) {
  const handlers = {}, deleted = [], added = [];
  let cached, fail = false;
  const context = {
    URL, Response,
    self: {location:{origin:'https://example.test'},registration:{scope},
      addEventListener:(name,fn)=>handlers[name]=fn,
      skipWaiting:async()=>{},clients:{claim:async()=>{}}},
    caches:{keys:async()=>['adinolfi-v2','agenda-v12','unrelated'],
      delete:async key=>deleted.push(key),match:async()=>cached,
      open:async()=>({addAll:async urls=>added.push(...urls),put:async()=>{}})},
    fetch:async()=>{if(fail)throw Error('offline');return new Response('ok');}
  };
  vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
  return {handlers,deleted,added,setOffline:()=>{fail=true},setCached:r=>{cached=r}};
}
async function lifecycle(worker,name) {
  let promise;worker.handlers[name]({waitUntil:p=>promise=p});await promise;
}
async function request(worker,url,mode='cors') {
  let promise;
  worker.handlers.fetch({request:{url,mode,method:'GET',headers:new Headers()},respondWith:p=>promise=p});
  return promise;
}
(async()=>{
  const main=load('sw.js','https://example.test/');
  await lifecycle(main,'install');
  for(const asset of main.added) assert.ok(fs.existsSync(path.join(root,asset)),`Missing precache asset ${asset}`);
  await lifecycle(main,'activate');
  assert.deepEqual(main.deleted,['adinolfi-v2']);
  assert.equal(await request(main,'https://example.test/agenda-semplice/auth.js'),undefined);
  const agenda=load('agenda-semplice/sw.js','https://example.test/agenda-semplice/');
  assert.equal(await request(agenda,'https://www.googleapis.com/drive/v3/files'),undefined);
  assert.equal(await request(agenda,'https://example.test/index.html'),undefined);
  agenda.setOffline();
  assert.equal((await request(agenda,'https://example.test/agenda-semplice/auth.js')).status,503);
  assert.equal((await request(agenda,'https://example.test/agenda-semplice/missing.png')).status,503);
  agenda.setCached(new Response('<html>agenda</html>'));
  assert.equal(await (await request(agenda,'https://example.test/agenda-semplice/','navigate')).text(),'<html>agenda</html>');
  const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
  for(const shortcut of manifest.shortcuts)assert.ok(fs.existsSync(path.join(root,shortcut.url)));
  console.log('PASS: precache assets, cache isolation, external API bypass, offline responses, manifest shortcuts');
})().catch(error=>{console.error(error);process.exitCode=1});
