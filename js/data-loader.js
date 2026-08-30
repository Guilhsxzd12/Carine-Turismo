// Em produção no Vercel, tenta carregar o catálogo do Supabase via API.
// Se o backend ainda não estiver configurado, mantém o catálogo estático como fallback.
window.CARINE_DATA_READY=(async()=>{try{const r=await fetch('/api/catalog',{headers:{Accept:'application/json'}});if(!r.ok)throw new Error();const remote=await r.json();const count=Object.values(remote).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);if(count)window.CARINE_DATA=remote;}catch(e){}return window.CARINE_DATA;})();
