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

// Cabeçalho-cápsula compartilhado entre todas as páginas públicas.
(function(){
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href='css/capsule-header.css';
  style.dataset.carineCapsule='true';
  document.head.appendChild(style);

  const current=location.pathname.split('/').pop()||'index.html';
  const params=new URLSearchParams(location.search);
  const category=params.get('categoria')||'';
  const active=name=>{
    if(name==='inicio')return current==='index.html'||current==='';
    if(name==='passeios')return current==='passeios.html'&&!['Paraguai','Argentina'].includes(category);
    if(name==='ingressos')return current==='ingressos.html';
    if(name==='transporte')return current==='transporte.html';
    if(name==='hoteis')return current==='hoteis.html';
    if(name==='eventos')return current==='eventos.html';
    return false;
  };
  const international=['Paraguai','Argentina'].includes(category);
  const chevron='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 10 4 4 4-4"/></svg>';
  const instagram='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';

  const nav=document.querySelector('.site-header .nav');
  if(!nav)return;
  nav.innerHTML=`
    <a class="brand ct-brand" href="index.html" aria-label="Carine Turismo — início">
      <img src="assets/logo/tucano.png" alt="Carine Turismo">
      <span>CARINE TURISMO</span>
    </a>
    <nav class="nav-links ct-nav-links" aria-label="Navegação principal">
      <a class="${active('inicio')?'active':''}" href="index.html">Início</a>
      <a class="${active('passeios')?'active':''}" href="passeios.html">Passeios</a>
      <a class="${active('ingressos')?'active':''}" href="ingressos.html">Ingressos</a>
      <details class="ct-nav-dropdown${international?' active-group':''}">
        <summary${international?' class="active"':''}>Internacional ${chevron}</summary>
        <div class="ct-dropdown-menu">
          <a href="passeios.html?categoria=Paraguai">🇵🇾 Paraguai</a>
          <a href="passeios.html?categoria=Argentina">🇦🇷 Argentina</a>
        </div>
      </details>
      <a class="${active('transporte')?'active':''}" href="transporte.html">Transporte</a>
      <a class="${active('hoteis')?'active':''}" href="hoteis.html">Hotéis</a>
      <a class="${active('eventos')?'active':''}" href="eventos.html">Eventos</a>
      <a class="ct-mobile-budget" target="_blank" data-wa="Olá! Gostaria de solicitar um orçamento com a Carine Turismo.">Pedir orçamento</a>
    </nav>
    <a class="btn btn-primary ct-budget" target="_blank" data-wa="Olá! Gostaria de solicitar um orçamento com a Carine Turismo.">Pedir orçamento</a>
    <a class="instagram-head" href="https://instagram.com/carine.turismo" target="_blank" rel="noopener" aria-label="Instagram da Carine Turismo" title="Instagram">${instagram}</a>
    <button class="mobile-toggle" type="button" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span><span></span></button>`;

  const toggle=nav.querySelector('.mobile-toggle');
  const links=nav.querySelector('.nav-links');
  if(toggle&&links){
    toggle.addEventListener('click',()=>{
      requestAnimationFrame(()=>toggle.setAttribute('aria-expanded',links.classList.contains('open')?'true':'false'));
    });
  }
})();