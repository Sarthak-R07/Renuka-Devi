// ===== DOM REFERENCES =====
const navbar = document.getElementById('main-nav');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('back-to-top');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentImageIndex = 0;
const galleryData = [];

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initDarshanDate();
    initNavbar();
    initGallery();
    initGalleryTabs();
    initFAQ();
    initDonationCounter();
    initSharing();
    initBackToTop();
});

// ===== SCROLL ANIMATIONS (IntersectionObserver for performance) =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger animation delay
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach((el, idx) => {
        el.dataset.delay = Math.min(idx % 4, 3) * 100;
        observer.observe(el);
    });
}

// ===== NAVBAR =====
function initNavbar() {
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const curr = window.scrollY;
        navbar.classList.toggle('scrolled', curr > 50);
        lastScroll = curr;
        updateActiveNav();
    }, { passive: true });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function updateActiveNav() {
    const sections = ['home','about','about-us','history','visit','gallery','help','complaint'];
    let current = '';
    for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
    }
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
}

// ===== GALLERY & LIGHTBOX =====
function initGallery() {
    galleryItems.forEach((item, idx) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');
        galleryData.push({
            src: img.src,
            alt: img.alt,
            caption: caption ? caption.textContent : ''
        });
        item.addEventListener('click', () => openLightbox(idx));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(dir) {
    currentImageIndex = (currentImageIndex + dir + galleryData.length) % galleryData.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const data = galleryData[currentImageIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
}

// ===== SOCIAL SHARING =====
function initSharing() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('श्री रेणुका देवी मंदिर, राणीसावरगाव - पवित्र तीर्थक्षेत्र');
    const text = encodeURIComponent('राणीसावरगावचे प्राचीन रेणुका देवी मंदिर पहा! मराठवाड्याच्या मातीतलं पवित्र तीर्थक्षेत्र.');

    const wa = document.getElementById('share-whatsapp');
    const fb = document.getElementById('share-facebook');
    const tw = document.getElementById('share-twitter');
    const cp = document.getElementById('share-copy');

    if (wa) wa.href = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (tw) tw.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;

    // Open share links in new window
    [wa, fb, tw].forEach(btn => {
        if (btn) {
            btn.target = '_blank';
            btn.rel = 'noopener noreferrer';
        }
    });

    if (cp) {
        cp.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(window.location.href);
                cp.textContent = '✅ Copied!';
                setTimeout(() => { cp.textContent = '📋 Copy Link'; }, 2000);
            } catch {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = window.location.href;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                cp.textContent = '✅ Copied!';
                setTimeout(() => { cp.textContent = '📋 Copy Link'; }, 2000);
            }
        });
    }
}

// ===== BACK TO TOP =====
function initBackToTop() {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== GALLERY TABS FILTER =====
function initGalleryTabs() {
    const tabs = document.querySelectorAll('.gtab');
    const items = document.querySelectorAll('.gallery-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const cat = tab.dataset.cat;
            items.forEach(item => {
                if (cat === 'all' || item.dataset.cat === cat) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
}

// ===== FAQ ACCORDION =====
function initFAQ() {
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
}

// ===== ANIMATED DONATION COUNTER =====
function initDonationCounter() {
    // Simulated data – replace with real backend values
    const targets = { 'donor-count': 247, 'donation-total': 98500, 'visitor-count': 4312 };
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                Object.entries(targets).forEach(([id, target]) => {
                    animateCount(id, target);
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    const strip = document.getElementById('donation-strip');
    if (strip) observer.observe(strip);
}

function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    const duration = 1800;
    const start = performance.now();
    const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target).toLocaleString('hi-IN');
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

// ===== COMPLAINT FORM =====
function selectCType(card, type) {
    document.querySelectorAll('.ctype-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    const h = document.getElementById('ctype');
    if (h) h.value = type;
}

function submitComplaint(e) {
    e.preventDefault();
    const form = document.getElementById('complaint-form');
    const success = document.getElementById('csuccess');
    if (form && success) {
        form.style.display = 'none';
        success.style.display = 'flex';
    }
}

function resetForm() {
    const form = document.getElementById('complaint-form');
    const success = document.getElementById('csuccess');
    if (form) { form.reset(); form.style.display = 'block'; }
    if (success) success.style.display = 'none';
    document.querySelectorAll('.ctype-card').forEach(c => c.classList.remove('selected'));
}

// ===== DONATION MODAL =====
function openDonationModal() {
    const modal = document.getElementById('donation-modal');
    if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
}

function closeDonationModal(e) {
    if (e && e.target !== document.getElementById('donation-modal')) return;
    const modal = document.getElementById('donation-modal');
    if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
}

function setAmount(val) {
    document.querySelectorAll('.damount').forEach(b => b.classList.remove('selected'));
    const inp = document.getElementById('custom-amount');
    if (inp) inp.value = val;
    event.currentTarget.classList.add('selected');
}

function copyUPI() {
    const upi = document.getElementById('upi-display');
    if (!upi) return;
    navigator.clipboard.writeText(upi.textContent).then(() => {
        const btn = document.querySelector('.copy-upi-btn');
        if (btn) { btn.textContent = '✅ कॉपी झाले!'; setTimeout(() => btn.textContent = '📋 कॉपी करा', 2000); }
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = upi.textContent;
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
    });
}

/* ===== TODAY'S DARSHAN DATE ===== */
function initDarshanDate() {
    const d = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = d.toLocaleDateString('mr-IN', options);
    const dateEl = document.getElementById('today-date');
    if (dateEl) dateEl.textContent = dateStr;
}

/* ===== AUDIO TOGGLE ===== */
function toggleAudio() {
    const audio = document.getElementById('temple-audio');
    const toggleBtn = document.getElementById('audio-toggle');
    const icon = document.getElementById('audio-icon');
    if (!audio) return;
    
    if (audio.paused) {
        audio.play().catch(e => console.log('Audio play failed', e));
        icon.textContent = '🔊';
        toggleBtn.classList.add('playing');
    } else {
        audio.pause();
        icon.textContent = '🔇';
        toggleBtn.classList.remove('playing');
    }
}

/* ===== FLOWER OFFERING (PUSHPVRISHTI) ===== */
function offerFlowers() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    const flowers = ['🌺', '🌼', '🌸', '🏵️', '🍁'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const f = document.createElement('div');
            f.className = 'falling-flower';
            f.textContent = flowers[Math.floor(Math.random() * flowers.length)];
            f.style.left = Math.random() * 100 + 'vw';
            f.style.fontSize = (Math.random() * 20 + 16) + 'px';
            f.style.animationDuration = (Math.random() * 3 + 2) + 's';
            container.appendChild(f);
            
            setTimeout(() => f.remove(), 5000);
        }, i * 40);
    }
    
    setTimeout(() => container.remove(), 7000);
}
