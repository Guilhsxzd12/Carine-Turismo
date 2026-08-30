// Fonte de verdade: Supabase. O catálogo local fica apenas como fallback de emergência.
(function(){
  const clone=v=>JSON.parse(JSON.stringify(v||{}));
  const base=clone(window.CARINE_DATA||{passeios:[],ingressos:[],hoteis:[],eventos:[]});
  const CAT_CACHE='carine_catalogo_remoto_v3';
  const SITE_CACHE='carine_site_remoto_v1';
  const empty={passeios:[],ingressos:[],hoteis:[],eventos:[]};
  const hasCatalog=d=>['passeios','ingressos','hoteis','eventos'].some(k=>Array.isArray(d?.[k])&&d[k].length);
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
  async function get(url,attempt=1){
    const c=new AbortController(),timer=setTimeout(()=>c.abort(),9000);
    try{
      const r=await fetch(`${url}${url.includes('?')?'&':'?'}_=${Date.now()}`,{cache:'no-store',headers:{Accept:'application/json','Cache-Control':'no-cache'},signal:c.signal});
      if(!r.ok)throw new Error(`${url} respondeu ${r.status}`);
      return await r.json();
    }catch(e){if(attempt<3){await new Promise(x=>setTimeout(x,450*attempt));return get(url,attempt+1)}throw e}finally{clearTimeout(timer)}
  }
  const cachedCat=read(CAT_CACHE),cachedSite=read(SITE_CACHE);
  window.CARINE_DATA=hasCatalog(cachedCat)?cachedCat:base;
  window.CARINE_SITE=cachedSite||{categorias:[],banners:[]};
  window.CARINE_DATA_READY=(async()=>{
    const [catRes,siteRes]=await Promise.allSettled([get('/api/catalog'),get('/api/site-data')]);
    if(catRes.status==='fulfilled'){
      const remote=catRes.value||empty;
      if(hasCatalog(remote)){window.CARINE_DATA=remote;write(CAT_CACHE,remote)}
      else window.CARINE_DATA=base;
    }else{
      console.warn('[Carine Turismo] catálogo remoto indisponível:',catRes.reason);
      window.CARINE_DATA=hasCatalog(cachedCat)?cachedCat:base;
    }
    if(siteRes.status==='fulfilled'){
      window.CARINE_SITE=siteRes.value||{categorias:[],banners:[]};write(SITE_CACHE,window.CARINE_SITE);
    }else{
      console.warn('[Carine Turismo] configurações remotas indisponíveis:',siteRes.reason);
      window.CARINE_SITE=cachedSite||{categorias:[],banners:[]};
    }
    return window.CARINE_DATA;
  })();
})();