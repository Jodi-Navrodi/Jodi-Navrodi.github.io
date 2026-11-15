/* Only the store structure has a mobile enlargement; artwork stays noninteractive. */
(() => {
  const source = document.querySelector('.flow-sitemap-viewport > .flow-sitemap');
  const opener = document.querySelector('.flow-map-open');
  const dialog = document.querySelector('#flow-map-dialog');
  if (!source || !opener || !dialog || typeof dialog.showModal !== 'function') return;
  const scroll = dialog.querySelector('.flow-map-scroll');
  // Clone before the shared language controller records text nodes, so both maps translate.
  const enlarged = source.cloneNode(true);
  enlarged.querySelectorAll('[data-figma-text]').forEach(node => node.removeAttribute('data-figma-text'));
  scroll.append(enlarged);
  opener.addEventListener('click', () => {
    dialog.showModal();
    scroll.scrollTo(0, 0);
  });
  dialog.querySelector('.flow-map-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => opener.focus());
  const mobile = window.matchMedia('(max-width: 760px)');
  mobile.addEventListener?.('change', event => { if (!event.matches && dialog.open) dialog.close(); });
})();
