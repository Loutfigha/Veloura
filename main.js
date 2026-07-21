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

})();
