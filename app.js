document.addEventListener('DOMContentLoaded', () => {

    // --- Header Scroll Effect ---
    const header = document.getElementById('main-header');
    const checkHeaderScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', checkHeaderScroll);
    checkHeaderScroll(); // Initial run

    // --- Mobile Menu Toggle ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // --- Intersection Observer for Scroll Reveals ---
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }

    // --- Active Nav Highlighting on Scroll ---
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = window.scrollY + 150; // offset for sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // --- Menu Category Filtering ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active tab button
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterCategory = btn.getAttribute('data-category');

            menuCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                // Animate filter transitions
                if (filterCategory === 'all' || cardCategory === filterCategory) {
                    card.classList.remove('hide');
                    // Tiny timeout to let the browser register display change before opacity animation
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.95)';
                    // Delay display:none to allow fade animation to complete
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 400);
                }
            });
        });
    });

    // --- Testimonials Slider ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        if (slides.length === 0) return;
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideTimer();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideTimer();
        });

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'), 10);
                showSlide(index);
                resetSlideTimer();
            });
        });
    }

    const startSlideTimer = () => {
        slideInterval = setInterval(nextSlide, 6000); // 6s rotate
    };

    const resetSlideTimer = () => {
        clearInterval(slideInterval);
        startSlideTimer();
    };

    startSlideTimer();

    // --- Reservation Modal Manager ---
    const reserveModal = document.getElementById('reserve-modal');
    const openModalBtns = [
        document.getElementById('open-reserve-btn'),
        document.getElementById('hero-book-btn')
    ];
    const closeModalBtns = document.querySelectorAll('#close-reserve-btn, #success-close-btn');
    const resDateInput = document.getElementById('res-date');

    // Prevent past date selections in reservation form
    if (resDateInput) {
        const today = new Date().toISOString().split('T')[0];
        resDateInput.setAttribute('min', today);
    }

    const openModal = () => {
        reserveModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Lock background scroll
    };

    const closeModal = () => {
        reserveModal.classList.remove('open');
        document.body.style.overflow = ''; // Restore background scroll
        // Reset modal states after closing animation completes
        setTimeout(() => {
            document.getElementById('reservation-form').style.display = 'flex';
            document.getElementById('modal-success').style.display = 'none';
            document.getElementById('reservation-form').reset();
        }, 400);
    };

    openModalBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });

    closeModalBtns.forEach(btn => {
        if (btn) btn.addEventListener('click', closeModal);
    });

    // Close modal if clicked outside card
    if (reserveModal) {
        reserveModal.addEventListener('click', (e) => {
            if (e.target === reserveModal) {
                closeModal();
            }
        });
    }

    // Modal Reservation Form Submit Mock
    const resForm = document.getElementById('reservation-form');
    const modalSuccess = document.getElementById('modal-success');

    if (resForm) {
        resForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Fetch input values
            const name = document.getElementById('res-name').value;
            const email = document.getElementById('res-email').value;
            const dateVal = document.getElementById('res-date').value;
            const timeVal = document.getElementById('res-time').value;
            const guestsVal = document.getElementById('res-guests').value;

            // Format Date elegantly (e.g. October 15, 2026)
            const dateObj = new Date(dateVal);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC' // Keep date unchanged by timezone shifts
            });

            // Format Time elegantly
            const [hours, minutes] = timeVal.split(':');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedTime = `${formattedHours}:${minutes} ${ampm}`;

            // Populate Success Screen values
            document.getElementById('success-email-display').textContent = email;
            document.getElementById('summary-date').textContent = formattedDate;
            document.getElementById('summary-time').textContent = formattedTime;
            document.getElementById('summary-guests').textContent = `${guestsVal} ${guestsVal == '1' ? 'Guest' : 'Guests'}`;

            // Toggle screens inside modal card
            resForm.style.display = 'none';
            modalSuccess.style.display = 'flex';
        });
    }

    // --- Newsletter Form Submit Mock ---
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterSuccess = document.getElementById('newsletter-success');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            newsletterForm.style.display = 'none';
            newsletterSuccess.style.display = 'flex';
        });
    }
});
