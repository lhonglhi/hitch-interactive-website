/* Hitch Interactive — bilingual EN/中文 + news carousel
   Language rule: manual choice (saved) > browser locale zh-CN > timezone China mainland > English. */
(function () {
  function detectLang() {
    try {
      var saved = localStorage.getItem('hitch-lang');
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) {}
    var nav = (navigator.languages || [navigator.language || '']).join(',').toLowerCase();
    if (nav.indexOf('zh-cn') >= 0 || nav.indexOf('zh-hans') >= 0) return 'zh';
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz === 'Asia/Shanghai' || tz === 'Asia/Urumqi' || tz === 'Asia/Chongqing' || tz === 'Asia/Harbin') return 'zh';
    } catch (e) {}
    return 'en';
  }

  function applyLang(lang) {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    var nodes = document.querySelectorAll('[data-zh]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
      el.innerHTML = lang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
    }
    var btn = document.getElementById('langToggle');
    if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中文';
    try { localStorage.setItem('hitch-lang', lang); } catch (e) {}
    window.__hitchLang = lang;
  }

  window.toggleLang = function () {
    applyLang(window.__hitchLang === 'zh' ? 'en' : 'zh');
  };

  document.addEventListener('DOMContentLoaded', function () {
    applyLang(detectLang());
    var track = document.getElementById('newsTrack');
    if (track) {
      var prev = document.getElementById('newsPrev'), next = document.getElementById('newsNext');
      function step() {
        var card = track.querySelector('.news-card');
        return card ? card.getBoundingClientRect().width + 20 : 340;
      }
      if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
      if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    }
  });
})();
