/* ==========================================================================
   Socido Website — Interactive Logic (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Drawer Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });
  }

  // 2. Active Navigation Tab Highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 3. Animated Number Counter for Stats
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetValue = parseInt(el.getAttribute('data-target') || el.innerText.replace(/[^0-9]/g, ''));
          const suffix = el.getAttribute('data-suffix') || '+';
          
          if (!isNaN(targetValue)) {
            let start = 0;
            const duration = 1500;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = targetValue / steps;
            
            const timer = setInterval(() => {
              start += increment;
              if (start >= targetValue) {
                el.innerText = targetValue.toLocaleString() + suffix;
                clearInterval(timer);
              } else {
                el.innerText = Math.floor(start).toLocaleString() + suffix;
              }
            }, stepTime);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  // 4. Modal Handler for Projects & Support
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  if (modalOverlay && modalClose) {
    modalClose.addEventListener('click', () => closeModal());
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  window.openModal = function(title, contentHtml) {
    if (!modalOverlay) return;
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (modalTitle) modalTitle.innerText = title;
    if (modalBody) modalBody.innerHTML = contentHtml;

    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    if (!modalOverlay) return;
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  };
});
