// Desktop: intentional hover. Touch: one focused preview, without a start delay.
(() => {
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const hover=window.matchMedia('(hover: hover) and (pointer: fine)');
 let focusedPreview=null,scheduled=false;
 const previews=[...document.querySelectorAll('[data-hover-scroll]')].map(button=>{
  const track=button.querySelector('.phone-scroll-track');
  const viewport=button.querySelector('.phone-scroll-window');
  let timer=null,animation=null,inside=false,mobileFocused=false;
  let lastWidth=viewport.clientWidth,lastHeight=viewport.clientHeight;
  function clearDelay(){if(timer!==null){clearTimeout(timer);timer=null;}}
  function moveTo(y,duration,easing){
   const current=getComputedStyle(track).transform;
   if(animation){animation.cancel();animation=null;}
   const target=`translate3d(0,${y}px,0)`;
   track.style.transform=target;
   if(!duration||!track.animate)return;
   const running=track.animate([{transform:current==='none'?'translate3d(0,0,0)':current},{transform:target}],{duration,easing,fill:'both'});
   animation=running;
   running.onfinish=()=>{if(animation!==running)return;running.cancel();animation=null;};
  }
  function reset(instant=false){clearDelay();moveTo(0,instant||reduced.matches?0:1200,'cubic-bezier(.22,.61,.36,1)');}
  function play(){
   const distance=Math.max(0,track.offsetHeight-viewport.clientHeight);
   if(distance)moveTo(-distance,Math.min(45000,Math.max(6000,distance/48*1000)),'linear');
  }
  function freeze(){
   clearDelay();
   const current=getComputedStyle(track).transform;
   if(animation){animation.cancel();animation=null;}
   track.style.transform=current==='none'?'translate3d(0,0,0)':current;
  }
  function begin(){
   clearDelay();
   if(!inside||reduced.matches||!hover.matches)return;
   timer=setTimeout(()=>{
    timer=null;
    if(!inside||reduced.matches||!hover.matches)return;
    play();
   },550);
  }
  const preview={
   button,
   focus(value){
    if(value===mobileFocused)return;
    mobileFocused=value;
    if(value){reset(true);play();}else freeze();
   },
   preference(){mobileFocused=false;reset(true);if(inside)begin();},
   suspend(){inside=false;if(mobileFocused){mobileFocused=false;freeze();}else reset(true);}
  };
  button.addEventListener('pointerenter',event=>{if(event.pointerType==='touch'||!hover.matches)return;inside=true;begin();});
  button.addEventListener('pointerleave',event=>{if(event.pointerType==='touch'||!hover.matches)return;inside=false;reset();});
  button.addEventListener('pointercancel',event=>{if(event.pointerType==='touch'||!hover.matches)return;inside=false;reset(true);});
  button.addEventListener('click',()=>{
   inside=false;mobileFocused=false;reset(true);
   if(focusedPreview===preview)focusedPreview=null;
   scheduleFocus();
  });
  if(window.ResizeObserver)new ResizeObserver(()=>{
   if(viewport.clientWidth===lastWidth&&viewport.clientHeight===lastHeight)return;
   lastWidth=viewport.clientWidth;lastHeight=viewport.clientHeight;
   reset(true);if(mobileFocused&&!reduced.matches&&!hover.matches&&!document.hidden)play();
   scheduleFocus();
  }).observe(viewport);
  return preview;
 });
 function updateFocus(){
  scheduled=false;
  let next=null,nearest=Infinity;
  if(!hover.matches&&!reduced.matches&&!document.hidden&&!document.querySelector('dialog[open]')){
   const visual=window.visualViewport;
   let top=visual?.offsetTop||0;
   const bottom=top+(visual?.height||window.innerHeight);
   const header=document.querySelector('.site-header')?.getBoundingClientRect();
   if(header&&header.bottom>top&&header.top<bottom)top=Math.max(top,header.bottom);
   const nav=document.querySelector('.case-nav')?.getBoundingClientRect();
   if(nav&&nav.top<=top+2&&nav.bottom>top)top=Math.max(top,nav.bottom);
   const center=(top+bottom)/2;
   for(const preview of previews){
    const rect=preview.button.getBoundingClientRect();
    const visible=Math.max(0,Math.min(rect.bottom,bottom)-Math.max(rect.top,top));
    if(rect.height<=0||visible<Math.min(rect.height,bottom-top)*.45||rect.top>center||rect.bottom<center)continue;
    const distance=Math.abs((rect.top+rect.bottom)/2-center);
    if(distance<nearest){nearest=distance;next=preview;}
   }
  }
  if(next===focusedPreview)return;
  focusedPreview?.focus(false);
  focusedPreview=next;
  focusedPreview?.focus(true);
 }
 function scheduleFocus(){if(!scheduled){scheduled=true;requestAnimationFrame(updateFocus);}}
 function onPreference(){
  focusedPreview=null;
  previews.forEach(preview=>preview.preference());
  scheduleFocus();
 }
 reduced.addEventListener('change',onPreference);
 hover.addEventListener('change',onPreference);
 window.addEventListener('scroll',scheduleFocus,{passive:true});
 window.addEventListener('resize',scheduleFocus,{passive:true});
 window.visualViewport?.addEventListener('resize',scheduleFocus,{passive:true});
 window.visualViewport?.addEventListener('scroll',scheduleFocus,{passive:true});
 document.addEventListener('visibilitychange',()=>{
  if(document.hidden){previews.forEach(preview=>preview.suspend());focusedPreview=null;}
  scheduleFocus();
 });
 document.querySelector('#viewer')?.addEventListener('close',scheduleFocus);
 scheduleFocus();
})();
