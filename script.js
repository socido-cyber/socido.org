/* ==========================================================================
   Socido Website — Interactive Logic (script.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Drawer Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking a link on mobile
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (mobileToggle) mobileToggle.innerHTML = '☰';
      });
    });
  }

  // ==========================================================================
  // Interactive Photo Gallery Lightbox (Click-to-Zoom with Keyboard & Swipe)
  // ==========================================================================
  initLightbox();
});

function initLightbox() {
  const galleryCards = document.querySelectorAll('.gallery-card');
  if (!galleryCards.length) return;

  const items = [];

  galleryCards.forEach((card, index) => {
    const img = card.querySelector('img');
    if (!img) return;

    // Add visual zoom badge to thumbnail if not present
    const thumb = card.querySelector('.gallery-card-thumb') || card;
    if (!thumb.querySelector('.gallery-zoom-badge')) {
      const badge = document.createElement('div');
      badge.className = 'gallery-zoom-badge';
      badge.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <span>Enlarge</span>
      `;
      thumb.appendChild(badge);
    }

    // Determine caption: check for .gallery-caption first, then fallback to alt
    const captionEl = card.querySelector('.gallery-caption');
    let captionText = captionEl ? captionEl.textContent.trim() : (img.getAttribute('alt') || '');

    items.push({
      src: img.getAttribute('src'),
      alt: img.getAttribute('alt') || '',
      caption: captionText,
      card: card
    });

    const itemIndex = items.length - 1;

    // Accessibility attributes on the card
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View photo: ${captionText || 'Gallery photo'}`);

    const openHandler = (e) => {
      e.preventDefault();
      openLightbox(itemIndex);
    };

    card.addEventListener('click', openHandler);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(itemIndex);
      }
    });
  });

  // Inject Lightbox Modal DOM if not already present
  let lightbox = document.getElementById('socidoLightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'socidoLightbox';
    lightbox.className = 'lightbox-modal';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-hidden', 'true');
    lightbox.innerHTML = `
      <div class="lightbox-backdrop" title="Click outside to close"></div>
      <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous photo">&#10094;</button>
      <div class="lightbox-content">
        <div class="lightbox-image-wrap">
          <img id="lightboxImg" src="" alt="">
        </div>
        <div class="lightbox-info">
          <span class="lightbox-counter" id="lightboxCounter"></span>
          <p class="lightbox-caption" id="lightboxCaption"></p>
        </div>
      </div>
      <button class="lightbox-nav lightbox-next" aria-label="Next photo">&#10095;</button>
    `;
    document.body.appendChild(lightbox);
  }

  const lbImg = document.getElementById('lightboxImg');
  const lbCounter = document.getElementById('lightboxCounter');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose = lightbox.querySelector('.lightbox-close');
  const lbPrev = lightbox.querySelector('.lightbox-prev');
  const lbNext = lightbox.querySelector('.lightbox-next');
  const lbBackdrop = lightbox.querySelector('.lightbox-backdrop');

  let currentIndex = 0;
  let lastActiveElement = null;

  function preloadAdjacent() {
    const nextIdx = (currentIndex + 1) % items.length;
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    const imgNext = new Image();
    imgNext.src = items[nextIdx].src;
    const imgPrev = new Image();
    imgPrev.src = items[prevIdx].src;
  }

  function showImage(index) {
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    currentIndex = index;

    const item = items[currentIndex];

    // Subtle fade transition
    lbImg.style.opacity = '0';
    lbImg.style.transform = 'scale(0.97)';

    const newImg = new Image();
    newImg.src = item.src;
    newImg.onload = () => {
      lbImg.src = item.src;
      lbImg.alt = item.alt;
      lbImg.style.opacity = '1';
      lbImg.style.transform = 'scale(1)';
    };

    lbCounter.textContent = `Photo ${currentIndex + 1} of ${items.length}`;
    lbCaption.textContent = item.caption;

    preloadAdjacent();
  }

  function openLightbox(index) {
    lastActiveElement = document.activeElement;
    showImage(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
      lastActiveElement.focus();
    }
  }

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);

  lbPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex - 1);
  });

  lbNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showImage(currentIndex + 1);
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showImage(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      showImage(currentIndex + 1);
    }
  });

  // Mobile Touch Swipe detection
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        showImage(currentIndex + 1); // Swipe left -> Next
      } else {
        showImage(currentIndex - 1); // Swipe right -> Previous
      }
    }
  }, { passive: true });
}
