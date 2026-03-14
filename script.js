/* ═══════════════════════════════════════════════════
   GRAND AURUM HOTEL — MASTER SCRIPT
   All interactions, animations, and dynamic features
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════
     1. PRELOADER
  ══════════════════════════════ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = 'visible';
      initAnimations();
    }, 1600);
  });
  document.body.style.overflow = 'hidden';


  /* ══════════════════════════════
     2. CUSTOM CURSOR
  ══════════════════════════════ */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left  = mouseX + 'px';
    dot.style.top   = mouseY + 'px';
  });

  // Smooth ring follow
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects on interactive elements
  const hoverables = document.querySelectorAll(
    'a, button, .filter-btn, .room-card, .gallery-item, .amenity-card'
  );
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });


  /* ══════════════════════════════
     3. NAVBAR — scroll & hamburger
  ══════════════════════════════ */
  const navbar      = document.getElementById('navbar');
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const mobLinks    = document.querySelectorAll('.mob-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });

  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinksAll.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === '#' + current) {
        a.style.color = 'var(--gold-light)';
      }
    });
  }, { passive: true });


  /* ══════════════════════════════
     4. HERO PARTICLES
  ══════════════════════════════ */
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = 35;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.cssText = `
        left:  ${Math.random() * 100}%;
        bottom: ${Math.random() * 20}%;
        --dur:   ${6 + Math.random() * 10}s;
        --delay: ${Math.random() * 8}s;
        width:  ${1 + Math.random() * 2}px;
        height: ${1 + Math.random() * 2}px;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  }
  createParticles();


  /* ══════════════════════════════
     5. SCROLL ANIMATIONS (AOS-like)
  ══════════════════════════════ */
  function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.aosDelay || 0;
          setTimeout(() => {
            entry.target.classList.add('aos-animate');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
  }


  /* ══════════════════════════════
     6. COUNTER ANIMATION
  ══════════════════════════════ */
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(start).toLocaleString();
      }
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num[data-count]').forEach(el => {
          const target = parseInt(el.dataset.count);
          animateCounter(el, target);
          delete el.dataset.count;
        });
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);


  /* ══════════════════════════════
     7. ROOMS FILTER
  ══════════════════════════════ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const roomCards  = document.querySelectorAll('.room-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      roomCards.forEach((card, i) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) {
          card.style.animation = 'none';
          setTimeout(() => {
            card.style.animation = `fadeSlideUp 0.5s ease forwards ${i * 60}ms`;
          }, 10);
        }
      });
    });
  });


  /* ══════════════════════════════
     8. GALLERY LIGHTBOX
  ══════════════════════════════ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lbImg');
  const lbCaption    = document.getElementById('lbCaption');
  const lbClose      = document.getElementById('lbClose');
  const lbPrev       = document.getElementById('lbPrev');
  const lbNext       = document.getElementById('lbNext');

  let galleryImgs = [];
  let currentLbIdx = 0;

  galleryItems.forEach((item, idx) => {
    const img  = item.querySelector('img');
    const cap  = item.querySelector('.gallery-hover span');
    galleryImgs.push({
      src: img.src,
      alt: img.alt,
      cap: cap ? cap.textContent : ''
    });

    item.addEventListener('click', () => {
      currentLbIdx = idx;
      openLightbox(idx);
    });
  });

  function openLightbox(idx) {
    const data = galleryImgs[idx];
    lbImg.src         = data.src;
    lbImg.alt         = data.alt;
    lbCaption.textContent = data.cap;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  lbPrev.addEventListener('click', () => {
    currentLbIdx = (currentLbIdx - 1 + galleryImgs.length) % galleryImgs.length;
    openLightbox(currentLbIdx);
  });
  lbNext.addEventListener('click', () => {
    currentLbIdx = (currentLbIdx + 1) % galleryImgs.length;
    openLightbox(currentLbIdx);
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  lbPrev.click();
    if (e.key === 'ArrowRight') lbNext.click();
  });


  /* ══════════════════════════════
     9. TESTIMONIALS SLIDER
  ══════════════════════════════ */
  const track  = document.getElementById('testimonialTrack');
  const dotsEl = document.getElementById('tDots');
  const tPrev  = document.getElementById('tPrev');
  const tNext  = document.getElementById('tNext');
  const cards  = track ? track.querySelectorAll('.testimonial-card') : [];
  let tIdx     = 0;
  let tAuto;

  if (cards.length > 0) {
    // Create dots
    cards.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 't-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });

    function goTo(idx) {
      tIdx = idx;
      track.style.transform = `translateX(-${tIdx * 100}%)`;
      document.querySelectorAll('.t-dot').forEach((d, i) => {
        d.classList.toggle('active', i === tIdx);
      });
    }

    function next() { goTo((tIdx + 1) % cards.length); }
    function prev() { goTo((tIdx - 1 + cards.length) % cards.length); }

    tNext.addEventListener('click', next);
    tPrev.addEventListener('click', prev);

    function startAuto() {
      tAuto = setInterval(next, 5500);
    }
    function stopAuto() { clearInterval(tAuto); }

    startAuto();
    track.parentElement.addEventListener('mouseenter', stopAuto);
    track.parentElement.addEventListener('mouseleave', startAuto);

    // Touch/swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    });
  }


  /* ══════════════════════════════
     10. BOOKING FORM — Live Summary
  ══════════════════════════════ */
  const checkinEl  = document.getElementById('checkin');
  const checkoutEl = document.getElementById('checkout');
  const roomEl     = document.getElementById('roomType');
  const guestsEl   = document.getElementById('guests');
  const nameEl     = document.getElementById('guestName');

  const sumCheckin  = document.getElementById('sumCheckin');
  const sumCheckout = document.getElementById('sumCheckout');
  const sumRoom     = document.getElementById('sumRoom');
  const sumGuests   = document.getElementById('sumGuests');
  const sumTotal    = document.getElementById('sumTotal');

  const roomPrices = {
    'Deluxe City Room':   480,
    'Junior Suite':       780,
    'Grand Suite':        1200,
    'Sky Villa':          3200,
    'Royal Penthouse':    4800
  };

  function formatDate(val) {
    if (!val) return '—';
    const d = new Date(val);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  function getNights() {
    if (!checkinEl.value || !checkoutEl.value) return 0;
    const diff = new Date(checkoutEl.value) - new Date(checkinEl.value);
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  }

  function getPrice() {
    const room = roomEl.value;
    for (const key in roomPrices) {
      if (room.startsWith(key)) return roomPrices[key];
    }
    return 0;
  }

  function updateSummary() {
    sumCheckin.textContent  = formatDate(checkinEl.value);
    sumCheckout.textContent = formatDate(checkoutEl.value);
    sumGuests.textContent   = guestsEl.value || '—';

    const roomVal = roomEl.value;
    const roomName = roomVal ? roomVal.split(' — ')[0] : '—';
    sumRoom.textContent = roomName;

    const nights = getNights();
    const price  = getPrice();
    if (nights > 0 && price > 0) {
      sumTotal.textContent = '$' + (nights * price).toLocaleString() + ` (${nights} night${nights > 1 ? 's' : ''})`;
    } else {
      sumTotal.textContent = '—';
    }
  }

  if (checkinEl) {
    // Set min dates
    const today = new Date().toISOString().split('T')[0];
    checkinEl.min  = today;
    checkoutEl.min = today;

    checkinEl.addEventListener('change', () => {
      checkoutEl.min = checkinEl.value;
      if (checkoutEl.value && checkoutEl.value <= checkinEl.value) {
        checkoutEl.value = '';
      }
      updateSummary();
    });
    checkoutEl.addEventListener('change', updateSummary);
    roomEl.addEventListener('change', updateSummary);
    guestsEl.addEventListener('change', updateSummary);
  }

  // Booking Submit
  const bookingBtn   = document.getElementById('bookingBtn');
  const successModal = document.getElementById('successModal');
  const modalName    = document.getElementById('modalName');
  const modalClose   = document.getElementById('modalClose');

  if (bookingBtn) {
    bookingBtn.addEventListener('click', () => {
      // Basic validation
      const fields = [checkinEl, checkoutEl, roomEl, nameEl, document.getElementById('guestEmail')];
      let valid = true;

      fields.forEach(f => {
        if (!f || !f.value.trim()) {
          f && f.classList.add('error');
          valid = false;
        } else {
          f && f.classList.remove('error');
        }
      });

      if (!valid) {
        shakeBtn(bookingBtn);
        showToast('Please fill in all required fields.');
        return;
      }

      // Animate button
      bookingBtn.style.opacity = '0.7';
      bookingBtn.querySelector('span').textContent = 'Processing…';

      setTimeout(() => {
        bookingBtn.style.opacity = '1';
        bookingBtn.querySelector('span').textContent = 'Confirm Reservation';
        modalName.textContent = nameEl.value;
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 1600);
    });

    modalClose.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
      // Reset form
      document.querySelectorAll('#booking input, #booking select, #booking textarea').forEach(el => {
        el.value = '';
      });
      updateSummary && updateSummary();
    });
  }

  function shakeBtn(btn) {
    btn.style.animation = 'shake 0.4s ease';
    btn.addEventListener('animationend', () => { btn.style.animation = ''; }, { once: true });
  }

  // Inject shake keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-6px); }
      40%       { transform: translateX(6px); }
      60%       { transform: translateX(-4px); }
      80%       { transform: translateX(4px); }
    }
    .error { border-color: #e05555 !important; }
  `;
  document.head.appendChild(style);


  /* ══════════════════════════════
     11. TOAST NOTIFICATION
  ══════════════════════════════ */
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--navy-card);
      color: var(--cream);
      border: 1px solid var(--border);
      padding: 14px 28px;
      font-family: var(--font-ui);
      font-size: 0.82rem;
      letter-spacing: 0.05em;
      z-index: 9999;
      opacity: 0;
      transition: all 0.3s ease;
      white-space: nowrap;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }


  /* ══════════════════════════════
     12. CONTACT FORM
  ══════════════════════════════ */
  const btnContact = document.querySelector('.btn-contact');
  if (btnContact) {
    btnContact.addEventListener('click', () => {
      const inputs = document.querySelectorAll('.cf-input');
      let filled = true;
      inputs.forEach(el => {
        if (!el.value.trim()) filled = false;
      });
      if (!filled) {
        showToast('Please complete all fields before sending.');
        return;
      }
      btnContact.textContent = '✦ Message Sent!';
      btnContact.style.background = 'linear-gradient(135deg, #4caf50, #2e7d32)';
      btnContact.style.color = '#fff';
      inputs.forEach(el => el.value = '');
      setTimeout(() => {
        btnContact.textContent = 'Send Message →';
        btnContact.style.background = '';
        btnContact.style.color = '';
      }, 3500);
    });
  }


  /* ══════════════════════════════
     13. BACK TO TOP
  ══════════════════════════════ */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ══════════════════════════════
     14. SMOOTH SCROLL — anchor links
  ══════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 90;
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ══════════════════════════════
     15. PARALLAX — hero background
  ══════════════════════════════ */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    }, { passive: true });
  }


  /* ══════════════════════════════
     16. ROOM CARD — tilt effect (desktop)
  ══════════════════════════════ */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.room-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `
          translateY(-6px)
          rotateX(${-y * 5}deg)
          rotateY(${x * 5}deg)
        `;
        card.style.transition = 'transform 0.1s ease, box-shadow var(--transition), border-color var(--transition)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all var(--transition)';
      });
    });
  }


  /* ══════════════════════════════
     17. MARQUEE — pause on hover
  ══════════════════════════════ */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }


  /* ══════════════════════════════
     18. INTERSECTION — number counters for sections
  ══════════════════════════════ */
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.count));
          delete el.dataset.count;
        });
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.section-about, .section-rooms').forEach(s => {
    aboutObserver.observe(s);
  });


  /* ══════════════════════════════
     19. AMENITY CARD — stagger hover text
  ══════════════════════════════ */
  document.querySelectorAll('.amenity-card').forEach((card, i) => {
    card.style.setProperty('--i', i);
  });


  /* ══════════════════════════════
     20. RESIZE HANDLER
  ══════════════════════════════ */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Re-observe AOS elements that might have shifted
      document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add('aos-animate');
        }
      });
    }, 200);
  });


  /* ══════════════════════════════
     21. SCROLL PROGRESS BAR
  ══════════════════════════════ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(to right, var(--gold-dark), var(--gold-light));
    z-index: 9999;
    width: 0%;
    transition: width 0.1s ease;
    pointer-events: none;
  `;
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const total   = document.documentElement.scrollHeight - window.innerHeight;
    const current = window.scrollY;
    progressBar.style.width = (current / total * 100) + '%';
  }, { passive: true });


  console.log('%c✦ Grand Aurum Hotel ✦', 'font-size:20px;color:#c9a84c;font-family:Georgia,serif;');
  console.log('%cWhere Legends Rest — Built with craft & precision.', 'font-size:12px;color:#8a8070;');
});