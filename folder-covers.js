// Touch devices reveal once in view. Every tap remains a direct native link.
const folderCards=[...document.querySelectorAll('.project-folder')];
const folderTouch=matchMedia('(hover:none), (pointer:coarse)');
const folderReduced=matchMedia('(prefers-reduced-motion:reduce)');
let folderObserver;
function configureFolderMotion(){
 folderObserver?.disconnect();
 folderCards.forEach(card=>card.classList.remove('folder-motion-ready','is-open'));
 if(!folderTouch.matches||folderReduced.matches||!('IntersectionObserver' in window))return;
 folderObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting)continue;
   const card=entry.target.closest('.project-folder');
   requestAnimationFrame(()=>requestAnimationFrame(()=>card.classList.add('is-open')));
   folderObserver.unobserve(entry.target);
  }
 },{threshold:.35});
 folderCards.forEach(card=>{
  card.classList.add('folder-motion-ready');
  folderObserver.observe(card.querySelector('.folder-cover'));
 });
}
configureFolderMotion();
folderTouch.addEventListener('change',configureFolderMotion);
folderReduced.addEventListener('change',configureFolderMotion);
