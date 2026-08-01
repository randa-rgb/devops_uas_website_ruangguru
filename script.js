/* ==========================================================================
   RUANG GURU - COMPANY PROFILE JAVASCRIPT
   Native ES6+ Interactive Behaviors & Utilities
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. MOBILE MENU TOGGLE & ACCESSIBILITY
       -------------------------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('active');

            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', !isOpen);

            // Prevent body scroll when mobile menu is open
            document.body.style.overflow = isOpen ? '' : 'hidden';
        });

        // Close mobile drawer when clicking any navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburgerBtn.classList.remove('active');
                    hamburgerBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    /* --------------------------------------------------------------------------
       2. STICKY NAVBAR SHADOW & ACTIVE PAGE HIGHLIGHT
       -------------------------------------------------------------------------- */
    const navbarHeader = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');

    // Highlight active link based on current filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    function handleNavbarScroll() {
        // Sticky Header Shadow
        if (window.scrollY > 40) {
            navbarHeader.classList.add('scrolled');
        } else {
            navbarHeader.classList.remove('scrolled');
        }

        // ScrollSpy Highlight if on single-page section scrolling
        if (sections.length > 1) {
            const scrollPosition = window.scrollY + 120;
            sections.forEach(currentSection => {
                const sectionHeight = currentSection.offsetHeight;
                const sectionTop = currentSection.offsetTop - 120;
                const sectionId = currentSection.getAttribute('id');
                const correspondingNavLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

                if (correspondingNavLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    correspondingNavLink.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Initial check on load

    /* --------------------------------------------------------------------------
       3. SMOOTH SCROLL FOR ALL ANCHOR LINKS
       -------------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeight = navbarHeader ? navbarHeader.offsetHeight : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --------------------------------------------------------------------------
       4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       -------------------------------------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Unobserve after revealing to optimize performance
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    /* --------------------------------------------------------------------------
       5. CONTACT FORM VALIDATION & SUCCESS FEEDBACK
       -------------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success-alert');

    if (contactForm) {
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const messageInput = document.getElementById('contact-message');

        const nameError = document.getElementById('name-error');
        const emailError = document.getElementById('email-error');
        const messageError = document.getElementById('message-error');

        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function validateForm() {
            let isValid = true;

            // Reset errors
            [nameInput, emailInput, messageInput].forEach(inp => inp.classList.remove('error'));
            [nameError, emailError, messageError].forEach(err => err.classList.remove('visible'));

            // Name validation
            if (!nameInput.value.trim()) {
                nameInput.classList.add('error');
                nameError.classList.add('visible');
                isValid = false;
            }

            // Email validation
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
                emailInput.classList.add('error');
                emailError.classList.add('visible');
                isValid = false;
            }

            // Message validation
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                messageInput.classList.add('error');
                messageError.classList.add('visible');
                isValid = false;
            }

            return isValid;
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (validateForm()) {
                // Show success feedback
                if (successAlert) {
                    successAlert.style.display = 'flex';
                    successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }

                // Reset form inputs
                contactForm.reset();

                // Hide success message after 6 seconds
                setTimeout(() => {
                    if (successAlert) {
                        successAlert.style.display = 'none';
                    }
                }, 6000);
            }
        });

        // Clear error styling on input change
        [nameInput, emailInput, messageInput].forEach(inputEl => {
            if (inputEl) {
                inputEl.addEventListener('input', () => {
                    inputEl.classList.remove('error');
                    const errorSpan = inputEl.nextElementSibling;
                    if (errorSpan && errorSpan.classList.contains('error-msg')) {
                        errorSpan.classList.remove('visible');
                    }
                });
            }
        });
    }

    /* --------------------------------------------------------------------------
       6. HERO QUICK CONSULTATION FORM
       -------------------------------------------------------------------------- */
    const heroQuickForm = document.getElementById('hero-quick-form');
    if (heroQuickForm) {
        heroQuickForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneInput = heroQuickForm.querySelector('input[type="tel"]');
            if (phoneInput && phoneInput.value.trim()) {
                alert(`Terima kasih! Tim Konselor Ruang Guru akan segera menghubungi nomor ${phoneInput.value.trim()} via WhatsApp.`);
                heroQuickForm.reset();
            }
        });
    }

    /* --------------------------------------------------------------------------
       7. TESTIMONIAL CATEGORY FILTER TABS
       -------------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-tab-btn');
    const testimonialItems = document.querySelectorAll('.testimonial-card-item');

    if (filterButtons.length > 0 && testimonialItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-filter');

                // Update active tab class
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter testimonial card items
                testimonialItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (category === 'all' || itemCategory === category) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});

