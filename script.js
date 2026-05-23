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

// ========== INTERNATIONALIZATION (i18n) ==========
let currentLang = localStorage.getItem('site_lang') || 'mr';

function toggleLanguage() {
    currentLang = currentLang === 'mr' ? 'en' : 'mr';
    localStorage.setItem('site_lang', currentLang);
    applyTranslations();
    updateToggleUI();
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (typeof translations !== 'undefined' && translations[key] && translations[key][currentLang]) {
            if (el.tagName.toLowerCase() === 'input' || el.tagName.toLowerCase() === 'textarea') {
                el.placeholder = translations[key][currentLang];
            } else {
                el.innerHTML = translations[key][currentLang];
            }
        }
    });
    if (currentLang === 'en') {
        document.title = "Renuka Devi Temple | Ranisawargaon";
    } else {
        document.title = "श्री रेणुका देवी मंदिर | राणीसावरगाव";
    }
}

function updateToggleUI() {
    const btn = document.getElementById('lang-toggle-btn');
    if (btn) {
        btn.innerHTML = currentLang === 'mr' ? '<span class="lang-icon">🌐</span> ENG' : '<span class="lang-icon">🌐</span> मराठी';
    }
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Preloader Logic
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.style.display = 'none', 800);
        }, 1500);
    }


    applyTranslations();
    updateToggleUI();
    initScrollAnimations();
    initDarshanDate();
    initNavbar();
    initGallery();
    initGalleryTabs();
    initFAQ();
    initDonationCounter();
    initSharing();
    initBackToTop();
    
    // Auto-open welcome popup on page load
    setTimeout(() => {
        const welcomePopup = document.getElementById('welcome-popup');
        if (welcomePopup) {
            welcomePopup.classList.add('active');
        }
    }, 2800);
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

// ===== NAVBAR & PARALLAX =====
function initNavbar() {
    const parallaxBg = document.getElementById('parallax-bg');
    
    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const curr = window.scrollY;
        navbar.classList.toggle('scrolled', curr > 50);
        
        // Parallax depth effect
        if (parallaxBg) {
            parallaxBg.style.transform = `translateY(${curr * 0.4}px)`;
        }

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
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
    updateUPIUrl(val);
}

function updateUPIUrl(amount) {
    const upiLink = document.getElementById('upi-deep-link');
    if (upiLink && amount > 0) {
        // Update these with the actual temple UPI details
        const upiId = "renukadevi@upi";
        const payeeName = "Shri%20Renuka%20Devi%20Temple";
        upiLink.href = `upi://pay?pa=${upiId}&pn=${payeeName}&cu=INR&am=${amount}`;
    }
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
    
    const flowers = ['🌺', '🌼', '🌸', '🏵️', '🍁', '✨', '🪷', '🍃'];
    
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const f = document.createElement('div');
            f.className = 'falling-flower';
            f.textContent = flowers[Math.floor(Math.random() * flowers.length)];
            f.style.left = Math.random() * 100 + 'vw';
            f.style.fontSize = (Math.random() * 25 + 15) + 'px';
            f.style.animationDuration = (Math.random() * 4 + 3) + 's';
            container.appendChild(f);
            
            setTimeout(() => f.remove(), 7000);
        }, i * 50);
    }
    
    setTimeout(() => container.remove(), 10000);
}

/* ===== VIRTUAL PUJA MENU ===== */
function togglePujaMenu() {
    const menu = document.getElementById('puja-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// Close puja menu when clicking outside
document.addEventListener('click', (e) => {
    const container = document.querySelector('.puja-menu-container');
    const menu = document.getElementById('puja-menu');
    if (container && menu && !container.contains(e.target)) {
        menu.classList.remove('active');
    }
});

/* ===== LIGHT DIYA ===== */
function lightDiya() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    
    // Spawn 5 diyas across the screen
    const positions = [15, 32.5, 50, 67.5, 85];
    for (let i = 0; i < positions.length; i++) {
        setTimeout(() => {
            const diya = document.createElement('div');
            diya.className = 'virtual-diya';
            diya.textContent = '🪔';
            diya.style.left = `calc(${positions[i]}vw - 2.25rem)`; // Center the 4.5rem diya
            container.appendChild(diya);
        }, i * 250); // Stagger appearance
    }
    
    setTimeout(() => container.remove(), 7000);
}

/* ===== RING BELL ===== */
function ringBell() {
    const bell = document.createElement('div');
    bell.className = 'virtual-bell';
    bell.textContent = '🔔';
    document.body.appendChild(bell);
    
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Richer bell sound with 3 oscillators
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const osc3 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'triangle';
        osc1.frequency.setValueAtTime(500, audioCtx.currentTime);
        osc2.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc3.frequency.setValueAtTime(1200, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.5);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        osc3.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc1.start(); osc2.start(); osc3.start();
        osc1.stop(audioCtx.currentTime + 4);
        osc2.stop(audioCtx.currentTime + 4);
        osc3.stop(audioCtx.currentTime + 4);
    } catch(e) {
        console.log("AudioContext not supported or blocked");
    }
    
    setTimeout(() => bell.remove(), 4000);
}
