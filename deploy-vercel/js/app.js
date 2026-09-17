/* ArchiMedi — interações e sistema de movimento (vanilla, zero dependência)
   Calibragem BuildV: movimento curto + easing longo, intensidade ~4/10, sem bounce,
   parallax <=0.12. Respeita prefers-reduced-motion. */
(function(){
  'use strict';
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---------- WhatsApp (número centralizado — PENDÊNCIA: trocar pelo real) ---------- */
  var WA = '5541999999999';
  function waLink(msg){ return 'https://wa.me/'+WA+'?text='+encodeURIComponent(msg); }
  document.querySelectorAll('[data-wa]').forEach(function(a){
    var s = a.getAttribute('data-wa') || 'o site';
    a.setAttribute('href', waLink('Olá, vim pelo site da ArchiMedi e gostaria de solicitar um orçamento sobre '+s+'.'));
    a.setAttribute('target','_blank'); a.setAttribute('rel','noopener');
  });

  /* ---------- Loader ---------- */
  var loader = document.querySelector('.loader');
  var loBar = loader && loader.querySelector('.lo-bar');
  var prog = 0;
  function tickLoad(){
    prog = Math.min(100, prog + Math.random()*22 + 8);
    if(loBar) loBar.style.width = prog+'%';
    if(prog < 100){ setTimeout(tickLoad, 90); }
    else { setTimeout(function(){ loader && loader.classList.add('done'); }, 260); }
  }
  window.addEventListener('load', function(){ setTimeout(function(){ if(loader) loader.classList.add('done'); }, 1600); });
  tickLoad();

  /* ---------- Header solid / hide-on-scroll ---------- */
  var header = document.querySelector('.header');
  var lastY = 0;
  function onHeader(){
    var y = window.pageYOffset;
    if(header){
      header.classList.toggle('solid', y > 40);
      if(y > 260 && y > lastY){ header.classList.add('hide'); }
      else { header.classList.remove('hide'); }
    }
    lastY = y;
  }

  /* ---------- Reading progress ---------- */
  var pbar = document.querySelector('.progress');
  function onProgress(){
    if(!pbar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    pbar.style.width = (h>0 ? (window.pageYOffset/h*100) : 0)+'%';
  }

  /* ---------- Word-by-word em títulos marcados ---------- */
  document.querySelectorAll('[data-word]').forEach(function(el){
    if(el.querySelector('.word')) return;
    var frag = document.createDocumentFragment();
    // preserva <em> como palavra única
    Array.prototype.forEach.call(el.childNodes, function(node){
      if(node.nodeType === 3){
        node.textContent.split(/(\s+)/).forEach(function(tok){
          if(tok.trim()===''){ frag.appendChild(document.createTextNode(tok)); return; }
          var w=document.createElement('span'); w.className='word';
          var i=document.createElement('i'); i.textContent=tok; w.appendChild(i); frag.appendChild(w);
        });
      } else if(node.nodeType === 1){
        var w=document.createElement('span'); w.className='word';
        var i=document.createElement('i'); i.innerHTML=node.outerHTML; w.appendChild(i); frag.appendChild(w);
      }
    });
    el.innerHTML=''; el.appendChild(frag);
    // stagger 42ms
    el.querySelectorAll('.word i').forEach(function(i,idx){ i.style.transitionDelay=(idx*42)+'ms'; });
  });

  /* ---------- Reveals (IO + first-screen timer + jump flush) ---------- */
  var reveals = [].slice.call(document.querySelectorAll('[data-reveal],[data-word]'));
  // stagger automático para irmãos diretos com data-reveal
  var byParent = {};
  reveals.forEach(function(el){
    if(!el.hasAttribute('data-reveal')) return;
    var p = el.parentNode; var k = p.__k || (p.__k = 'p'+(Math.random()*1e6|0));
    (byParent[k]=byParent[k]||[]).push(el);
  });
  Object.keys(byParent).forEach(function(k){
    byParent[k].forEach(function(el,idx){ el.style.transitionDelay = Math.min(idx*80,480)+'ms'; });
  });
  function reveal(el){ el.classList.add('is-in'); }
  if(RM){ reveals.forEach(reveal); }
  else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ reveal(e.target); io.unobserve(e.target); } });
    }, {threshold:0.12, rootMargin:'0px 0px -7% 0px'});
    reveals.forEach(function(el){ io.observe(el); });
    // primeira tela por timer (IO não dispara em doc oculto)
    setTimeout(function(){
      reveals.forEach(function(el){
        var r=el.getBoundingClientRect();
        if(r.top < window.innerHeight*0.92){ reveal(el); io.unobserve(el); }
      });
    }, 150);
    // flush em saltos de scroll
    window.addEventListener('scroll', function(){
      reveals.forEach(function(el){
        if(el.classList.contains('is-in')) return;
        var r=el.getBoundingClientRect();
        if(r.bottom < window.innerHeight*0.3){ reveal(el); }
      });
    }, {passive:true});
  }

  /* ---------- Hero parallax (<=0.12) ---------- */
  var heroBg = document.querySelector('.hero-bg img');
  var heroLight = document.querySelector('.hero-light');
  function onParallax(){
    if(RM || !FINE) return;
    var y = window.pageYOffset;
    if(y > window.innerHeight*1.3) return;
    if(heroBg) heroBg.style.transform = 'translateY('+(y*0.10)+'px) scale(1.06)';
    if(heroLight) heroLight.style.transform = 'translateY('+(y*0.05)+'px)';
  }

  /* ---------- Processo "Como começar" (linha que desenha) ---------- */
  var proc = document.querySelector('[data-proc]');
  if(proc){
    var pObs = new IntersectionObserver(function(ents){
      ents.forEach(function(e){ if(e.isIntersecting){ proc.classList.add('on'); pObs.disconnect(); } });
    }, {threshold:0.3});
    pObs.observe(proc);
  }

  /* ---------- Counters ---------- */
  document.querySelectorAll('[data-count]').forEach(function(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix')||'';
    var done=false;
    var o=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting && !done){ done=true;
          if(RM){ el.textContent = target+suffix; o.disconnect(); return; }
          var t0=performance.now(), dur=1600;
          (function step(now){
            var p=Math.min(1,(now-t0)/dur); var eased=1-Math.pow(1-p,3);
            el.textContent = Math.round(target*eased)+suffix;
            if(p<1) requestAnimationFrame(step); else el.textContent=target+suffix;
          })(performance.now());
          o.disconnect();
        }
      });
    }, {threshold:0.5});
    o.observe(el);
  });

  /* ---------- Mobile menu ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  function closeMenu(){ if(nav){nav.classList.remove('open');} if(burger){burger.classList.remove('open');} document.body.style.overflow=''; }
  if(burger){
    burger.addEventListener('click', function(){
      var open = nav.classList.toggle('open'); burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  function closeMenuAria(){ closeMenu(); if(burger) burger.setAttribute('aria-expanded','false'); }
  document.querySelectorAll('.nav a').forEach(function(a){ a.addEventListener('click', closeMenuAria); });

  /* ---------- Scrollspy ---------- */
  var navLinks = [].slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  function onSpy(){
    var pos = window.pageYOffset + window.innerHeight*0.35;
    var idx=-1;
    sections.forEach(function(s,i){ if(s && s.offsetTop <= pos) idx=i; });
    navLinks.forEach(function(a,i){ a.classList.toggle('active', i===idx); });
  }

  /* ---------- Smooth scroll (lerp em ponteiro fino) ---------- */
  var HDR = 76;
  function anchorTo(target){
    var top = target.getBoundingClientRect().top + window.pageYOffset - HDR;
    if(RM){ window.scrollTo(0, top); return; }
    var start=window.pageYOffset, dist=top-start, t0=performance.now(), dur=Math.min(1100, 380+Math.abs(dist)*0.5);
    (function step(now){
      var p=Math.min(1,(now-t0)/dur); var e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
      window.scrollTo(0, start+dist*e);
      if(p<1) requestAnimationFrame(step);
    })(t0);
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(ev){
      var id=a.getAttribute('href'); if(id.length<2) return;
      var t=document.querySelector(id); if(!t) return;
      ev.preventDefault(); closeMenu();
      setTimeout(function(){ anchorTo(t); }, nav && nav.classList.contains('open')?60:0);
    });
  });

  /* ---------- Lightbox de galeria ---------- */
  var lb = document.querySelector('.lb');
  var lbImg = lb && lb.querySelector('.lb-img');
  var lbCounter = lb && lb.querySelector('.lb-counter');
  var lbPrev = lb && lb.querySelector('.lb-prev');
  var lbNext = lb && lb.querySelector('.lb-next');
  var gal=[], gi=0;
  function showLb(){ lbImg.src = gal[gi]; if(lbCounter) lbCounter.textContent = (gi+1)+' / '+gal.length;
    var multi = gal.length>1; if(lbPrev) lbPrev.hidden=!multi; if(lbNext) lbNext.hidden=!multi; }
  function openLb(list, start){
    gal=list; gi=start||0; showLb(); lb.classList.add('open'); document.body.style.overflow='hidden';
  }
  function closeLb(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  function lbGo(n){ gi=(gi+n+gal.length)%gal.length; if(lbImg){ lbImg.style.opacity=.3; setTimeout(function(){ showLb(); lbImg.style.opacity=1; },120);} }
  document.querySelectorAll('[data-gallery]').forEach(function(el){
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    if(!el.getAttribute('aria-label')){
      var t=el.querySelector('h3'); el.setAttribute('aria-label','Abrir galeria'+(t?': '+t.textContent:''));
    }
    function open(){ var list=el.getAttribute('data-gallery').split('|'); openLb(list, parseInt(el.getAttribute('data-start')||'0',10)); }
    el.addEventListener('click', open);
    el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
  });
  if(lb){
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lbPrev.addEventListener('click', function(){ lbGo(-1); });
    lbNext.addEventListener('click', function(){ lbGo(1); });
    lb.addEventListener('click', function(e){ if(e.target===lb) closeLb(); });
    document.addEventListener('keydown', function(e){
      if(!lb.classList.contains('open')) return;
      if(e.key==='Escape') closeLb();
      else if(e.key==='ArrowRight') lbGo(1);
      else if(e.key==='ArrowLeft') lbGo(-1);
    });
  }

  /* ---------- rAF loop ---------- */
  var ticking=false;
  function loop(){ onHeader(); onProgress(); onParallax(); onSpy(); ticking=false; }
  window.addEventListener('scroll', function(){ if(!ticking){ requestAnimationFrame(loop); ticking=true; } }, {passive:true});
  window.addEventListener('resize', loop, {passive:true});
  loop();
})();
