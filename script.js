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
    // ===== 🎬 CINEMATIC MYTHOLOGICAL PRELOADER 🎬 =====
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloader-progress-bar');
    const progressGlow = document.getElementById('pl-progress-glow');
    const sparklesContainer = document.getElementById('pl-sparkles');
    const lightburst = document.getElementById('pl-lightburst');

    // Generate 30 floating sacred embers
    if (sparklesContainer) {
        for (let i = 0; i < 30; i++) {
            const s = document.createElement('div');
            s.className = 'pl-sparkle';
            const size = 2 + Math.random() * 6;
            s.style.width = size + 'px';
            s.style.height = size + 'px';
            s.style.left = Math.random() * 100 + '%';
            s.style.top = (50 + Math.random() * 50) + '%';
            s.style.setProperty('--dur', (5 + Math.random() * 8) + 's');
            s.style.setProperty('--delay', (Math.random() * -10) + 's');
            s.style.setProperty('--travel', -(80 + Math.random() * 200) + 'px');
            sparklesContainer.appendChild(s);
        }
    }

    if (preloader) {
        // Stage 1 (0.5s): Trigger golden light burst behind logo
        setTimeout(() => {
            if (lightburst) lightburst.classList.add('active');
        }, 500);

        // Stage 2 (1s): Start progress bar fill
        setTimeout(() => {
            if (progressBar) progressBar.style.width = '100%';
            if (progressGlow) progressGlow.style.left = '100%';
        }, 1000);

        // Stage 3 (3.5s): Dismiss preloader with slow cinematic fade
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => preloader.style.display = 'none', 1200);
        }, 3500);
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
        const upiId = "shrirenukadevi@axl";
        const payeeName = "Renukadevi%20Sansthan";
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
    
    const flowers = ['🌺', '🌼', '🌸', '🏵️', '🌹'];
    
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

// ===== VIRTUAL HUNDI (DONATION) =====
function offerDakshina() {
    const coin = document.getElementById('hundi-coin');
    const pot = document.getElementById('hundi-pot');
    const btn = document.getElementById('offer-dakshina-btn');
    
    // Quick drop sound (clink)
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    } catch(e) {}
    
    btn.style.pointerEvents = 'none';
    btn.style.opacity = '0.5';
    
    coin.classList.remove('drop');
    void coin.offsetWidth; // trigger reflow
    coin.classList.add('drop');
    
    setTimeout(() => {
        pot.classList.add('shake');
        setTimeout(() => pot.classList.remove('shake'), 400);
    }, 500); // Coin hits pot
    
    setTimeout(() => {
        document.getElementById('hundi-interaction-step').style.display = 'none';
        document.getElementById('hundi-details-step').style.display = 'block';
    }, 1100);
}

function resetHundi() {
    const interactionStep = document.getElementById('hundi-interaction-step');
    const detailsStep = document.getElementById('hundi-details-step');
    const coin = document.getElementById('hundi-coin');
    const btn = document.getElementById('offer-dakshina-btn');
    
    if(interactionStep) interactionStep.style.display = 'block';
    if(detailsStep) detailsStep.style.display = 'none';
    if(coin) coin.classList.remove('drop');
    
    if(btn) {
        btn.style.pointerEvents = 'auto';
        btn.style.opacity = '1';
    }
}

// ===== MAGICAL MOUSE TRAIL =====
function initMagicTrail() {
    let lastTime = 0;
    const throttleMs = 40; // Control sparkle density

    function createSparkle(x, y) {
        const now = Date.now();
        if (now - lastTime < throttleMs) return;
        lastTime = now;

        const sparkle = document.createElement('div');
        sparkle.className = 'magic-sparkle';
        
        // Randomize drift direction variables for CSS
        const tx = (Math.random() - 0.5) * 2;
        const ty = Math.random() * 1.5 - 0.2;
        
        // Slight randomization in position so it's not a rigid line
        const offsetX = (Math.random() - 0.5) * 10;
        const offsetY = (Math.random() - 0.5) * 10;
        
        sparkle.style.left = (x + offsetX) + 'px';
        sparkle.style.top = (y + offsetY) + 'px';
        sparkle.style.setProperty('--tx', tx);
        sparkle.style.setProperty('--ty', ty);
        
        document.body.appendChild(sparkle);
        
        // Remove from DOM after animation completes
        setTimeout(() => sparkle.remove(), 1000);
    }

    window.addEventListener('mousemove', (e) => {
        createSparkle(e.clientX, e.clientY);
    }, {passive: true});

    window.addEventListener('touchmove', (e) => {
        if(e.touches.length > 0) {
            createSparkle(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, {passive: true});
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initMagicTrail);

// ===== AARTI THALI LOGIC =====
let aartiOsc;
let aartiGain;
let aartiAudioCtx;
let isAartiActive = false;
let isDragging = false;

function startAarti() {
    const container = document.getElementById('aarti-container');
    const thali = document.getElementById('aarti-thali');
    
    container.style.display = 'flex';
    
    // Initial position center
    thali.style.left = '50%';
    thali.style.top = '50%';
    
    isAartiActive = true;
    
    // Setup continuous bell sound
    try {
        if(!aartiAudioCtx) aartiAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        aartiOsc = aartiAudioCtx.createOscillator();
        aartiGain = aartiAudioCtx.createGain();
        
        aartiOsc.type = 'triangle';
        aartiOsc.frequency.setValueAtTime(800, aartiAudioCtx.currentTime);
        
        // Tremolo effect for ringing
        const lfo = aartiAudioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 15; // fast ring
        const lfoGain = aartiAudioCtx.createGain();
        lfoGain.gain.value = 400; // pitch modulation amount
        lfo.connect(lfoGain);
        lfoGain.connect(aartiOsc.frequency);
        lfo.start();
        
        aartiGain.gain.setValueAtTime(0, aartiAudioCtx.currentTime); // start silent
        
        aartiOsc.connect(aartiGain);
        aartiGain.connect(aartiAudioCtx.destination);
        aartiOsc.start();
    } catch(e) {}
}

function stopAarti() {
    document.getElementById('aarti-container').style.display = 'none';
    isAartiActive = false;
    isDragging = false;
    if(aartiGain && aartiAudioCtx) {
        aartiGain.gain.setTargetAtTime(0, aartiAudioCtx.currentTime, 0.1);
        setTimeout(() => { if(aartiOsc) { aartiOsc.stop(); aartiOsc = null; } }, 500);
    }
}

// Drag logic
const thali = document.getElementById('aarti-thali');
if(thali) {
    function handleMove(clientX, clientY) {
        if(!isAartiActive || !isDragging) return;
        
        // Hide instructions once started
        const inst = document.getElementById('aarti-instructions');
        if(inst.style.opacity !== '0') {
            inst.style.transition = 'opacity 0.5s';
            inst.style.opacity = '0';
        }

        thali.style.left = clientX + 'px';
        thali.style.top = clientY + 'px';
        
        // Adjust volume based on movement speed (simple check: if moving, keep volume up)
        if(aartiGain && aartiAudioCtx) {
            aartiGain.gain.setTargetAtTime(0.15, aartiAudioCtx.currentTime, 0.1);
            
            // Stop sound shortly after if movement stops
            clearTimeout(thali.moveTimeout);
            thali.moveTimeout = setTimeout(() => {
                if(aartiGain) aartiGain.gain.setTargetAtTime(0.01, aartiAudioCtx.currentTime, 0.5);
            }, 300);
        }
    }

    thali.addEventListener('mousedown', (e) => { isDragging = true; });
    document.addEventListener('mousemove', (e) => { if(isDragging) handleMove(e.clientX, e.clientY); });
    document.addEventListener('mouseup', () => { isDragging = false; if(aartiGain && aartiAudioCtx) aartiGain.gain.setTargetAtTime(0, aartiAudioCtx.currentTime, 0.2); });

    thali.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); }, {passive: false});
    document.addEventListener('touchmove', (e) => { if(isDragging && e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY); }, {passive: false});
    document.addEventListener('touchend', () => { isDragging = false; if(aartiGain && aartiAudioCtx) aartiGain.gain.setTargetAtTime(0, aartiAudioCtx.currentTime, 0.2); });
}

// ===== TEMPLE DRUMS (NAGARA) =====
function playDrum() {
    // 1. Visuals
    const drumContainer = document.createElement('div');
    drumContainer.className = 'virtual-drum-container';
    drumContainer.innerHTML = '<div class="drum-emoji">🥁</div><div class="drum-shockwave"></div>';
    document.body.appendChild(drumContainer);
    
    setTimeout(() => drumContainer.remove(), 1000);

    // 2. Audio (Synthesized deep drum beat)
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // The boom (low frequency sine dropping fast)
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.8);
        
        // The snap (noise/triangle burst)
        const snapOsc = audioCtx.createOscillator();
        const snapGain = audioCtx.createGain();
        snapOsc.type = 'triangle';
        snapOsc.frequency.setValueAtTime(120, audioCtx.currentTime);
        snapGain.gain.setValueAtTime(0.5, audioCtx.currentTime);
        snapGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        snapOsc.connect(snapGain);
        snapGain.connect(audioCtx.destination);
        
        snapOsc.start();
        snapOsc.stop(audioCtx.currentTime + 0.1);

    } catch(e) {
        console.log("AudioContext not supported");
    }
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
}

// ===== FLOATING AMBIENT PARTICLES =====
function initAmbientParticles() {
    const container = document.getElementById('ambient-particles-container');
    if (!container) return;

    const particleCount = 20; // Medium density — visible but not crowded

    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'ambient-particle';

        // Bigger size (6px to 14px) — clearly visible
        const size = 6 + Math.random() * 8;
        p.style.width = size + 'px';
        p.style.height = size + 'px';

        // Random starting position spread across viewport
        p.style.left = (5 + Math.random() * 90) + 'vw';
        p.style.top = (5 + Math.random() * 90) + 'vh';

        // Calm, slow animation
        const duration = 10 + Math.random() * 10; // 10s–20s (slow drift)
        const delay = Math.random() * -15; // Stagger
        const dx = (Math.random() - 0.5) * 120; // Gentle horizontal sway
        const dy = -(30 + Math.random() * 100); // Gentle upward float
        const dx2 = (Math.random() - 0.5) * 80;
        const dy2 = -(60 + Math.random() * 120);
        const maxOpacity = 0.4 + Math.random() * 0.3; // 0.4–0.7 — clearly visible

        p.style.setProperty('--duration', duration + 's');
        p.style.setProperty('--delay', delay + 's');
        p.style.setProperty('--dx', dx + 'px');
        p.style.setProperty('--dy', dy + 'px');
        p.style.setProperty('--dx2', dx2 + 'px');
        p.style.setProperty('--dy2', dy2 + 'px');
        p.style.setProperty('--max-opacity', maxOpacity);

        container.appendChild(p);
    }
}

// ===== DAILY SUVICHAR =====
const suvicharQuotes = [
    { text: "ज्यांच्या हृदयात भगवंत आहे, त्यांना जगात कशाचीही कमतरता भासत नाही.", author: "- संत तुकाराम" },
    { text: "भक्ती हाच खरा मार्ग आहे, जो थेट देवापर्यंत पोहोचतो.", author: "- संत ज्ञानेश्वर" },
    { text: "रेणुका मातेच्या चरणी लीन व्हा, सर्व संकटे दूर होतील.", author: "- आध्यात्मिक विचार" },
    { text: "कर्मावर विश्वास ठेवा, फळ देण्याची जबाबदारी ईश्वराची आहे.", author: "- श्रीमद्भगवद्गीता" },
    { text: "अहंकार सोडला की, ईश्वराचे दर्शन होते.", author: "- संत एकनाथ" },
    { text: "मनातील श्रद्धा आणि भक्ती हाच खरा ईश्वरी प्रसाद आहे.", author: "- संत रामदास" },
    { text: "सत्कर्म हेच जीवनाचे खरे सार्थक आहे.", author: "- संत नामदेव" }
];

function initSuvichar() {
    const quoteText = document.getElementById('daily-quote-text');
    const quoteAuthor = document.getElementById('daily-quote-author');
    if(!quoteText || !quoteAuthor) return;
    
    // Pick quote based on day of year so it changes daily
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    const quoteIndex = dayOfYear % suvicharQuotes.length;
    quoteText.textContent = `"${suvicharQuotes[quoteIndex].text}"`;
    quoteAuthor.textContent = suvicharQuotes[quoteIndex].author;
}

// Initialize both on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initAmbientParticles();
    initSuvichar();
});
