/* Progressive enhancement. Native cursor is hidden only while a mouse-driven custom one is visible. */
(() => {
  if (!window.matchMedia || !window.requestAnimationFrame) return;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const contrast = window.matchMedia('(forced-colors: active)');
  const root = document.documentElement;
  const interactiveSelector = [
    'a[href]', 'area[href]', 'button', 'summary', 'label[for]',
    '[role="button"]', '[role="link"]', '[role="tab"]', '[role="checkbox"]',
    '[role="radio"]', '[role="switch"]', '[role="menuitem"]', '[role="option"]',
    '[role="slider"]', '[role="spinbutton"]', '[role="treeitem"]',
    '[tabindex]:not([tabindex="-1"])', '[data-cursor="interactive"]'
  ].join(',');
  const nativeSelector = 'input,textarea,select,iframe,video[controls],audio[controls],[contenteditable]:not([contenteditable="false"]),[data-cursor="native"]';
  const host = document.createElement('div');
  host.className = 'portfolio-cursor';
  host.setAttribute('aria-hidden', 'true');
  const ring = document.createElement('span');
  const dot = document.createElement('span');
  ring.className = 'portfolio-cursor__ring';
  dot.className = 'portfolio-cursor__dot';
  host.append(ring, dot);
  document.body.append(host);

  let visible = false, pressed = false, frame = 0, lastTime = 0;
  let cursorTarget, authoredCursor;
  let x = 0, y = 0, dotX = 0, dotY = 0, ringX = 0, ringY = 0;
  const enabled = () => fine.matches && !reduced.matches && !contrast.matches;

  function hide() {
    visible = false;
    pressed = false;
    root.classList.remove('portfolio-cursor-visible');
    host.classList.remove('is-visible', 'is-interactive', 'is-pressed');
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
  }

  function isInteractive(target) {
    if (target.closest('[inert],[disabled],[aria-disabled="true"]')) return false;
    const control = target.closest(interactiveSelector);
    if (control) return !control.matches(':disabled') && !control.control?.disabled;
    // Check custom CSS targets only when entering one, not on every mouse movement.
    if (cursorTarget !== target) {
      root.classList.remove('portfolio-cursor-visible');
      authoredCursor = getComputedStyle(target).cursor;
      cursorTarget = target;
    }
    return /^(pointer|zoom-in|zoom-out|grab|grabbing)$/.test(authoredCursor);
  }

  function paint() {
    dot.style.transform = `translate3d(${dotX}px,${dotY}px,0)`;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
  }

  function tick(time) {
    frame = 0;
    if (!visible) return;
    const delta = lastTime ? Math.min(time - lastTime, 64) : 1000 / 60;
    lastTime = time;
    // Time-based smoothing keeps the same feel on 60 Hz and high-refresh screens.
    const dotStep = 1 - Math.pow(.5, delta / (1000 / 60));
    const ringStep = 1 - Math.pow(.85, delta / (1000 / 60));
    dotX += (x - dotX) * dotStep;
    dotY += (y - dotY) * dotStep;
    ringX += (x - ringX) * ringStep;
    ringY += (y - ringY) * ringStep;
    const moving = Math.max(Math.abs(x - dotX), Math.abs(y - dotY), Math.abs(x - ringX), Math.abs(y - ringY)) > .08;
    if (!moving) { dotX = ringX = x; dotY = ringY = y; }
    paint();
    if (moving) frame = requestAnimationFrame(tick);
    else lastTime = 0;
  }

  function update(target) {
    if (!enabled() || !(target instanceof Element) ||
        x < 0 || y < 0 || x >= root.clientWidth || y >= window.innerHeight ||
        target.closest(nativeSelector)) { hide(); return; }

    // A normal z-index cannot appear above the dialog top layer.
    const surface = document.querySelector('dialog[open]') || document.body;
    if (host.parentElement !== surface) surface.append(host);

    const interactive = isInteractive(target);
    host.classList.toggle('is-interactive', interactive);
    host.classList.toggle('is-pressed', interactive && pressed);
    if (!visible) {
      dotX = ringX = x;
      dotY = ringY = y;
      paint();
    }
    visible = true;
    host.classList.add('is-visible');
    root.classList.add('portfolio-cursor-visible');
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function pointer(event) {
    if (event.pointerType !== 'mouse') { hide(); return; }
    x = event.clientX;
    y = event.clientY;
    update(event.target);
  }

  function refresh() {
    if (visible) update(document.elementFromPoint(x, y));
  }

  document.addEventListener('pointermove', pointer, {passive:true});
  document.addEventListener('pointerover', pointer, {passive:true});
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) hide();
  }, {passive:true});
  document.addEventListener('pointerdown', event => {
    // Ignore right/middle clicks and touch; let context menus use native behaviour.
    if (event.pointerType !== 'mouse' || event.button !== 0) { hide(); return; }
    pressed = true;
    pointer(event);
  }, {passive:true});
  document.addEventListener('pointerup', event => {
    pressed = false;
    if (event.pointerType === 'mouse') pointer(event);
  }, {passive:true});
  document.addEventListener('pointercancel', hide, {passive:true});
  document.addEventListener('dragstart', hide);
  document.addEventListener('contextmenu', hide);
  document.addEventListener('keydown', hide);
  document.addEventListener('close', hide, true);
  // Site click handlers may open a dialog or change controls without moving the mouse.
  document.addEventListener('click', () => {
    cursorTarget = null;
    requestAnimationFrame(refresh);
  });
  window.addEventListener('scroll', refresh, {passive:true,capture:true});
  window.addEventListener('resize', hide, {passive:true});
  window.addEventListener('blur', hide);
  window.addEventListener('pagehide', hide);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });
  for (const preference of [fine, reduced, contrast]) preference.addEventListener?.('change', hide);
})();
