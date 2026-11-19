/* The line grows from the pointer's entry point and retracts towards its exit. */
(() => {
  const initialized = new WeakSet();
  function initialize(root = document) {
  root.querySelectorAll('.site-header nav a,.case-nav a,.site-footer-links a').forEach(link => {
    if (initialized.has(link)) return;
    const label = link.querySelector('.menu-label');
    if (!label) return;
    initialized.add(link);
    const setOrigin = event => {
      if (event.pointerType !== 'mouse') return;
      const {left, width} = label.getBoundingClientRect();
      if (width <= 0) return;
      const origin = Math.max(0, Math.min(100, (event.clientX - left) / width * 100));
      label.style.setProperty('--menu-origin', `${origin}%`);
    };
    link.addEventListener('pointerenter', setOrigin, {passive:true});
    link.addEventListener('pointerleave', setOrigin, {passive:true});
    link.addEventListener('focus', () => label.style.setProperty('--menu-origin', '50%'));
  });
  }
  window.initializeMenuHover = initialize;
  initialize();
})();
