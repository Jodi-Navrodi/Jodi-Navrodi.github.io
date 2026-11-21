const translations={"t1":{"ru":"Аграрная B2B-платформа с ролевыми кабинетами для управления производством, закупками и торговлей","en":"An agricultural B2B platform with role-based workspaces for managing production, procurement and trade"},"t2":{"ru":"B2B","en":"B2B"},"t3":{"ru":"Web Platform","en":"Web Platform"},"t4":{"ru":"In Development","en":"In Development"},"t5":{"ru":"Мобильное приложение о крипторынке: новости, рыночная аналитика, личная библиотека и оффлайн-чтение","en":"A mobile app about crypto markets: news, market analysis, a personal library and offline reading"},"t6":{"ru":"B2C","en":"B2C"},"t7":{"ru":"Mobile App","en":"Mobile App"},"t8":{"ru":"Digital Media","en":"Digital Media"},"t9":{"ru":"Мобильное приложение городского каршеринга с полным сценарием аренды и альтернативной палитрой","en":"An urban car-sharing app with a complete rental journey and an alternative colour palette"},"t10":{"ru":"Mobile App","en":"Mobile App"},"t11":{"ru":"Car Sharing","en":"Car Sharing"},"t12":{"ru":"Accessibility","en":"Accessibility"},"t13":{"ru":"Адаптивный интернет-магазин флористической студии с доставкой авторских букетов по городу","en":"A responsive online store for a floral studio offering citywide delivery of signature bouquets"},"t14":{"ru":"E-commerce","en":"E-commerce"},"t15":{"ru":"Responsive Web","en":"Responsive Web"},"t16":{"ru":"Checkout","en":"Checkout"},"t17":{"ru":"2026 — 2026","en":"2026 — 2026"},"t18":{"ru":"Спроектировала ролевые интерфейсы аграрной B2B-платформы, разработала общие компоненты и сопровождала реализацию. Передала в разработку интерфейсы 6 пользовательских ролей и 3 back-office кабинетов","en":"Designed role-based interfaces for an agricultural B2B platform, developed shared components and supported implementation. Handed off interfaces for 6 user roles and 3 back-office workspaces"},"t19":{"ru":"2025 — 2026","en":"2025 — 2026"},"t20":{"ru":"Проектировала сайты и веб-интерфейсы: информационную архитектуру, пользовательские сценарии и визуальную систему. Готовила адаптивные макеты и компоненты для передачи в разработку","en":"Designed websites and web interfaces, including information architecture, user journeys and visual systems. Prepared responsive layouts and components for development handoff"},"t21":{"ru":"2022 — 2026","en":"2022 — 2026"},"t22":{"ru":"Отвечала за визуальную систему медиа с потоком 30–50 материалов в день. Провела редизайн, разработала визуальный язык бренда и систему шаблонов для редакции, промо и спецпроектов","en":"Oversaw the visual system of a media outlet publishing 30–50 pieces a day. Led a redesign and developed the brand’s visual language and a template system for editorial content, promotions and special projects"},"t23":{"ru":"2020 — 2022","en":"2020 — 2022"},"t24":{"ru":"Создавала иллюстрации для издательских проектов и мобильных приложений. Разрабатывала рекламную графику и промоматериалы для digital-проектов","en":"Created illustrations for publishing projects and mobile apps. Designed advertising graphics and promotional materials for digital projects"},"t25":{"ru":"К проектам","en":"Skip to projects"},"t26":{"ru":"Евгения Хренова","en":"Evgeniya Khrenova"},"t27":{"ru":"Проекты","en":"Projects"},"t28":{"ru":"Опыт","en":"Experience"},"t29":{"ru":"Контакты","en":"Contact"},"t30":{"ru":"Проектирую интерфейсы для веб и мобильных продуктов","en":"I design interfaces for web and mobile products"},"t31":{"ru":"Разбираюсь в сложной логике, выстраиваю сценарии и довожу решения до согласованного интерфейса","en":"I untangle complex logic, map user journeys and develop solutions into a coherent interface"},"t33":{"ru":"Связаться","en":"Get in touch"},"t34":{"ru":"Почта","en":"Email"},"t35":{"ru":"Опыт работы","en":"Experience"},"t36":{"ru":"Шесть лет в визуальном дизайне","en":"Six years in visual design"},"t37":{"ru":"Теперь применяю этот опыт в продуктах и интерфейсах)","en":"Now bringing that experience to products and interfaces)"},"t38":{"ru":"Умею разложить сложное на понятные действия","en":"I turn complexity into clear actions"},"t39":{"ru":"Связываю сценарии, состояния и компоненты в последовательную систему","en":"I connect journeys, states and components into a coherent system"},"t40":{"ru":"Вне макетов","en":"Beyond the layouts"},"t41":{"ru":"Люблю долгие походы и уютные вечера дома, сложные игры и кропотливое рукоделие","en":"I love long hikes and cosy evenings at home, challenging games and intricate crafts"},"t42":{"ru":"А ещё выращиваю домашние джунгли)","en":"And I grow my own indoor jungle)"},"t44":{"ru":"Закрыть","en":"Close"},"t45":{"ru":"Back Office","en":"Back Office"},"t46":{"ru":"AgroMatrix · Проектная работа (8 мес.)","en":"AgroMatrix · Project-based work (8 months)"},"t47":{"ru":"В разработке","en":"In development"}};
window.caseTranslations=Object.assign({"Основная навигация":"Main navigation","Язык / Language":"Language","Обо мне":"About me","Евгения Хренова":"Evgeniya Khrenova","Проекты":"Projects","Мой подход":"My approach","Вне макетов":"Beyond the layouts","Места для личных фотографий":"Personal photo placeholders","Просмотр экрана проекта":"Project screen viewer","Закрыть просмотр":"Close viewer","Веб и мобильные продукты, B2B‑платформы и пользовательские сценарии.":"Web and mobile products, B2B platforms and user journeys."},window.caseTranslations||{});
const caseLanguageRecords=[];
if(window.caseTranslations){
 const normalise=value=>value.replace(/\s+/gu,' ').trim();
 const translated=value=>Object.hasOwn(window.caseTranslations,normalise(value))?window.caseTranslations[normalise(value)]:undefined;
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;
 while(node=walker.nextNode()){
  if(node.parentElement.closest('script,style,code'))continue;
  const textNode=node,ru=textNode.nodeValue,en=translated(ru);
  if(en)caseLanguageRecords.push({write:value=>{textNode.nodeValue=value},ru,en:ru.match(/^\s*/u)[0]+en+ru.match(/\s*$/u)[0]});
 }
 for(const attribute of ['aria-label','alt','data-title']){
  document.querySelectorAll('['+attribute+']').forEach(element=>{
   const ru=element.getAttribute(attribute),en=translated(ru);
   if(en)caseLanguageRecords.push({write:value=>element.setAttribute(attribute,value),ru,en});
  });
 }
 const meta=document.querySelector('meta[name="description"]');
 if(meta){const ru=meta.content,en=translated(ru);if(en)caseLanguageRecords.push({write:value=>{meta.content=value},ru,en});}
}
function setLanguage(lang){
 if(!['ru','en'].includes(lang))return;
 document.documentElement.lang=lang;
 document.querySelectorAll('[data-copy]').forEach(node=>{
  const value=translations[node.dataset.copy]?.[lang];
  if(value)node.textContent=value;
 });
 caseLanguageRecords.forEach(record=>record.write(record[lang]));
 document.querySelectorAll('[data-lang]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.lang===lang)));
 const name=lang==='en'?'Evgeniya Khrenova':'Евгения Хренова';
 document.title=document.documentElement.dataset.project?document.documentElement.dataset.project+' — '+name:name+' — UX/UI Designer';
 try{localStorage.setItem('portfolio-language',lang)}catch{}
 document.dispatchEvent(new CustomEvent('portfolio:languagechange',{detail:{language:lang}}));
}
document.querySelectorAll('[data-lang]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.lang)));
let initialLanguage='ru';
try{initialLanguage=localStorage.getItem('portfolio-language')||'ru'}catch{}
setLanguage(['ru','en'].includes(initialLanguage)?initialLanguage:'ru');
