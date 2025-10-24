// Simple client-side language toggle for EN/DE
// Usage: elements with a data-lang attribute ("en" or "de") will be shown/hidden.
(function () {
  const DEFAULT = 'en';
  let currentLang = DEFAULT;
  function setLang(lang) {
    currentLang = lang;
    try { localStorage.setItem('site_lang', lang); } catch (e) {}
    document.documentElement.lang = lang === 'de' ? 'de' : 'en';
    // show/hide only translation spans (exclude lang buttons themselves)
    document.querySelectorAll('[data-lang]:not(.lang-btn)').forEach(el => {
      if (el.getAttribute('data-lang') === lang) el.style.display = '';
      else el.style.display = 'none';
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    // update placeholders for inputs/textareas that provide translations
    document.querySelectorAll('input[data-ph-en], textarea[data-ph-en]').forEach(el => {
      const phEn = el.dataset.phEn || '';
      const phDe = el.dataset.phDe || '';
      el.placeholder = (lang === 'de' && phDe) ? phDe : phEn;
    });

    // Update dropdown toggler(s) to show selected flag/abbr
    const mapping = { en: {src: 'assets/flags/gb.svg', abbr: 'EN'}, de: {src: 'assets/flags/de.svg', abbr: 'DE'} };
    document.querySelectorAll('.lang-dropdown').forEach(dd => {
      const toggle = dd.querySelector('.lang-dropdown-toggle');
      if (!toggle) return;
      const img = toggle.querySelector('.flag-icon');
      const ab = toggle.querySelector('.lang-abbr');
      if (img && mapping[lang]) img.src = mapping[lang].src;
      if (ab) ab.textContent = mapping[lang].abbr;
      // hide the currently-selected option inside the popup (so popup
      // shows only selectable flags) and close the dropdown after selection
      const menu = dd.querySelector('.lang-dropdown-menu');
      if (menu) {
        dd.querySelectorAll('.lang-btn').forEach(btn => {
          btn.style.display = btn.getAttribute('data-lang') === lang ? 'none' : '';
        });
        menu.style.display = 'none';
      }
      dd.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  function init() {
  const stored = (localStorage.getItem('site_lang')) || null;
  let lang = stored || (navigator.language && navigator.language.startsWith('de') ? 'de' : DEFAULT);
  currentLang = lang;
    // ensure elements default state: hide non-matching
    document.querySelectorAll('[data-lang]:not(.lang-btn)').forEach(el => {
      el.style.display = el.getAttribute('data-lang') === lang ? '' : 'none';
    });
    // set placeholders
    document.querySelectorAll('input[data-ph-en], textarea[data-ph-en]').forEach(el => {
      const phEn = el.dataset.phEn || '';
      const phDe = el.dataset.phDe || '';
      el.placeholder = (lang === 'de' && phDe) ? phDe : phEn;
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        setLang(btn.getAttribute('data-lang'));
      });
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      // hide active option in the popup so it is not selectable
      btn.style.display = btn.getAttribute('data-lang') === lang ? 'none' : '';
    });

    // dropdown toggle behavior
    document.querySelectorAll('.lang-dropdown').forEach(dd => {
      const toggle = dd.querySelector('.lang-dropdown-toggle');
      const menu = dd.querySelector('.lang-dropdown-menu');
      if (!toggle || !menu) return;
      toggle.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const open = dd.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        // before showing the menu, ensure the active language button is hidden
        if (menu) {
          dd.querySelectorAll('.lang-btn').forEach(btn => {
            btn.style.display = btn.getAttribute('data-lang') === currentLang ? 'none' : '';
          });
          menu.style.display = open ? 'block' : 'none';
        }
      });
    });

    // ensure toggler shows current language on init
    const mapping = { en: {src: 'assets/flags/gb.svg', abbr: 'EN'}, de: {src: 'assets/flags/de.svg', abbr: 'DE'} };
    document.querySelectorAll('.lang-dropdown').forEach(dd => {
      const toggle = dd.querySelector('.lang-dropdown-toggle');
      if (!toggle) return;
      const img = toggle.querySelector('.flag-icon');
      const ab = toggle.querySelector('.lang-abbr');
      if (img && mapping[lang]) img.src = mapping[lang].src;
      if (ab) ab.textContent = mapping[lang].abbr;
      const menu = dd.querySelector('.lang-dropdown-menu');
      if (menu) {
        // hide active option inside popup by default
        dd.querySelectorAll('.lang-btn').forEach(btn => {
          btn.style.display = btn.getAttribute('data-lang') === lang ? 'none' : '';
        });
        menu.style.display = 'none';
      }
    });

    // close dropdown when clicking outside
    document.addEventListener('click', () => {
      document.querySelectorAll('.lang-dropdown.open').forEach(dd => {
        dd.classList.remove('open');
        const t = dd.querySelector('.lang-dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
    document.documentElement.lang = lang;
  }

  // init on DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
