const DB='auron-vault',STORE='vault',VERSION=1;
let key=null,salt=null,entries=[];
const $=id=>document.getElementById(id);
const E=new TextEncoder(),D=new TextDecoder();
const b64=x=>btoa(String.fromCharCode(...new Uint8Array(x)));
const ub64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const rnd=n=>crypto.getRandomValues(new Uint8Array(n));

async function derive(p,s){
 const k=await crypto.subtle.importKey('raw',E.encode(p),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt:s,iterations:600000,hash:'SHA-256'},k,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
function db(){
 return new Promise((ok,no)=>{
  const r=indexedDB.open(DB,VERSION);
  r.onupgradeneeded=()=>r.result.createObjectStore(STORE);
  r.onsuccess=()=>ok(r.result); r.onerror=()=>no(r.error);
 });
}
async function get(){
 const d=await db();
 return new Promise((ok,no)=>{
  const r=d.transaction(STORE).objectStore(STORE).get('vault');
  r.onsuccess=()=>ok(r.result||null); r.onerror=()=>no(r.error);
 });
}
async function put(v){
 const d=await db();
 return new Promise((ok,no)=>{
  const r=d.transaction(STORE,'readwrite').objectStore(STORE).put(v,'vault');
  r.onsuccess=ok; r.onerror=()=>no(r.error);
 });
}
async function save(){
 const iv=rnd(12);
 const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,E.encode(JSON.stringify(entries)));
 await put({v:1,salt:b64(salt),iv:b64(iv),data:b64(ct)});
}
async function load(v,k){
 return JSON.parse(D.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub64(v.iv)},k,ub64(v.data))));
}
function esc(s=''){
 return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function render(){
 const q=$('search').value.toLowerCase();
 const a=entries.filter(x=>[x.name,x.website,x.username].some(v=>String(v||'').toLowerCase().includes(q)));
 $('count').textContent=entries.length+' Einträge';
 $('entries').innerHTML=a.length?a.map(x=>'<article class="entry"><div class="entryIcon">'+esc((x.name||'?')[0].toUpperCase())+'</div><div class="entryMain"><div class="entryName">'+esc(x.name)+'</div><div class="entryUser">'+esc(x.username||x.website||'')+'</div></div><div class="entryActions"><button data-edit="'+x.id+'">Bearbeiten</button></div></article>').join(''):'<div class="empty">Noch keine Einträge.<br>Erstelle deinen ersten Zugang.</div>';
}
function openVault(){
 $('unlock').classList.add('hidden'); $('setup').classList.add('hidden'); $('vault').classList.remove('hidden'); render();
}
function gen(){
 const c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+';
 const a=rnd(32); return Array.from(a,n=>c[n%c.length]).join('');
}
function edit(id){
 const x=entries.find(e=>e.id===id); if(!x)return;
 $('entryId').value=x.id; $('entryName').value=x.name; $('entryUrl').value=x.website||'';
 $('entryUser').value=x.username||''; $('entryPass').value=x.password; $('entryNote').value=x.notes||'';
 $('dialogTitle').textContent='Eintrag bearbeiten'; $('entryDialog').showModal();
}

$('setupForm').onsubmit=async e=>{
 e.preventDefault();
 const p=$('setupPassword').value;
 if(p.length<12)return alert('Das Master-Passwort muss mindestens 12 Zeichen lang sein.');
 if(p!==$('setupPassword2').value)return alert('Die Passwörter stimmen nicht überein.');
 salt=rnd(16); key=await derive(p,salt); entries=[]; await save(); openVault();
};
$('unlockForm').onsubmit=async e=>{
 e.preventDefault(); $('unlockError').textContent='';
 try{const v=await get(); if(!v)throw Error(); salt=ub64(v.salt); const k=await derive($('unlockPassword').value,salt); entries=await load(v,k); key=k; $('unlockPassword').value=''; openVault();}
 catch{$('unlockError').textContent='Falsches Master-Passwort oder beschädigter Tresor.';}
};
$('lockBtn').onclick=()=>{key=null;salt=null;entries=[];$('vault').classList.add('hidden');$('unlock').classList.remove('hidden');};
$('addBtn').onclick=()=>{$('entryForm').reset();$('entryId').value='';$('dialogTitle').textContent='Neuer Eintrag';$('entryDialog').showModal();};
$('generateBtn').onclick=()=>{$('entryPass').value=gen();$('entryPass').type='text';setTimeout(()=>$('entryPass').type='password',1500);};
$('search').oninput=render;
$('entryForm').onsubmit=async e=>{
 e.preventDefault();
 const id=$('entryId').value||crypto.randomUUID();
 const x={id,name:$('entryName').value.trim(),website:$('entryUrl').value.trim(),username:$('entryUser').value.trim(),password:$('entryPass').value,notes:$('entryNote').value};
 const i=entries.findIndex(v=>v.id===id); if(i<0)entries.push(x);else entries[i]=x;
 await save(); $('entryDialog').close(); render();
};
$('entries').onclick=e=>{const id=e.target.dataset.edit;if(id)edit(id);};

(async()=>{
 try{const v=await get(); (v?$('unlock'):$('setup')).classList.remove('hidden');}
 catch{$('setup').classList.remove('hidden');}
})();