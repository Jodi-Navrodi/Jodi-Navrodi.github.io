/* Theme and palette are independent; both image slots commit together. */
(()=>{
 const demo=document.querySelector('[data-loca-demo]');
 if(!demo)return;
 const settings=demo.querySelector('[data-demo-settings]');
 const trip=demo.querySelector('[data-demo-trip]');
 const tripButton=demo.querySelector('.demo-trip');
 const themeButtons=[...demo.querySelectorAll('[data-theme]')];
 const accessibility=demo.querySelector('.demo-accessibility');
 const status=demo.querySelector('.demo-status');
 let desired={theme:'light',palette:'standard'},committed={...desired},request=0;
 const decoded=new Map();
 const path=(state,screen)=>`/assets/loca/demo-v4-${state.theme}-${state.palette}-${screen}.png`;
 function prepare(src){
  if(decoded.has(src))return decoded.get(src);
  const image=new Image();
  const ready=new Promise((resolve,reject)=>{
   image.onload=()=>{
    const complete=typeof image.decode==='function'?image.decode():Promise.resolve();
    complete.then(()=>resolve(image),reject);
   };
   image.onerror=()=>reject(new Error('Image unavailable'));
   image.src=src;
  }).catch(error=>{decoded.delete(src);throw error});
  decoded.set(src,ready);
  return ready;
 }
 function updateControls(){
  themeButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.theme===committed.theme)));
  accessibility.setAttribute('aria-checked',String(committed.palette==='alternate'));
 }
 function message(error=false){
  const en=document.documentElement.lang==='en';
  if(error)return en?'The screens could not be loaded. Please try switching again.':'Не удалось загрузить экраны. Попробуйте переключить ещё раз.';
  return en?
   `${committed.theme==='light'?'Light':'Dark'} theme, colour accessibility ${committed.palette==='alternate'?'on':'off'}.`:
   `${committed.theme==='light'?'Светлая':'Тёмная'} тема, цветовая доступность ${committed.palette==='alternate'?'включена':'выключена'}.`;
 }
 async function change(patch){
  desired={...desired,...patch};
  const state={...desired},ticket=++request;
  demo.setAttribute('aria-busy','true');
  try{
   const settingsSrc=path(state,'settings'),tripSrc=path(state,'trip');
   await Promise.all([prepare(settingsSrc),prepare(tripSrc)]);
   if(ticket!==request)return;
   settings.src=settingsSrc;
   trip.src=tripSrc;
   tripButton.dataset.image=tripSrc;
   committed=state;
   updateControls();
   status.classList.remove('is-error');
   status.textContent=message();
  }catch{
   if(ticket!==request)return;
   desired={...committed};
   status.classList.add('is-error');
   status.textContent=message(true);
  }finally{
   if(ticket===request)demo.setAttribute('aria-busy','false');
  }
 }
 themeButtons.forEach(button=>button.addEventListener('click',()=>change({theme:button.dataset.theme})));
 accessibility.addEventListener('click',()=>change({palette:desired.palette==='standard'?'alternate':'standard'}));
 document.addEventListener('portfolio:languagechange',()=>{
  if(status.textContent)status.textContent=message(status.classList.contains('is-error'));
 });
 function preload(){
  for(const theme of ['light','dark'])for(const palette of ['standard','alternate']){
   for(const screen of ['settings','trip'])prepare(path({theme,palette},screen)).catch(()=>{});
  }
 }
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();preload()}
  },{rootMargin:'400px'});
  observer.observe(demo);
 }else preload();
})();
