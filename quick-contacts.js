/* Shared contact catalogue, supplied SVG icons and dropdown component. */
(() => {
  if (document.querySelector('[data-quick-contacts]')) return;
  const header = document.querySelector('.site-header-inner');
  const main = document.querySelector('main');
  if (!header || !main) return;
  // Document language is always chosen by the visitor, never by the site locale.
  const resumes = [
    {lang:'ru', labels:{ru:'На русском', en:'In Russian'}, href:'/assets/evgeniya-khrenova-cv-ru.pdf?v=afa895e512cb'},
    {lang:'en', labels:{ru:'На английском', en:'In English'}, href:'/assets/evgeniya-khrenova-cv-en.pdf?v=892343059786'}
  ];
  const catalogue = {
    resume:{ru:'Резюме / CV', en:'Резюме / CV'},
    mail:{href:'mailto:evgeniya_hrenova@bk.ru', ru:'Почта', en:'Email'},
    telegram:{href:'https://t.me/jodi_n', ru:'Telegram', en:'Telegram', external:true},
    linkedin:{href:'https://www.linkedin.com/in/evgeniya-khrenova-600375227/', ru:'LinkedIn', en:'LinkedIn', external:true},
    behance:{href:'https://www.behance.net/jodi_khr', ru:'Behance', en:'Behance', external:true}
  };
  const railItems = ['resume', 'mail', 'telegram'];
  const contactItems = ['mail', 'telegram', 'linkedin'];
  const icon = key => `<span class="contact-icon contact-icon--${key}" aria-hidden="true"></span>`;
  const renderResumeLinks = () => resumes.map(file => `<a href="${file.href}" data-resume-language="${file.lang}" target="_blank" rel="noopener noreferrer" hreflang="${file.lang}">${file.labels[document.documentElement.lang === 'en' ? 'en' : 'ru']}</a>`).join('');
  const renderLinks = keys => keys.map(key => {
    const item = catalogue[key];
    if (key === 'resume') {
      return `<button type="button" data-contact="resume">${icon(key)}<span class="quick-contacts-label"></span></button>`;
    }
    return `<a href="${item.href}" data-contact="${key}"${item.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${icon(key)}<span class="quick-contacts-label"></span></a>`;
  }).join('');
  const style = document.createElement('style');
  style.textContent = `
    .contact-icon{display:block;flex:none;width:18px;height:18px;background:currentColor;mask:var(--contact-icon) center/contain no-repeat;-webkit-mask:var(--contact-icon) center/contain no-repeat}
    ${Object.keys(catalogue).map(key => `.contact-icon--${key}{--contact-icon:url('/assets/icons/${key}.svg')}`).join('\n')}
    .quick-contacts{box-sizing:border-box;z-index:40;font-family:var(--font-ui);color:var(--ink);background:#f7f7f9;border:1px solid var(--line);box-shadow:0 4px 18px #1616180c;border-radius:16px}
    .quick-contacts[hidden],.contact-dropdown[hidden]{display:none!important}
    .quick-contacts :is(a,button){position:relative;box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:100%;padding:0;border:0;background:transparent;color:inherit;font:inherit;text-decoration:none;border-radius:11px;min-height:44px;outline-offset:3px}
    .quick-contacts :is(a,button):hover,.quick-contacts :is(a,button):focus-visible{background:#eaeaed}
    .quick-contacts :is(a,button):focus-visible,.contact-dropdown a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
    .quick-contacts--rail{position:fixed;right:20px;top:50%;transform:translateY(-50%);width:48px;padding:3px}
    .quick-contacts--rail .quick-contacts-label{position:absolute;right:calc(100% + 12px);top:50%;transform:translateY(-50%);display:block;white-space:nowrap;padding:7px 8px;border-radius:8px;background:#242426;color:#fff;font-size:14px;line-height:1.4;letter-spacing:0;opacity:0;visibility:hidden;pointer-events:none;transition:opacity 120ms}
    .quick-contacts--rail :is(a,button):hover .quick-contacts-label,.quick-contacts--rail :is(a,button):focus-visible .quick-contacts-label{opacity:1;visibility:visible}
    .quick-contacts--rail button[aria-expanded=true] .quick-contacts-label{opacity:0;visibility:hidden}
    .contact-dropdown{box-sizing:border-box;z-index:40;width:208px;max-width:calc(100vw - 24px);padding:6px;border:1px solid var(--line);border-radius:var(--radius-control);background:#f7f7f9;color:var(--ink);box-shadow:0 4px 18px #1616180c}
    .contact-dropdown a{box-sizing:border-box;display:flex;align-items:center;justify-content:flex-start;gap:12px;min-height:44px;padding:10px 12px;border-radius:11px;color:inherit;font-size:14px;line-height:1.4;text-decoration:none}
    .contact-dropdown a:hover,.contact-dropdown a:focus-visible{background:#eaeaed}
    .contact-dropdown--header{position:fixed;left:var(--contact-menu-left);top:var(--contact-menu-top);max-height:var(--contact-menu-height);overflow:auto}
    .contact-menu .contact-dropdown{position:absolute;top:calc(100% + 8px);left:var(--contact-menu-offset,0px)}
    .resume-menu{position:relative}
    .contact-dropdown--inline{position:absolute;top:calc(100% + 8px);left:var(--contact-menu-offset,0px)}
    @media(max-width:359px){.intro-links:has(.resume-menu){flex-wrap:wrap}}
    .header-control-icon{display:none}
    .site-header-inner>.name{display:inline-flex;align-items:center;gap:.25em;min-height:44px}
    .header-menu-toggle{display:none}
    .quick-contacts-trigger[aria-expanded=true]{color:var(--accent);opacity:1}
    .header-resume-trigger[aria-expanded=true]{color:var(--accent);opacity:1}
    .mobile-navigation{padding:12px 19px 16px;display:grid;gap:12px;background:var(--paper);overscroll-behavior:contain}
    .mobile-navigation a{min-height:44px;font-size:16px;line-height:1.4;padding-block:8px}
    .mobile-nav-pages{display:grid}
    .mobile-nav-pages a{font-weight:500}
    .mobile-navigation>section{border-top:1px solid var(--line);padding-top:12px}
    .mobile-navigation h2{margin:0 0 2px;font-size:var(--text-small);font-weight:400;line-height:1.4;color:var(--muted)}
    .mobile-resume-links{display:grid;gap:0}
    .mobile-resume-links a{justify-content:space-between;white-space:nowrap}
    .mobile-resume-links a::after{content:"";display:block;flex:none;width:14px;height:14px;background:currentColor;mask:url('/assets/icons/arrow-up-right.svg') center/contain no-repeat;-webkit-mask:url('/assets/icons/arrow-up-right.svg') center/contain no-repeat}
    .mobile-contact-icons{display:flex;gap:8px;margin-top:8px}
    .mobile-contact-icons a{position:relative;justify-content:center;width:44px;height:44px;padding:0;background:var(--surface);border-radius:var(--radius-control)}
    .mobile-contact-icons .quick-contacts-label{position:absolute;width:1px;height:1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
    .header-menu-mark{--contact-icon:url('/assets/icons/menu.svg')}
    .header-menu-toggle[aria-expanded=true] .header-menu-mark{--contact-icon:url('/assets/icons/close.svg')}
    .header-menu-toggle[aria-expanded=true]{background:var(--surface)!important}
    .mobile-menu-backdrop{position:fixed;inset:var(--mobile-header-bottom) 0 0;z-index:29;background:var(--ink);opacity:.17}
    .mobile-menu-backdrop[hidden]{display:none}
    body:has(.mobile-menu-backdrop:not([hidden])){overflow:hidden}
    @media(max-width:840px){
      .site-header-inner{display:grid;grid-template-columns:44px minmax(0,1fr) 44px 44px auto;gap:3px;width:calc(100% - 16px)}
      .site-header-inner>nav{display:none}
      .site-header-inner>.header-menu-toggle{grid-column:1;display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;padding:0;border:0;border-radius:var(--radius-control);background:transparent}
      .site-header-inner>.name{grid-column:2;flex-direction:column;align-items:flex-start;justify-content:center;gap:0;min-width:0;min-height:44px;font-size:14px;line-height:1.1;white-space:nowrap}
      .site-header-inner>.header-resume-trigger{grid-column:3}
      .site-header-inner>.quick-contacts-trigger{grid-column:4}
      .site-header-inner>:is(.quick-contacts-trigger,.header-resume-trigger){display:flex;align-items:center;justify-content:center;flex:none;width:44px;height:44px;padding:0;border-radius:var(--radius-control)}
      .site-header-inner>:is(.quick-contacts-trigger,.header-resume-trigger,.header-menu-toggle):hover{background:var(--surface)}
      .site-header-inner>:is(.quick-contacts-trigger,.header-resume-trigger) .menu-label{display:none}
      .site-header-inner>:is(.quick-contacts-trigger,.header-resume-trigger) .header-control-icon{display:block}
      .site-header-inner>.language-switch{grid-column:5;gap:2px;padding:3px}
      .site-header-inner>.language-switch button{min-width:32px;height:32px;padding:0 6px}
    }
    @media(min-width:360px) and (max-width:840px){.site-header-inner{width:calc(100% - 32px);gap:4px}.site-header-inner>.name{margin-left:12px}}
    @media(prefers-reduced-motion:reduce){.quick-contacts-label{transition:none!important}}
  `;
  document.head.append(style);
  const rail = document.createElement('nav');
  rail.id = 'quick-contacts';
  rail.dataset.quickContacts = '';
  rail.className = 'quick-contacts quick-contacts--rail';
  rail.style.visibility = 'hidden';
  rail.innerHTML = renderLinks(railItems);
  document.body.append(rail);
  let trigger = header.querySelector('nav a[href$="#contacts"]');
  if (!trigger) {
    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.innerHTML = '<span class="menu-label"></span>';
    header.insertBefore(trigger, header.querySelector('.language-switch'));
  }
  const headerNav = header.querySelector('nav');
  const brand = header.querySelector('.name');
  brand.innerHTML = '<span data-brand-first></span> <span data-brand-last></span>';
  trigger.classList.add('quick-contacts-trigger');
  const triggerIcon = document.createElement('span');
  triggerIcon.className = 'header-control-icon';
  triggerIcon.innerHTML = icon('mail');
  trigger.append(triggerIcon);
  const headerResume = document.createElement('a');
  headerResume.className = 'header-resume-trigger';
  headerResume.href = resumes[0].href;
  headerResume.innerHTML = `<span class="menu-label" data-header-resume></span><span class="header-control-icon">${icon('resume')}</span>`;
  headerNav.append(headerResume);
  const menuToggle = document.createElement('button');
  menuToggle.type = 'button';
  menuToggle.className = 'header-menu-toggle';
  menuToggle.innerHTML = '<span class="contact-icon header-menu-mark" aria-hidden="true"></span>';
  header.insertBefore(menuToggle, brand);
  const mobileBackdrop = document.createElement('div');
  mobileBackdrop.className = 'mobile-menu-backdrop';
  mobileBackdrop.hidden = true;
  mobileBackdrop.setAttribute('aria-hidden', 'true');
  document.body.append(mobileBackdrop);
  const dropdowns = [];
  let activeMenu;
  let frame = 0;
  // Both triggers use the same rendering, localization and interaction logic.
  function createDropdown(button, keys, {id, details, container, owner, placement = 'header', resumePicker = false, markup} = {}) {
    const menu = container || document.createElement('nav');
    menu.id = id;
    // Leave the original class as a no-JS fallback only; both live menus use these styles.
    menu.classList.remove('contact-options');
    menu.classList.add('contact-dropdown');
    if (owner) menu.classList.add('contact-dropdown--inline');
    else if (!details) menu.classList.add('contact-dropdown--header');
    if (placement === 'mobile') menu.classList.add('mobile-navigation');
    menu.innerHTML = markup ?? (resumePicker ? renderResumeLinks() : renderLinks(keys));
    menu.hidden = true;
    if (!container) (owner || document.body).append(menu);
    const record = {button, menu, details, open:false};
    dropdowns.push(record);
    button.setAttribute('aria-controls', id);
    button.setAttribute('aria-expanded', 'false');
    record.position = () => {
      if (placement === 'mobile') {
        menu.style.width = `${document.documentElement.clientWidth - 32}px`;
        mobileBackdrop.style.setProperty('--mobile-header-bottom', `${document.querySelector('.site-header').getBoundingClientRect().bottom}px`);
      }
      const width = menu.getBoundingClientRect().width;
      if (details || owner) {
        const left = (details || owner).getBoundingClientRect().left;
        menu.style.setProperty('--contact-menu-offset', `${Math.max(12, Math.min(left, document.documentElement.clientWidth - width - 12)) - left}px`);
        return;
      }
      const rect = button.getBoundingClientRect();
      const top = placement === 'rail' ? Math.max(12, Math.min(rect.top, innerHeight - menu.getBoundingClientRect().height - 12)) : document.querySelector('.site-header').getBoundingClientRect().bottom + 8;
      const left = placement === 'mobile' ? 16 : placement === 'rail' ? rect.left - width - 12 : rect.right - width;
      menu.style.setProperty('--contact-menu-left', `${Math.max(12, Math.min(left, document.documentElement.clientWidth - width - 12))}px`);
      menu.style.setProperty('--contact-menu-top', `${top}px`);
      menu.style.setProperty('--contact-menu-height', `${Math.max(44, innerHeight - top - 12)}px`);
    };
    record.setOpen = (value, restoreFocus = false) => {
      if (value && activeMenu && activeMenu !== record) activeMenu.setOpen(false);
      record.open = value;
      if (details) details.open = value;
      menu.hidden = !value;
      if (placement === 'mobile') mobileBackdrop.hidden = !value;
      button.setAttribute('aria-expanded', String(value));
      if (value) {activeMenu = record; record.position();}
      else if (activeMenu === record) activeMenu = undefined;
      if (restoreFocus) button.focus({preventScroll:true});
    };
    button.addEventListener('click', event => {
      event.preventDefault();
      record.setOpen(!record.open);
      if (record.open) menu.querySelector('a').focus({preventScroll:true});
    });
    button.addEventListener('keydown', event => {
      if (![' ', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      record.setOpen(true);
      menu.querySelector('a').focus({preventScroll:true});
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) record.setOpen(false);
    });
    return record;
  }
  createDropdown(trigger, contactItems, {id:'contacts-dropdown'});
  createDropdown(headerResume, [], {id:'header-resume-dropdown', resumePicker:true});
  const mobileMenu = createDropdown(menuToggle, [], {
    id:'mobile-navigation', placement:'mobile',
    markup:`<div class="mobile-nav-pages"><a href="/#projects"><span data-mobile-label="projects"></span></a><a href="/#experience"><span data-mobile-label="experience"></span></a></div>
      <section><h2 data-mobile-label="resume"></h2><div class="mobile-resume-links">${renderResumeLinks()}</div></section>
      <section><h2 data-mobile-label="contacts"></h2><div class="mobile-contact-icons">${renderLinks(['mail','telegram','behance'])}</div></section>`
  });
  const heroDetails = document.querySelector('.contact-menu');
  if (heroDetails) createDropdown(heroDetails.querySelector('summary'), ['mail', 'telegram', 'linkedin'], {
    id:'connect-dropdown', details:heroDetails, container:heroDetails.querySelector('.contact-options')
  });
  const railResume = rail.querySelector('[data-contact="resume"]');
  const railResumeMenu = createDropdown(railResume, [], {id:'rail-resume-dropdown', placement:'rail', resumePicker:true});
  const resumeLink = document.querySelector('.intro-links > a.action');
  if (resumeLink) {
    const owner = document.createElement('div');
    owner.className = 'resume-menu';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = resumeLink.className;
    button.textContent = document.documentElement.lang === 'en' ? 'CV' : 'Резюме';
    resumeLink.replaceWith(owner);
    owner.append(button);
    createDropdown(button, [], {id:'hero-resume-dropdown', owner, resumePicker:true});
  }
  function layout() {
    frame = 0;
    // Keep the rail's geometry and existing tooltip-aware gutter check unchanged.
    rail.hidden = false;
    const rect = rail.getBoundingClientRect();
    const tooltipLeft = Math.min(...[...rail.querySelectorAll('.quick-contacts-label')].map(label => label.getBoundingClientRect().left));
    const contentRight = Math.max(main.getBoundingClientRect().right, ...[...main.querySelectorAll('.agro-hero-art,.flow-hero-art,.wide-art,.chapter-media')].map(element => element.getBoundingClientRect().right));
    rail.hidden = tooltipLeft < contentRight + 6 || rect.height > innerHeight - 32;
    if (rail.hidden && railResumeMenu.open) railResumeMenu.setOpen(false);
    const mobileNav = matchMedia('(max-width:840px)').matches;
    if (mobileNav && headerResume.parentElement !== header) {
      header.insertBefore(headerResume, header.querySelector('.language-switch'));
      header.insertBefore(trigger, header.querySelector('.language-switch'));
    } else if (!mobileNav && trigger.parentElement !== headerNav) {
      headerNav.append(trigger, headerResume);
    }
    if (!mobileNav && mobileMenu.open) mobileMenu.setOpen(false);
    dropdowns.forEach(record => {if (record.open) record.position();});
    rail.style.visibility = '';
  }
  function scheduleLayout() {
    if (!frame) frame = requestAnimationFrame(layout);
  }
  function localize() {
    const en = document.documentElement.lang === 'en';
    document.querySelectorAll('[data-resume-language]').forEach(link => {
      const file = resumes.find(item => item.lang === link.dataset.resumeLanguage);
      const label = file.labels[en ? 'en' : 'ru'];
      link.textContent = label;
      link.lang = en ? 'en' : 'ru';
      link.setAttribute('aria-label', `${en ? 'CV' : 'Резюме'} — ${label}`);
    });
    const name = en ? ['Evgeniya','Khrenova'] : ['Евгения','Хренова'];
    brand.querySelector('[data-brand-first]').textContent = name[0];
    brand.querySelector('[data-brand-last]').textContent = name[1];
    brand.setAttribute('aria-label', name.join(' '));
    const labels = en ? {projects:'Projects',experience:'Experience',resume:'CV',contacts:'Contacts'} : {projects:'Проекты',experience:'Опыт',resume:'Резюме',contacts:'Контакты'};
    mobileMenu.menu.querySelectorAll('[data-mobile-label]').forEach(label => {label.textContent = labels[label.dataset.mobileLabel];});
    headerResume.querySelector('[data-header-resume]').textContent = en ? 'CV' : 'Резюме';
    headerResume.setAttribute('aria-label', en ? 'CV' : 'Резюме');
    menuToggle.setAttribute('aria-label', en ? 'Menu' : 'Меню');
    rail.setAttribute('aria-label', en ? 'Quick contacts' : 'Быстрые контакты');
    [rail, ...dropdowns.map(record => record.menu)].forEach(menu => {
      menu.querySelectorAll('[data-contact]').forEach(link => {
        const label = link.dataset.contact === 'resume' && menu === rail ? (en ? 'Resume' : 'Резюме') : catalogue[link.dataset.contact][en ? 'en' : 'ru'];
        link.querySelector('.quick-contacts-label').textContent = label;
        link.setAttribute('aria-label', label);
      });
    });
    dropdowns.forEach(record => record.menu.setAttribute('aria-label', en ? 'Contact links' : 'Ссылки для связи'));
    mobileMenu.menu.setAttribute('aria-label', en ? 'Mobile navigation' : 'Мобильная навигация');
    trigger.setAttribute('aria-label', en ? 'Contacts' : 'Контакты');
    const resumeButton = document.querySelector('.resume-menu button');
    if (resumeButton) resumeButton.textContent = en ? 'CV' : 'Резюме';
    trigger.querySelector('.menu-label').textContent = labels.contacts;
    scheduleLayout();
  }
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && activeMenu) activeMenu.setOpen(false, true);
  });
  document.addEventListener('click', event => {
    if (activeMenu && !activeMenu.menu.contains(event.target) && !activeMenu.button.contains(event.target)) activeMenu.setOpen(false);
  });
  document.addEventListener('focusin', event => {
    if (activeMenu && !activeMenu.menu.contains(event.target) && !activeMenu.button.contains(event.target)) activeMenu.setOpen(false);
  });
  heroDetails?.addEventListener('toggle', () => {
    const record = dropdowns.find(item => item.details === heroDetails);
    if (!heroDetails.open && record.open) record.setOpen(false);
  });
  document.addEventListener('portfolio:languagechange', localize);
  window.addEventListener('resize', scheduleLayout, {passive:true});
  if ('ResizeObserver' in window) new ResizeObserver(scheduleLayout).observe(main);
  document.fonts?.ready.then(scheduleLayout);
  window.initializeMenuHover?.(header);
  localize();
})();
