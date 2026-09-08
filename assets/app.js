// Common Application Utilities for Ehab Yar Portfolio
(function () {
    let currentLang = localStorage.getItem('eny_portfolio_lang') || 'ar';

    window.getLanguage = function () {
        return currentLang;
    };

    window.toggleLanguage = function () {
        window.setLanguage(currentLang === 'ar' ? 'en' : 'ar');
    };

    window.setLanguage = function (lang) {
        currentLang = lang;
        try {
            localStorage.setItem('eny_portfolio_lang', lang);
        } catch (e) {}

        const html = document.documentElement;
        const langText = document.getElementById('lang-text');

        if (lang === 'en') {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            document.body.setAttribute('dir', 'ltr');
            if (langText) langText.textContent = 'العربية';
        } else {
            html.setAttribute('lang', 'ar');
            html.setAttribute('dir', 'rtl');
            document.body.setAttribute('dir', 'rtl');
            if (langText) langText.textContent = 'English';
        }

        // Update all elements with data-ar and data-en
        document.querySelectorAll('[data-ar], [data-en]').forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation && el.children.length === 0) {
                el.textContent = translation;
            }
        });

        // Update arrow icons
        document.querySelectorAll('.arrow-icon').forEach(arrow => {
            arrow.className = lang === 'en' ? 'fas fa-arrow-right arrow-icon' : 'fas fa-arrow-left arrow-icon';
        });

        // Trigger custom event so page-specific renders can update
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    };

    // Shared Navbar & Mobile Menu Setup
    window.setupNavigation = function () {
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('back-to-top');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navLinks = document.getElementById('nav-links');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (navbar) navbar.classList.toggle('scrolled', scrollTop > 50);
            if (backToTop) backToTop.classList.toggle('visible', scrollTop > 400);
        }, { passive: true });

        if (mobileToggle && navLinks) {
            let backdrop = document.getElementById('mobile-menu-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'mobile-menu-backdrop';
                backdrop.className = 'mobile-menu-backdrop';
                document.body.appendChild(backdrop);
            }

            const closeMenu = () => {
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                if (backdrop) backdrop.classList.remove('active');
                document.body.classList.remove('menu-open');
            };

            const toggleMenu = () => {
                const willOpen = !navLinks.classList.contains('active');
                mobileToggle.classList.toggle('active', willOpen);
                mobileToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
                navLinks.classList.toggle('active', willOpen);
                if (backdrop) backdrop.classList.toggle('active', willOpen);
                document.body.classList.toggle('menu-open', willOpen);
            };

            mobileToggle.addEventListener('click', toggleMenu);
            backdrop.addEventListener('click', closeMenu);

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    closeMenu();
                }
            });
        }

        if (backToTop) {
            backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        }
    };

    // Shared Contact Rendering
    window.renderContact = function (data) {
        const c = (data || window.siteData || {}).contact;
        if (!c) return;
        const isAr = currentLang === 'ar';

        const titleEl = document.getElementById('contact-title');
        if (titleEl) titleEl.textContent = isAr ? c.titleAr : c.titleEn;

        const descEl = document.getElementById('contact-desc');
        if (descEl) descEl.textContent = isAr ? c.descAr : c.descEn;

        const heroW = document.getElementById('hero-whatsapp-btn');
        if (heroW) heroW.href = `https://wa.me/${c.whatsapp}`;

        const contactW = document.getElementById('contact-whatsapp-btn');
        if (contactW) contactW.href = `https://wa.me/${c.whatsapp}`;

        const contactE = document.getElementById('contact-email-btn');
        if (contactE) contactE.href = `mailto:${c.email}`;

        // Mirror social links in footer social bar
        const footerTw = document.getElementById('footer-link-twitter');
        if (footerTw && c.twitter) footerTw.href = c.twitter;

        const footerLi = document.getElementById('footer-link-linkedin');
        if (footerLi && c.linkedin) footerLi.href = c.linkedin;

        const footerGh = document.getElementById('footer-link-github');
        if (footerGh && c.github) footerGh.href = c.github;

        const footerWa = document.getElementById('footer-link-whatsapp');
        if (footerWa && c.whatsapp) footerWa.href = `https://wa.me/${c.whatsapp}`;

        const footerEm = document.getElementById('footer-link-email');
        if (footerEm && c.email) footerEm.href = `mailto:${c.email}`;
    };

    // Shared Loading Skeleton Screen Generator
    window.generateSkeletonHTML = function (type, count = 3) {
        let html = '';
        for (let i = 0; i < count; i++) {
            if (type === 'expertise') {
                html += `
                <div class="skeleton-card skeleton-expertise">
                    <div class="skeleton-bone skeleton-icon"></div>
                    <div class="skeleton-bone skeleton-title"></div>
                    <div class="skeleton-bone skeleton-line" style="width: 100%;"></div>
                    <div class="skeleton-bone skeleton-line" style="width: 88%;"></div>
                    <div class="skeleton-bone skeleton-line" style="width: 65%;"></div>
                    <div class="skeleton-tags">
                        <div class="skeleton-bone skeleton-tag" style="width: 75px;"></div>
                        <div class="skeleton-bone skeleton-tag" style="width: 90px;"></div>
                        <div class="skeleton-bone skeleton-tag" style="width: 65px;"></div>
                    </div>
                </div>`;
            } else if (type === 'project') {
                html += `
                <div class="skeleton-card skeleton-project">
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
                            <div class="skeleton-bone skeleton-badge"></div>
                            <div class="skeleton-bone" style="width: 20px; height: 20px; border-radius: 4px;"></div>
                        </div>
                        <div class="skeleton-bone skeleton-title" style="width: 75%; height: 26px;"></div>
                        <div class="skeleton-bone skeleton-line" style="width: 100%;"></div>
                        <div class="skeleton-bone skeleton-line" style="width: 90%;"></div>
                        <div class="skeleton-bone skeleton-line" style="width: 60%;"></div>
                        <div class="skeleton-tags" style="margin-bottom: 1.2rem; padding-top: 0.5rem;">
                            <div class="skeleton-bone skeleton-tag" style="width: 70px;"></div>
                            <div class="skeleton-bone skeleton-tag" style="width: 85px;"></div>
                            <div class="skeleton-bone skeleton-tag" style="width: 60px;"></div>
                        </div>
                    </div>
                    <div class="skeleton-footer-bar">
                        <div class="skeleton-bone" style="width: 110px; height: 20px; border-radius: 4px;"></div>
                        <div class="skeleton-bone" style="width: 80px; height: 16px; border-radius: 4px;"></div>
                    </div>
                </div>`;
            } else if (type === 'rich-case') {
                html += `
                <div class="skeleton-card skeleton-rich-case">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div class="skeleton-bone skeleton-icon" style="margin-bottom: 0; width: 48px; height: 48px;"></div>
                            <div>
                                <div class="skeleton-bone" style="width: 180px; height: 24px; margin-bottom: 0.5rem;"></div>
                                <div class="skeleton-bone" style="width: 120px; height: 14px;"></div>
                            </div>
                        </div>
                        <div class="skeleton-bone skeleton-badge" style="width: 130px; height: 28px;"></div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
                        <div style="background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04);">
                            <div class="skeleton-bone" style="width: 100px; height: 16px; margin-bottom: 0.8rem;"></div>
                            <div class="skeleton-bone skeleton-line" style="width: 100%;"></div>
                            <div class="skeleton-bone skeleton-line" style="width: 85%;"></div>
                        </div>
                        <div style="background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.04);">
                            <div class="skeleton-bone" style="width: 100px; height: 16px; margin-bottom: 0.8rem;"></div>
                            <div class="skeleton-bone skeleton-line" style="width: 100%;"></div>
                            <div class="skeleton-bone skeleton-line" style="width: 90%;"></div>
                        </div>
                    </div>
                    <div class="skeleton-footer-bar">
                        <div style="display: flex; gap: 8px;">
                            <div class="skeleton-bone skeleton-tag" style="width: 70px;"></div>
                            <div class="skeleton-bone skeleton-tag" style="width: 90px;"></div>
                            <div class="skeleton-bone skeleton-tag" style="width: 60px;"></div>
                        </div>
                        <div class="skeleton-bone" style="width: 120px; height: 32px; border-radius: 8px;"></div>
                    </div>
                </div>`;
            } else if (type === 'collab') {
                html += `
                <div class="skeleton-card skeleton-collab">
                    <div class="skeleton-bone skeleton-icon"></div>
                    <div class="skeleton-bone skeleton-title"></div>
                    <div class="skeleton-bone skeleton-line" style="width: 100%;"></div>
                    <div class="skeleton-bone skeleton-line" style="width: 85%;"></div>
                    <div class="skeleton-bone skeleton-line" style="width: 60%;"></div>
                </div>`;
            } else if (type === 'person') {
                html += `
                <div class="skeleton-card skeleton-person">
                    <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.2rem;">
                        <div class="skeleton-bone" style="width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;"></div>
                        <div style="flex: 1;">
                            <div class="skeleton-bone" style="width: 65%; height: 20px; margin-bottom: 0.4rem;"></div>
                            <div class="skeleton-bone" style="width: 45%; height: 14px;"></div>
                        </div>
                    </div>
                    <div class="skeleton-bone skeleton-line" style="width: 100%;"></div>
                    <div class="skeleton-bone skeleton-line" style="width: 85%;"></div>
                </div>`;
            }
        }
        return html;
    };

    window.applySkeleton = function (containerId, type, count = 3) {
        const el = document.getElementById(containerId);
        if (el) {
            el.innerHTML = window.generateSkeletonHTML(type, count);
            el.classList.remove('content-loaded');
        }
    };

    // Shared Reading Progress Bar
    window.setupReadingProgress = function () {
        let container = document.getElementById('reading-progress');
        let bar = document.getElementById('reading-progress-bar');

        if (!container) {
            container = document.createElement('div');
            container.id = 'reading-progress';
            container.className = 'reading-progress-container';
            bar = document.createElement('div');
            bar.id = 'reading-progress-bar';
            bar.className = 'reading-progress-bar';
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-label', 'Reading progress');
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
            bar.setAttribute('aria-valuenow', '0');
            container.appendChild(bar);
            document.body.prepend(container);
        }

        const updateProgress = () => {
            const currentBar = document.getElementById('reading-progress-bar');
            if (!currentBar) return;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight;
            if (scrollHeight > 5) {
                const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
                currentBar.style.width = progress + '%';
                currentBar.setAttribute('aria-valuenow', Math.round(progress).toString());
            } else {
                currentBar.style.width = '0%';
                currentBar.setAttribute('aria-valuenow', '0');
            }
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress, { passive: true });
        updateProgress();
    };

    // Shared Subtle Section Scroll Reveal (Fade-In-Up)
    window.setupSectionScrollReveal = function () {
        if (!('IntersectionObserver' in window)) {
            document.querySelectorAll('section > .container, section > [class*="container"], .subpage-hero > .container, .error-container').forEach(el => {
                el.classList.add('is-visible');
            });
            return;
        }

        const candidates = document.querySelectorAll('section > .container, section > [class*="container"], .subpage-hero > .container, .error-container');
        const sectionsWithoutContainer = Array.from(document.querySelectorAll('section')).filter(sec => !sec.querySelector('.container, [class*="container"]'));
        const elementsToAnimate = [...new Set([...candidates, ...sectionsWithoutContainer])];

        if (elementsToAnimate.length === 0) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            rootMargin: '0px 0px -40px 0px',
            threshold: 0.08
        });

        elementsToAnimate.forEach(el => {
            el.classList.add('reveal-fade-up');
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                requestAnimationFrame(() => {
                    el.classList.add('is-visible');
                });
            } else {
                observer.observe(el);
            }
        });

        window.addEventListener('hashchange', () => {
            if (window.location.hash) {
                const target = document.querySelector(window.location.hash);
                if (target) {
                    const container = target.querySelector('.container, [class*="container"]') || target;
                    if (container) container.classList.add('is-visible');
                }
            }
        });
    };

    // Auto-init language on page load
    document.addEventListener('DOMContentLoaded', () => {
        window.setLanguage(currentLang);
        window.setupNavigation();
        window.setupReadingProgress();
        window.setupSectionScrollReveal();
    });
})();
