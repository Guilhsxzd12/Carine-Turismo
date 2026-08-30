document.addEventListener('carine:data-ready',()=>{
 const page=document.body.dataset.catalog;if(!page||!window.CARINE_DATA)return;
 const map={passeios:['passeios','passeio'],ingressos:['ingressos','ingresso'],hoteis:['hoteis','hotel'],eventos:['eventos','evento']};
 const [key,type]=map[page]||[];if(!key)return;const items=CARINE_DATA[key];setupFilters(items,type);
 const q=new URLSearchParams(location.search).get('q');if(q){const input=document.querySelector('#catalog-search');if(input){input.value=q;input.dispatchEvent(new Event('input'))}}
})
