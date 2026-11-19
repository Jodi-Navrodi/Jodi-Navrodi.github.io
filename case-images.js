/* Preserve the original image element, crop, dimensions and interactive parent. */
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  document.querySelectorAll('main img[data-case-preview]').forEach(image => {
    let preview, observer, finished = false, decoding = false;
    const cached = image.complete && image.naturalWidth > 0;
    image.dataset.caseImageState = 'loading';
    const cleanup = () => {
      observer?.disconnect();
      preview?.remove();
      image.removeEventListener('load', ready);
      image.removeEventListener('error', failed);
    };
    function failed() {
      if (finished) return;
      finished = true;
      // Expose the original alt/broken-image fallback instead of an endless blur.
      image.dataset.caseImageState = 'error';
      cleanup();
    }
    async function ready() {
      if (finished || decoding) return;
      decoding = true;
      try {
        if (image.decode) await image.decode();
        if (!image.naturalWidth) throw new Error('Image unavailable');
      } catch {
        failed();
        return;
      }
      if (finished) return;
      finished = true;
      image.dataset.caseImageState = 'ready';
      const timing = performance.getEntriesByName(image.currentSrc).at(-1);
      const fromCache = cached || (timing?.transferSize === 0 && timing.decodedBodySize > 0);
      if (fromCache || motion.matches || !image.animate || !preview) {
        cleanup();
        return;
      }
      // Animate opacity only, after decoding. The full PNG is never blurred.
      const reveal = image.animate([{opacity:0},{opacity:1}], {duration:180,easing:'ease-out'});
      const hide = preview.animate([{opacity:1},{opacity:0}], {duration:180,easing:'ease-out',fill:'forwards'});
      const finish = () => {
        active.delete(finish);
        reveal.cancel();
        hide.cancel();
        cleanup();
      };
      active.add(finish);
      Promise.all([reveal.finished, hide.finished]).then(finish, finish);
    }
    image.addEventListener('load', ready);
    image.addEventListener('error', failed);
    if (cached) {ready(); return;}
    if (image.complete) {failed(); return;}
    const parent = image.parentElement;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    preview = new Image();
    preview.className = 'case-image-preview';
    preview.alt = '';
    preview.setAttribute('aria-hidden', 'true');
    preview.width = image.width;
    preview.height = image.height;
    preview.src = image.dataset.casePreview;
    const position = () => {
      const style = getComputedStyle(image);
      Object.assign(preview.style, {
        position:'absolute', left:`${image.offsetLeft}px`, top:`${image.offsetTop}px`,
        width:`${image.offsetWidth}px`, height:`${image.offsetHeight}px`,
        maxWidth:'none', margin:'0', padding:'0', border:'0',
        borderRadius:style.borderRadius, objectFit:style.objectFit,
        objectPosition:style.objectPosition, zIndex:style.zIndex
      });
    };
    image.after(preview);
    position();
    if ('ResizeObserver' in window) {
      observer = new ResizeObserver(position);
      observer.observe(image);
      observer.observe(parent);
    }
  });
  motion.addEventListener?.('change', () => {
    if (motion.matches) [...active].forEach(finish => finish());
  });
})();
