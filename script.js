/* =====================================================
   R Caterers & Events — Main Script
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Navbar scroll behaviour ── */
    const navbar = document.getElementById('navbar');
    const backTop = document.getElementById('back-top');

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 60;
        navbar.classList.toggle('scrolled', scrolled);
        backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    /* ── Hamburger menu ── */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        });
    });

    /* ── Smooth active nav link on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollMid = window.scrollY + window.innerHeight / 2;
        sections.forEach(sec => {
            const top    = sec.offsetTop;
            const bottom = top + sec.offsetHeight;
            const link   = document.querySelector(`.nav-link[href="#${sec.id}"]`);
            if (link) link.classList.toggle('active', scrollMid >= top && scrollMid < bottom);
        });
    }, { passive: true });

    /* ── Scroll reveal ── */
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));

    /* ── Counter animation ── */
    const counters = document.querySelectorAll('.stat-num');
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            counterObs.unobserve(entry.target);
            const target  = parseInt(entry.target.dataset.target, 10);
            const duration = 1800;
            const step    = target / (duration / 16);
            let current   = 0;
            const timer   = setInterval(() => {
                current = Math.min(current + step, target);
                entry.target.textContent = Math.floor(current).toLocaleString();
                if (current >= target) clearInterval(timer);
            }, 16);
        });
    }, { threshold: 0.5 });
    counters.forEach(el => counterObs.observe(el));

    /* ── Gallery filter ── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            galleryItems.forEach(item => {
                const match = filter === 'all' || item.dataset.cat === filter;
                if (match) {
                    item.classList.remove('hidden');
                    item.style.animation = 'fadeUp 0.4s ease both';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    /* ── Lightbox ── */
    const lightbox  = document.getElementById('lightbox');
    const lbImg     = document.getElementById('lb-img');
    const lbCap     = document.getElementById('lb-cap');
    const lbClose   = document.getElementById('lb-close');
    const lbPrev    = document.getElementById('lb-prev');
    const lbNext    = document.getElementById('lb-next');

    let lbImages = [];
    let lbIndex  = 0;

    function openLightbox(index) {
        lbImages = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
        lbIndex  = index;
        showLbImage();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function showLbImage() {
        const item = lbImages[lbIndex];
        const img  = item.querySelector('img');
        const cap  = item.querySelector('.gallery-hover span');
        lbImg.src  = img.src;
        lbImg.alt  = img.alt;
        lbCap.textContent = cap ? cap.textContent : '';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', () => {
            const visible = [...document.querySelectorAll('.gallery-item:not(.hidden)')];
            openLightbox(visible.indexOf(item));
        });
    });

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    lbPrev.addEventListener('click', () => {
        lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
        showLbImage();
    });
    lbNext.addEventListener('click', () => {
        lbIndex = (lbIndex + 1) % lbImages.length;
        showLbImage();
    });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')  { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLbImage(); }
        if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % lbImages.length; showLbImage(); }
    });

    /* ── Menu tabs ── */
    const tabBtns   = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = document.getElementById(`tab-${btn.dataset.tab}`);
            if (panel) {
                panel.classList.add('active');
                panel.querySelectorAll('.reveal').forEach(el => {
                    el.classList.remove('visible');
                    setTimeout(() => el.classList.add('visible'), 50);
                });
            }
        });
    });

    /* ── Testimonial carousel ── */
    const track  = document.getElementById('carousel-track');
    const cards  = track.querySelectorAll('.t-card');
    const dotsEl = document.getElementById('c-dots');
    const prevBtn = document.getElementById('c-prev');
    const nextBtn = document.getElementById('c-next');
    let current   = 0;
    let autoTimer;

    cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `c-dot${i === 0 ? ' active' : ''}`;
        dot.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(dot);
    });

    function goTo(index) {
        current = (index + cards.length) % cards.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dotsEl.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === current));
        resetTimer();
    }

    function resetTimer() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => goTo(current + 1), 5000);
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    resetTimer();

    /* Touch swipe for carousel */
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    });

    /* ── Contact form → EmailJS → kaleemfairy@gmail.com ── */
    const form       = document.getElementById('contact-form');
    const successMsg = document.getElementById('form-success');

    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const btn       = form.querySelector('button[type="submit"]');
        const serviceId  = form.dataset.service;
        const templateId = form.dataset.template;

        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

        emailjs.sendForm(serviceId, templateId, form)
            .then(() => {
                btn.style.display = 'none';
                successMsg.classList.add('visible');
                form.reset();
            })
            .catch(() => {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Enquiry';
                alert('Oops — something went wrong. Please call us directly or try again.');
            });
    });

    /* ── Video modal (thumbnail-first click-to-play) ── */
    const videoModal = document.getElementById('video-modal');
    const vmIframe   = document.getElementById('vm-iframe');
    const vmClose    = document.getElementById('vm-close');

    function openVideo(videoId) {
        vmIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
        videoModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
        vmIframe.src = '';
        videoModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.yt-lazy').forEach(el => {
        el.addEventListener('click', () => openVideo(el.dataset.vid));
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openVideo(el.dataset.vid); });
    });

    vmClose.addEventListener('click', closeVideo);
    videoModal.addEventListener('click', e => { if (e.target === videoModal) closeVideo(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && videoModal.classList.contains('open')) closeVideo();
    });

    /* ── Back to top ── */
    backTop.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});
