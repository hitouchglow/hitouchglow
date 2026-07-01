document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     MOBILE NAVIGATION HAMBURGER
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinksArr = document.querySelectorAll('.nav-links a');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navLinks.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinksArr.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     INTERSECTION OBSERVER - SCROLL REVEAL
     ========================================================================== */
  const revealElements = document.querySelectorAll('.animate-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Trigger only once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ==========================================================================
     Intersection Observer - PROGRESS BARS & SKILLS
     ========================================================================== */
  const whyChooseUsSection = document.getElementById('why-choose-us');
  const skillBars = document.querySelectorAll('.bar-fill');
  const skillPercents = document.querySelectorAll('.skill-percent');
  let skillsAnimated = false;

  const animateSkills = () => {
    // Fill up widths
    skillBars.forEach(bar => {
      const targetWidth = bar.getAttribute('data-width');
      bar.style.width = targetWidth;
    });

    // Animate percentage numbers
    skillPercents.forEach(percentEl => {
      const targetVal = parseInt(percentEl.getAttribute('data-target'), 10);
      const duration = 1500;
      const increment = targetVal / (duration / 16);
      let current = 0;

      const updatePercent = () => {
        current += increment;
        if (current < targetVal) {
          percentEl.textContent = Math.floor(current) + '%';
          requestAnimationFrame(updatePercent);
        } else {
          percentEl.textContent = targetVal + '%';
        }
      };
      
      updatePercent();
    });
  };

  if (whyChooseUsSection) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !skillsAnimated) {
          animateSkills();
          skillsAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillsObserver.observe(whyChooseUsSection);
  }

  /* ==========================================================================
     Intersection Observer - METRICS COUNTER ANIMATION
     ========================================================================== */
  const metricsSection = document.querySelector('.metrics-section');
  const metricValues = document.querySelectorAll('.metric-value');
  let metricsAnimated = false;

  const animateMetrics = () => {
    metricValues.forEach(metric => {
      const targetVal = parseInt(metric.getAttribute('data-target'), 10);
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60; // 60 fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;

      const easeOutQuad = t => t * (2 - t);

      const countUp = () => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentValue = Math.round(targetVal * progress);

        metric.textContent = currentValue;

        if (frame < totalFrames) {
          requestAnimationFrame(countUp);
        } else {
          metric.textContent = targetVal;
        }
      };

      countUp();
    });
  };

  if (metricsSection && metricValues.length > 0) {
    const metricsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !metricsAnimated) {
          animateMetrics();
          metricsAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    metricsObserver.observe(metricsSection);
  }

  /* ==========================================================================
     INTERACTIVE BEFORE & AFTER SLIDER MATH
     ========================================================================== */
  const slider = document.getElementById('compareSlider');
  const handle = document.getElementById('sliderHandle');
  const beforeWrapper = document.getElementById('beforeImageWrapper');

  if (slider && handle && beforeWrapper) {
    let isDragging = false;

    const setSliderPos = (x) => {
      const rect = slider.getBoundingClientRect();
      if (rect.width === 0) return;
      
      let pos = (x - rect.left) / rect.width;
      
      // Clamp pos between 0 and 1
      if (pos < 0) pos = 0;
      if (pos > 1) pos = 1;

      const percentage = pos * 100;
      
      // Update handle position
      handle.style.left = `${percentage}%`;
      // Update image clip path
      beforeWrapper.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    };

    // Desktop Mouse events
    handle.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevents image drag / selection hijacking
      isDragging = true;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPos(e.clientX);
    });

    // Mobile Touch events (use { passive: false } to allow e.preventDefault() to block touch scroll)
    handle.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Prevents scroll pull-down conflicts
      isDragging = true;
    }, { passive: false });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault(); // Blocks default touch scrolling while sliding
      setSliderPos(e.touches[0].clientX);
    }, { passive: false });

    // Click anywhere on slider to adjust divider
    slider.addEventListener('click', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      setSliderPos(e.clientX);
    });
  }

  /* ==========================================================================
     MODAL FOR APPOINTMENT BOOKING / QUOTES
     ========================================================================== */
  const quoteModal = document.getElementById('quoteModal');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtn = document.getElementById('closeModal');
  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  const successCloseBtn = document.getElementById('successClose');

  const openModal = () => {
    quoteModal.classList.add('open');
    quoteModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Stop background scroll
    setTimeout(() => {
      const firstInput = document.getElementById('fullName');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  const closeModal = () => {
    quoteModal.classList.remove('open');
    quoteModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    // Reset forms after zoom-out transition
    setTimeout(() => {
      if (quoteForm && formSuccess) {
        quoteForm.reset();
        quoteForm.style.display = 'flex';
        formSuccess.style.display = 'none';
      }
    }, 400);
  };

  openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && quoteModal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Online Service Booking Form Submit
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = quoteForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;

      // Mock API request
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        quoteForm.style.display = 'none';
        formSuccess.style.display = 'flex';
      }, 1200);
    });
  }


  /* ==========================================================================
     HEADER SCROLL EFFECTS (Dynamic Logo Blending) & BACK TO TOP PROGRESS RING
     ========================================================================== */
  const header = document.querySelector('.main-header');
  const logoImg = document.querySelector('.main-header .logo-img');
  const markScrolled = document.querySelector('.main-header .mark-scrolled');
  const backToTopBtn = document.getElementById('backToTop');
  const progressCircle = document.getElementById('progressCircle');
  const circumference = 125.66; // 2 * PI * 20

  // Click scroll back to top handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  if (header && logoImg && markScrolled) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      // 1. Dynamic Logo Blending
      const blendDist = 120;
      let ratio = scrollY / blendDist;
      if (ratio < 0) ratio = 0;
      if (ratio > 1) ratio = 1;
      
      logoImg.style.opacity = 1 - ratio;
      logoImg.style.transform = `scale(${1 - 0.2 * ratio})`;
      
      markScrolled.style.opacity = ratio;
      markScrolled.style.transform = `scale(${0.8 + 0.2 * ratio})`;
      
      if (ratio > 0.8) {
        logoImg.style.pointerEvents = 'none';
        markScrolled.style.pointerEvents = 'auto';
      } else {
        logoImg.style.pointerEvents = 'auto';
        markScrolled.style.pointerEvents = 'none';
      }
      
      // 2. Header size & background changes
      if (scrollY > 50) {
        header.style.padding = '10px 0';
        header.style.background = 'rgba(10, 10, 12, 0.95)';
        header.classList.add('scrolled');
      } else {
        header.style.padding = '16px 0';
        header.style.background = 'rgba(10, 10, 12, 0.9)';
        header.classList.remove('scrolled');
      }
      
      // 3. Hero Background Blur on Scroll (Bottom to Up rising blur)
      const heroBgBlurred = document.querySelector('.hero-bg-blurred');
      if (heroBgBlurred) {
        const maxScroll = 400;
        let ratio = scrollY / maxScroll;
        if (ratio < 0) ratio = 0;
        if (ratio > 1) ratio = 1;
        
        // Show the blurred layer as the user scrolls
        heroBgBlurred.style.opacity = ratio > 0.02 ? 1 : 0;
        
        // Calculate the rising mask gradient points
        const percentVal = ratio * 120; // scales up to 120% to fully cover the top
        const startPoint = Math.max(0, percentVal - 30);
        const endPoint = percentVal + 30;
        
        const gradientStr = `linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${startPoint}%, rgba(0,0,0,0) ${endPoint}%)`;
        heroBgBlurred.style.maskImage = gradientStr;
        heroBgBlurred.style.webkitMaskImage = gradientStr;
      }

      // 4. Back to Top Ring Progress & Visibility
      if (backToTopBtn && progressCircle) {
        // Toggle visibility at 200px scrolled down
        if (scrollY > 200) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
        
        // Calculate scroll progress percentage
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progressRatio = totalHeight > 0 ? (scrollY / totalHeight) : 0;
        
        // Map ratio to dashoffset (circumference fills up from 125.66 to 0)
        const dashoffset = circumference - (progressRatio * circumference);
        progressCircle.style.strokeDashoffset = dashoffset;
      }
    });
  }
});
