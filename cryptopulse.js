// Preserve the shared screen viewer; illustrations may use its wider layout.
const cryptoViewer=document.querySelector('#viewer');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{
 cryptoViewer.classList.toggle('wide-viewer',button.hasAttribute('data-wide-image'));
}));
// The documentary video plays silently in view, and pauses off screen.
const systemVideo=document.querySelector('.system-video video');
if(systemVideo){
 systemVideo.muted=true;
 let inView=false;
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const sync=()=>{
  if(inView&&!document.hidden&&!reducedMotion.matches)systemVideo.play().catch(()=>{});
  else systemVideo.pause();
 };
 if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:.15}).observe(systemVideo);
 }else{inView=true;sync();}
 // Allow a deliberate playback choice when automatic motion is disabled.
 const updateMotion=()=>{systemVideo.controls=reducedMotion.matches;sync();};
 reducedMotion.addEventListener?.('change',updateMotion);
 updateMotion();
 document.addEventListener('visibilitychange',sync);
}
