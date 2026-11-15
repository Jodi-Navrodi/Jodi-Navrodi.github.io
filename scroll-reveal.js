/* Progressive enhancement: content is visible without JS, observers or animation support. */
(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const selector = [
    '.home .project', '.home .section-heading', '.home .job',
    '.home .approach', '.home .personal-journal',
    '.case-page .chapter-copy', '.case-page .mobile-gallery',
    '.case-page .chapter-media', '.case-page .agro-hero',
    '.case-page .agro-interface', '.case-page .agro-diagram',
    '.case-page .case-figure', '.case-page .appearance-demo',
    '.case-page .inspection-comparison', '.case-page .flowey-hero',
    '.case-page .wide-art', '.case-page .responsive-comparison',
    '.case-page .next-project-card'
  ].join(',');
  const candidates = [...document.querySelectorAll(selector)];
  const targets = candidates.filter(element =>
    !candidates.some(parent => parent !== element && parent.contains(element))
  );
  const seen = new WeakSet();
  const active = new Map();
  let observer;
  const tokens = getComputedStyle(document.documentElement);
  const duration = parseFloat(tokens.getPropertyValue('--motion-duration')) || 560;
  const easing = tokens.getPropertyValue('--motion-ease').trim() || 'ease-out';

  function finish(element) {
    active.get(element)?.cancel();
    active.delete(element);
  }

  function anchorIsInside(element) {
    if (!location.hash) return false;
    try {
      const anchor = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      // Heading groups live inside the section used by navigation links.
      return !!anchor && (element.contains(anchor) || anchor.contains(element));
    } catch { return false; }
  }

  function start() {
    observer?.disconnect();
    active.forEach(animation => animation.cancel());
    active.clear();
    if (preference.matches) return;

    observer = new IntersectionObserver(entries => {
      for (const {target, isIntersecting} of entries) {
        if (!isIntersecting) continue;
        observer.unobserve(target);
        if (seen.has(target)) continue;
        seen.add(target);
        const rect = target.getBoundingClientRect();
        // Fast scrolling, anchor navigation and keyboard focus must never conceal content.
        if (preference.matches || rect.bottom <= 0 || rect.top < 0 ||
            target.contains(document.activeElement) || anchorIsInside(target)) continue;
        try {
          const animation = target.animate([
            {opacity:0, transform:'translateY(18px)'},
            {opacity:1, transform:'translateY(0)'}
          ], {duration, easing, fill:'none'});
          active.set(target, animation);
          animation.finished.then(() => active.delete(target), () => active.delete(target));
        } catch { /* Native content remains visible if animation is unavailable. */ }
      }
    }, {threshold:0, rootMargin:'0px 0px -32px 0px'});

    for (const target of targets) {
      if (seen.has(target)) continue;
      const rect = target.getBoundingClientRect();
      // No load animation on the hero or content already reached before this script runs.
      if (rect.top < window.innerHeight) seen.add(target);
      else observer.observe(target);
    }
  }

  document.addEventListener('focusin', event => {
    active.forEach((animation, element) => {
      if (element.contains(event.target)) finish(element);
    });
  });
  window.addEventListener('hashchange', () => {
    active.forEach((animation, element) => {
      if (anchorIsInside(element)) finish(element);
    });
  });
  window.addEventListener('pageshow', () => {
    active.forEach((animation, element) => finish(element));
  });
  preference.addEventListener?.('change', start);
  start();
})();
