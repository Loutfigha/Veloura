(function(){
  "use strict";

  var yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Active nav link on scroll (same-page anchors only) ----------
     Declared before onScroll()/updateActiveNav() are first invoked below,
     since updateActiveNav() reads navLinks/sections. */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks.map(function(link){
    var href = link.getAttribute('href') || '';
    var hashIndex = href.indexOf('#');
    if(hashIndex === -1) return null;
    var isSamePage = hashIndex === 0 || href.slice(0, hashIndex) === (location.pathname.split('/').pop() || 'index.html');
    if(!isSamePage) return null;
    return document.querySelector(href.slice(hashIndex));
  });
  function updateActiveNav(){
    var scrollPos = window.scrollY + 140;
    var currentIndex = -1;
    sections.forEach(function(sec, i){
      if(sec && sec.offsetTop <= scrollPos) currentIndex = i;
    });
    if(currentIndex === -1) return;
    navLinks.forEach(function(link, i){
      link.classList.toggle('active', i === currentIndex);
    });
  }

  /* ---------- Header scroll state ---------- */
  var header = document.getElementById('siteHeader');
  var scrollProgress = document.getElementById('scrollProgress');
  var mobileCta = document.getElementById('mobileCta');
  var hero = document.querySelector('.hero, .product-hero, .hero-dark');
  var heroHeight = hero ? hero.offsetHeight : 600;

  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    if(header) header.classList.toggle('scrolled', y > 40);
    if(mobileCta) mobileCta.classList.toggle('show', y > heroHeight * 0.6);

    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
    if(scrollProgress) scrollProgress.style.width = pct + '%';

    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', function(){ heroHeight = hero ? hero.offsetHeight : 600; });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  navOverlay.setAttribute('aria-hidden', 'true');

  function openNav(){
    if(!mainNav || !navToggle) return;
    mainNav.classList.add('open');
    navOverlay.classList.add('is-visible');
    navToggle.setAttribute('aria-expanded','true');
    document.documentElement.classList.add('nav-locked');
  }
  function closeNav(){
    if(!mainNav || !navToggle) return;
    mainNav.classList.remove('open');
    navOverlay.classList.remove('is-visible');
    navToggle.setAttribute('aria-expanded','false');
    document.documentElement.classList.remove('nav-locked');
  }
  if(navToggle && mainNav){
    document.body.appendChild(navOverlay);
    navToggle.addEventListener('click', function(){
      if(mainNav.classList.contains('open')) closeNav(); else openNav();
    });
    mainNav.querySelectorAll('.nav-link').forEach(function(link){
      link.addEventListener('click', closeNav);
    });
    navOverlay.addEventListener('click', closeNav);
    /* Robust click-outside fallback: closes the drawer for any tap that
       lands outside it, independent of whether the dimmed overlay div
       itself received the tap (belt-and-braces on touch browsers where
       a fast tap can otherwise register as a scroll gesture). */
    document.addEventListener('click', function(e){
      if(!mainNav.classList.contains('open')) return;
      if(mainNav.contains(e.target) || navToggle.contains(e.target)) return;
      closeNav();
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Scroll reveal animations ---------- */
  /* Content is visible by default (see CSS). Only elements that start
     below the fold get opted into the hidden "pending" state, so a
     failure of IntersectionObserver/timers can never blank the whole page. */
  var revealEls = document.querySelectorAll('.reveal');
  var vh = window.innerHeight || document.documentElement.clientHeight;
  var pendingEls = [];
  revealEls.forEach(function(el){
    if(el.getBoundingClientRect().top > vh){
      el.classList.add('pending');
      pendingEls.push(el);
    }
  });

  if(pendingEls.length && 'IntersectionObserver' in window){
    var ioFired = false;
    var io = new IntersectionObserver(function(entries){
      ioFired = true;
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.remove('pending');
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -60px 0px'});
    pendingEls.forEach(function(el){ io.observe(el); });

    /* Safety net: if the observer never reports back, don't leave
       lower sections permanently invisible. */
    setTimeout(function(){
      if(!ioFired){
        pendingEls.forEach(function(el){
          el.classList.remove('pending');
          el.classList.add('is-visible');
        });
      }
    }, 1200);
  } else {
    pendingEls.forEach(function(el){
      el.classList.remove('pending');
      el.classList.add('is-visible');
    });
  }

  /* ---------- Cookiemelding & Google Analytics (Google Consent Mode v2) ----------
     Het gtag.js-script en de config-call laden altijd (nodig voor Google's eigen
     tagdetectie/Tag Assistant), maar analytics_storage staat standaard op "denied".
     Er wordt pas daadwerkelijk data verzameld (cookies, hits) zodra de bezoeker op
     "Accepteren" klikt en de consent-status naar "granted" wordt bijgewerkt. */
  (function(){
    var CONSENT_KEY = 'louaCookieConsent';
    var GA_ID = 'G-9BWLYK4D7H';
    var banner = null;

    var consent = localStorage.getItem(CONSENT_KEY);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('consent', 'default', {
      'analytics_storage': consent === 'accepted' ? 'granted' : 'denied',
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied'
    });
    gtag('js', new Date());
    gtag('config', GA_ID);

    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(gaScript);

    function hideBanner(){
      if(banner){ banner.classList.remove('is-visible'); }
    }

    function showBanner(){
      if(!banner){
        var bannerHTML = ''
          + '<div class="cookie-banner" id="cookieBanner" role="dialog" aria-label="Cookie-toestemming">'
          + '  <p>Wij gebruiken cookies om het websitebezoek te analyseren (Google Analytics) en zo onze website te verbeteren. Zie ons <a href="cookiebeleid.html">cookiebeleid</a>.</p>'
          + '  <div class="cookie-banner-actions">'
          + '    <button type="button" class="btn btn-ghost btn-sm" id="cookieDecline">Weigeren</button>'
          + '    <button type="button" class="btn btn-gold btn-sm" id="cookieAccept">Accepteren</button>'
          + '  </div>'
          + '</div>';
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        banner = document.getElementById('cookieBanner');

        document.getElementById('cookieAccept').addEventListener('click', function(){
          localStorage.setItem(CONSENT_KEY, 'accepted');
          gtag('consent', 'update', {'analytics_storage': 'granted'});
          hideBanner();
        });
        document.getElementById('cookieDecline').addEventListener('click', function(){
          localStorage.setItem(CONSENT_KEY, 'declined');
          gtag('consent', 'update', {'analytics_storage': 'denied'});
          hideBanner();
        });
      }
      setTimeout(function(){ banner.classList.add('is-visible'); }, 50);
    }

    if(!consent){
      showBanner();
    }

    var legalLinks = document.querySelector('.footer-legal-links');
    if(legalLinks){
      var settingsBtn = document.createElement('button');
      settingsBtn.type = 'button';
      settingsBtn.className = 'footer-cookie-settings';
      settingsBtn.textContent = 'Cookie-instellingen';
      settingsBtn.addEventListener('click', showBanner);
      legalLinks.appendChild(settingsBtn);
    }
  })();

  /* ---------- Nieuwsbrief-popup: gratis anti-pollen gaas bij aanmelding ---------- */
  (function(){
    var STORAGE_KEY = 'louaNewsletterSeen';
    if(localStorage.getItem(STORAGE_KEY)){ return; }

    var overlayHTML = ''
      + '<div class="newsletter-popup-overlay" id="newsletterOverlay">'
      + '  <div class="newsletter-popup" role="dialog" aria-modal="true" aria-labelledby="newsletterTitle">'
      + '    <button type="button" class="newsletter-popup-close" id="newsletterClose" aria-label="Sluiten">&times;</button>'
      + '    <div id="newsletterFormView">'
      + '      <div class="newsletter-popup-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12v9H4v-9"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg></div>'
      + '      <p class="eyebrow">Exclusief voor nieuwe aanmeldingen</p>'
      + '      <h3 id="newsletterTitle">Ontvang gratis anti-pollen gaas</h3>'
      + '      <div class="newsletter-popup-body">'
      + '        <p>Meld u aan voor onze nieuwsbrief en ontvang een gratis upgrade naar anti-pollen gaas (t.w.v. &euro; 30,-) bij uw volgende bestelling.</p>'
      + '      </div>'
      + '      <form id="newsletterForm" novalidate>'
      + '        <input type="email" id="newsletterEmail" name="email" placeholder="Uw e-mailadres" autocomplete="email" required>'
      + '        <span class="newsletter-popup-error" id="newsletterError">Er ging iets mis. Probeer het later opnieuw.</span>'
      + '        <button type="submit" class="btn btn-gold" id="newsletterSubmitBtn">Aanmelden &amp; korting ontvangen</button>'
      + '      </form>'
      + '      <p class="newsletter-popup-fineprint">We sturen af en toe inspiratie en aanbiedingen, nooit spam. Uitschrijven kan altijd. Zie ons <a href="privacyverklaring.html">privacybeleid</a>.</p>'
      + '    </div>'
      + '    <div id="newsletterSuccessView" style="display:none;">'
      + '      <div class="newsletter-popup-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>'
      + '      <h3>Bedankt voor uw aanmelding!</h3>'
      + '      <div class="newsletter-popup-body">'
      + '        <p>Vermeld onderstaande code bij uw volgende offerteaanvraag voor gratis anti-pollen gaas:</p>'
      + '      </div>'
      + '      <div class="newsletter-popup-code" id="newsletterCode">GRATISANTIPOLLEN</div>'
      + '      <button type="button" class="btn btn-ghost" id="newsletterSuccessClose">Sluiten</button>'
      + '    </div>'
      + '  </div>'
      + '</div>';

    document.body.insertAdjacentHTML('beforeend', overlayHTML);

    var overlay = document.getElementById('newsletterOverlay');
    var closeBtn = document.getElementById('newsletterClose');
    var successCloseBtn = document.getElementById('newsletterSuccessClose');
    var form = document.getElementById('newsletterForm');
    var formView = document.getElementById('newsletterFormView');
    var successView = document.getElementById('newsletterSuccessView');
    var errorEl = document.getElementById('newsletterError');
    var codeEl = document.getElementById('newsletterCode');

    function showPopup(){
      overlay.classList.add('is-visible');
    }
    function hidePopup(){
      overlay.classList.remove('is-visible');
      localStorage.setItem(STORAGE_KEY, '1');
    }

    var showTimer = setTimeout(showPopup, 8000);

    closeBtn.addEventListener('click', hidePopup);
    successCloseBtn.addEventListener('click', hidePopup);
    overlay.addEventListener('click', function(e){
      if(e.target === overlay){ hidePopup(); }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && overlay.classList.contains('is-visible')){ hidePopup(); }
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var emailEl = document.getElementById('newsletterEmail');
      var email = emailEl.value.trim();
      var submitBtn = document.getElementById('newsletterSubmitBtn');
      submitBtn.disabled = true;
      errorEl.style.display = 'none';

      fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email})
      }).then(function(res){
        if(!res.ok){ throw new Error('Aanmelden mislukt'); }
        return res.json();
      }).then(function(data){
        formView.style.display = 'none';
        successView.style.display = 'block';
        if(data && data.code){ codeEl.textContent = data.code; }
        localStorage.setItem(STORAGE_KEY, '1');
      }).catch(function(err){
        console.error('Nieuwsbrief-aanmelding mislukt:', err);
        errorEl.style.display = 'block';
      }).finally(function(){
        submitBtn.disabled = false;
      });
    });
  })();

})();
