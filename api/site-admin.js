const {json,isAuthed,supabase}=require('./_utils');
const resources={categoria:'categorias',banner:'banners'};
module.exports=async(req,res)=>{
  if(!isAuthed(req)) return json(res,401,{error:'Não autorizado'});
  try{
    if(req.method==='GET'){
      const [categorias,banners]=await Promise.all([
        supabase('categorias?select=*&order=ordem.asc,created_at.asc'),
        supabase('banners?select=*&order=ordem.asc,created_at.asc')
      ]);
      return json(res,200,{categorias:categorias||[],banners:banners||[]},{'Cache-Control':'no-store'});
    }
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
    const table=resources[body.resource];
    if(!table) return json(res,400,{error:'Recurso inválido'});
    if(req.method==='POST'){
      const out=await supabase(table,{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body.data||{})});
      return json(res,200,out?.[0]||body.data,{'Cache-Control':'no-store'});
    }
    if(req.method==='PUT'){
      if(!body.id) return json(res,400,{error:'ID obrigatório'});
      const out=await supabase(`${table}?id=eq.${encodeURIComponent(body.id)}`,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(body.data||{})});
      return json(res,200,out?.[0]||body.data,{'Cache-Control':'no-store'});
    }
    if(req.method==='DELETE'){
      if(!body.id) return json(res,400,{error:'ID obrigatório'});
      await supabase(`${table}?id=eq.${encodeURIComponent(body.id)}`,{method:'DELETE'});
      return json(res,200,{ok:true},{'Cache-Control':'no-store'});
    }
    return json(res,405,{error:'Método não permitido'});
  }catch(e){return json(res,500,{error:e.message},{'Cache-Control':'no-store'})}
};