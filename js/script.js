// Ellemed theme interactions

document.addEventListener('DOMContentLoaded', () => {
  /* Mobile nav toggle */
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  hamburger?.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    mainNav.style.display = mainNav.classList.contains('open') ? 'flex' : '';
  });

  /* Procedure list -> swap image */
  const procedureItems = document.querySelectorAll('.procedure-item');
  const procedureImage = document.querySelector('.procedure-media img');
  procedureItems.forEach(item => {
    item.addEventListener('click', () => {
      procedureItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const src = item.getAttribute('data-image');
      if (src && procedureImage) {
        procedureImage.style.opacity = 0;
        setTimeout(() => {
          procedureImage.src = src;
          procedureImage.style.opacity = 1;
        }, 150);
      }
    });
  });

  /* Before / after compare slider */
  const slider = document.querySelector('.compare-slider');
  if (slider) {
    const afterImg = slider.querySelector('.after-img');
    const divider = slider.querySelector('.divider');
    const handle = slider.querySelector('.handle');

    const setPosition = (percent) => {
      percent = Math.max(0, Math.min(100, percent));
      afterImg.style.clipPath = `inset(0 0 0 ${percent}%)`;
      divider.style.left = `${percent}%`;
      handle.style.left = `${percent}%`;
    };

    let dragging = false;
    const move = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const percent = ((clientX - rect.left) / rect.width) * 100;
      setPosition(percent);
    };

    handle.addEventListener('mousedown', () => (dragging = true));
    window.addEventListener('mouseup', () => (dragging = false));
    window.addEventListener('mousemove', (e) => dragging && move(e.clientX));

    handle.addEventListener('touchstart', () => (dragging = true), { passive: true });
    window.addEventListener('touchend', () => (dragging = false));
    window.addEventListener('touchmove', (e) => {
      if (dragging && e.touches[0]) move(e.touches[0].clientX);
    }, { passive: true });

    slider.addEventListener('click', (e) => {
      if (e.target === handle) return;
      move(e.clientX);
    });
  }

  /* Compare tabs -> swap before/after image pair */
  const compareSlider = document.querySelector('.compare-slider');
  if (compareSlider) {
    const beforeSets = JSON.parse(compareSlider.dataset.before || '[]');
    const afterSets = JSON.parse(compareSlider.dataset.after || '[]');
    const beforeImg = compareSlider.querySelector('.before-img');
    const afterImgEl = compareSlider.querySelector('.after-img');
    document.querySelectorAll('.compare-tabs button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.compare-tabs button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const i = Number(btn.dataset.slide);
        if (beforeSets[i]) beforeImg.src = beforeSets[i];
        if (afterSets[i]) afterImgEl.src = afterSets[i];
      });
    });
  }

  /* Hero slider: rotating background + headline */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.querySelectorAll('.hero-dots button');
  const heroHeadline = document.querySelector('.hero-headline');
  const headlines = heroHeadline ? JSON.parse(heroHeadline.dataset.headlines || '[]') : [];
  let heroIndex = 0;
  let heroTimer;

  const showHeroSlide = (i) => {
    heroIndex = i;
    heroSlides.forEach((s, idx) => s.classList.toggle('active', idx === i));
    heroDots.forEach((d, idx) => d.classList.toggle('active', idx === i));
    if (heroHeadline && headlines[i]) heroHeadline.textContent = headlines[i];
  };

  const startHeroAutoplay = () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => {
      showHeroSlide((heroIndex + 1) % heroSlides.length);
    }, 6000);
  };

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      showHeroSlide(Number(dot.dataset.slide));
      startHeroAutoplay();
    });
  });

  if (heroSlides.length) startHeroAutoplay();

  /* Newsletter + appointment forms (demo only, no backend) */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.reset();
      alert('Thank you! We will be in touch shortly.');
    });
  });

  /* Header shrink on scroll */
  const siteHeader = document.querySelector('header.site-header');
  const onHeaderScroll = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onHeaderScroll();
  window.addEventListener('scroll', onHeaderScroll, { passive: true });

  /* Back to top button (injected once per page) */
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(backToTop);
  const onBackToTopScroll = () => backToTop.classList.toggle('visible', window.scrollY > 600);
  onBackToTopScroll();
  window.addEventListener('scroll', onBackToTopScroll, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Scroll-reveal for headings, cards and list rows */
  const revealTargets = document.querySelectorAll(
    '.section-head, .category-card, .testimonial-card, .article-card, ' +
    '.procedure-item, .steps-list li, .icon-strip-item, ' +
    '.feature-row, .faq-item, .intro-copy, .intro-media, .quote-body, .quote-media, ' +
    '.understanding-text, .understanding-panel, .why-clinic-text, .stat-grid'
  );
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
    });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  /* Why Sarayu Clinic: animated count-up stats */
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  if (statEls.length && 'IntersectionObserver' in window) {
    const countUp = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      if (!target) return;
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => statObserver.observe(el));
  }

  /* Understanding-the-procedure panel tabs (Advantages / Ideal Candidates) */
  document.querySelectorAll('.understanding-panel').forEach(panel => {
    const tabs = panel.querySelectorAll('.panel-tab');
    const contents = panel.querySelectorAll('.panel-content');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        panel.querySelector(`.panel-content[data-panel-content="${tab.dataset.panel}"]`)?.classList.add('active');
      });
    });
  });

  /* Smooth FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.classList.add('js-anim');
    const summary = item.querySelector('summary');
    const answer = item.querySelector('p');
    if (!summary || !answer) return;

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      const isOpen = item.hasAttribute('open');

      if (isOpen) {
        answer.style.height = answer.scrollHeight + 'px';
        requestAnimationFrame(() => { answer.style.height = '0px'; });
        answer.addEventListener('transitionend', function onEnd() {
          item.removeAttribute('open');
          answer.style.height = '';
          answer.removeEventListener('transitionend', onEnd);
        }, { once: true });
      } else {
        item.setAttribute('open', '');
        answer.style.height = '0px';
        requestAnimationFrame(() => { answer.style.height = answer.scrollHeight + 'px'; });
        answer.addEventListener('transitionend', function onEnd() {
          answer.style.height = 'auto';
          answer.removeEventListener('transitionend', onEnd);
        }, { once: true });
      }
    });
  });
});
