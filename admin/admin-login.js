const form=document.querySelector('#login-form');
const msg=document.querySelector('#login-msg');
if(location.search) history.replaceState({},document.title,location.pathname);
async function api(url,opt={}){const r=await fetch(url,{headers:{'Content-Type':'application/json',...(opt.headers||{})},cache:'no-store',...opt});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Erro na solicitação');return data}
form.onsubmit=async e=>{e.preventDefault();const f=new FormData(form);msg.textContent='';try{await api('/api/login',{method:'POST',body:JSON.stringify({user:f.get('user'),password:f.get('password')})});location.href='/admin/painel.html';}catch(err){msg.textContent=err.message}};
