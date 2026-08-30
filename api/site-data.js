const {json,supabase}=require('./_utils');
module.exports=async(req,res)=>{
  if(req.method!=='GET') return json(res,405,{error:'Método não permitido'});
  try{
    const [categorias,banners]=await Promise.all([
      supabase('categorias?select=*&ativo=eq.true&order=ordem.asc,created_at.asc'),
      supabase('banners?select=*&ativo=eq.true&order=ordem.asc,created_at.asc')
    ]);
    return json(res,200,{categorias:categorias||[],banners:banners||[]},{
      'Cache-Control':'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
      'CDN-Cache-Control':'no-store','Vercel-CDN-Cache-Control':'no-store','Pragma':'no-cache','Expires':'0'
    });
  }catch(e){return json(res,500,{error:e.message},{'Cache-Control':'no-store'})}
};