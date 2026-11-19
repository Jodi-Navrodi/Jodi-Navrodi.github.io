/* Shared footer markup, destinations and styles for the homepage and all cases. */
(() => {
  const footer = document.querySelector('footer[data-site-footer]');
  if (!footer || footer.dataset.footerReady) return;
  footer.dataset.footerReady = 'true';
  footer.classList.add('site-footer');
  const links = [
    {href:'mailto:evgeniya_hrenova@bk.ru', label:'Почта', mail:true},
    {href:'https://t.me/jodi_n', label:'Telegram'},
    {href:'https://www.linkedin.com/in/evgeniya-khrenova-600375227/', label:'LinkedIn'},
    {href:'https://www.behance.net/jodi_khr', label:'Behance'}
  ];
  footer.innerHTML = `<nav class="site-footer-links">${links.map(link => `<a href="${link.href}"${link.mail ? '' : ' target="_blank" rel="noopener noreferrer"'}><span class="menu-label"${link.mail ? ' data-footer-mail' : ''}>${link.label}</span></a>`).join('')}</nav><p class="copyright">© 2026</p>`;
  const style = document.createElement('style');
  style.textContent = `
    .site-footer{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px 32px;padding:16px 0;border-top:1px solid var(--line)}
    .site-footer-links{display:flex;align-items:center;flex-wrap:wrap;gap:4px 24px}
    .site-footer-links a{display:inline-flex;align-items:center;min-height:44px;font-size:var(--text-small);line-height:1.4;color:var(--body);text-decoration:none}
    .site-footer .copyright{padding:0;flex-shrink:0}
  `;
  document.head.append(style);
  function localize() {
    const en = document.documentElement.lang === 'en';
    footer.querySelector('nav').setAttribute('aria-label', en ? 'Contacts' : 'Контакты');
    footer.querySelector('[data-footer-mail]').textContent = en ? 'Email' : 'Почта';
  }
  document.addEventListener('portfolio:languagechange', localize);
  localize();
})();
