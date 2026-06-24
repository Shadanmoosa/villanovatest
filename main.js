document.addEventListener('DOMContentLoaded', () => {
    // Preloader Page Control
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hidePreloader = () => {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.remove();
            }, 600);
        };
        window.addEventListener('load', hidePreloader);
        
        // Safeguard timeout: clear preloader after 2.5 seconds max
        setTimeout(() => {
            if (document.getElementById('preloader')) {
                hidePreloader();
            }
        }, 2500);
    }

    // Mobile Navigation Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('mobile-active');
            document.body.classList.toggle('mobile-menu-open');
            
            // Toggle hamburger icon between menu and close
            const isOpened = mainNav.classList.contains('mobile-active');
            menuToggle.innerHTML = isOpened 
                ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>` 
                : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        });
    }

    // Appointment Form Booking Handler
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('client-name').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const treatment = document.getElementById('treatment-select').value;
            const doctor = document.getElementById('doctor-select').value;
            
            if (!name || !phone || treatment === '' || doctor === '') {
                showToast('Please fill out all fields to make an appointment.', 'error');
                return;
            }

            // Simulate successful booking
            const submitBtn = appointmentForm.querySelector('.form-submit-btn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'PROCESSING...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showToast(`Thank you, ${name}! Your appointment for ${treatment} is requested. We will contact you soon.`, 'success');
                appointmentForm.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            }, 1200);
        });
    }

    // UI Toast Notification helper
    function showToast(message, type = 'success') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        // CSS Style for Toast (Dynamically styled to maintain clean structure without bloating style.css)
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            padding: '16px 28px',
            backgroundColor: type === 'success' ? '#1d2c47' : '#c33',
            color: '#fff',
            borderRadius: '2px',
            fontSize: '13px',
            fontWeight: '500',
            letterSpacing: '0.05em',
            boxShadow: '0 15px 35px rgba(0,0,0,0.15)',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateY(10px)',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            borderLeft: `4px solid ${type === 'success' ? '#cdaa7d' : '#f99'}`
        });

        toast.innerText = message;
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);

        // Remove after duration
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    }

    // Before / After Slider Control
    const slider = document.getElementById('before-after-slider');
    if (slider) {
        const input = slider.querySelector('.slider-input');
        if (input) {
            input.addEventListener('input', (e) => {
                slider.style.setProperty('--position', `${e.target.value}%`);
            });
        }
    }

    // Procedures Data
    const proceduresData = [
        {
            title: "Facelift",
            desc: "The facelift, or Rhytidectomy, helps restore a youthful appearance by tightening sagging skin and smoothing deep wrinkles along the jawline and face. Getting a facelift offers a significant boost in both appearance and self-esteem, helping you look as young as you feel.",
            img: "images/services/facelift.jpg"
        },
        {
            title: "Rhinoplasty",
            desc: "Rhinoplasty is a surgical procedure that changes the shape and structure of the nose to improve its appearance, correct breathing issues, or both. By reshaping the nasal bone and cartilage, rhinoplasty helps achieve harmony with your natural facial features.",
            img: "images/services/rhynoplasty.jpg"
        },
        {
            title: "Mommy Makeover",
            desc: "The goal of a mommy makeover is to restore the shape and appearance of a woman’s body after childbearing. Many women notice changes in their bodies post-pregnancy. There are many areas of the body that can be addressed, most commonly the breasts, abdomen, waist, genitalia and buttocks.",
            img: "images/services/mommymakeover.jpg"
        },
        {
            title: "Tummy Tuck",
            desc: "A tummy tuck, or abdominoplasty, is designed to reshape the abdomen by removing excess skin and fat, and tightening weakened abdominal muscles. The remaining skin is then repositioned to create a flatter, more toned, and firmer midsection.",
            img: "images/services/tummytuck.jpg"
        },
        {
            title: "Liposuction",
            desc: "Liposuction is a type of surgery. It uses suction to remove fat from specific areas of the body, such as the stomach, hips, thighs, buttocks, arms or neck. Liposuction also shapes these areas. That process is called contouring. Other names for liposuction include lipoplasty and body contouring.",
            img: "images/services/liposution.jpg"
        },
        {
            title: "Injectables",
            desc: "Injectables are non-surgical treatments used to relax facial wrinkles, restore volume, and enhance facial contours. From smoothing smile lines to plumping lips, these quick procedures provide immediate, natural-looking rejuvenation with minimal downtime.",
            img: "images/services/injuctables.jpg"
        }
    ];

    // Preload procedure images in background for instant responsive tab switching
    proceduresData.forEach(proc => {
        const img = new Image();
        img.src = proc.img;
    });

    // Popular Procedures Tabs Control
    const tabsContainer = document.getElementById('procedures-nav-tabs');
    if (tabsContainer) {
        const tabs = tabsContainer.querySelectorAll('.procedure-tab');
        const textCard = document.getElementById('procedure-text-card');
        const imgContainer = document.getElementById('procedure-image-container');
        const showcase = document.getElementById('procedure-showcase');
        
        let currentIndex = 0;
        let isTransitioning = false;

        function adjustLayoutForMobile() {
            const activeTab = tabsContainer.querySelector('.procedure-tab.active');
            if (window.innerWidth <= 991) {
                if (activeTab && activeTab.nextSibling !== showcase) {
                    activeTab.parentNode.insertBefore(showcase, activeTab.nextSibling);
                }
            } else {
                const wrapper = tabsContainer.parentNode;
                if (wrapper && showcase.parentNode !== wrapper) {
                    wrapper.insertBefore(showcase, tabsContainer);
                }
            }
        }

        // Run on initial load and resize
        adjustLayoutForMobile();
        window.addEventListener('resize', adjustLayoutForMobile);

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                if (index === currentIndex || isTransitioning) return;
                isTransitioning = true;

                const direction = index > currentIndex ? 'up' : 'down';
                const newData = proceduresData[index];

                // Remove active class from all tabs, add to clicked one
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Instantly move showcase in DOM on mobile if switching active tabs
                adjustLayoutForMobile();

                // Get current text and image content for exit wrapper
                const oldTextCardContent = textCard.innerHTML;
                const oldImgSrc = imgContainer.querySelector('img').src;

                // Setup exit and enter wrappers
                textCard.innerHTML = `
                    <div class="exit-wrapper">${oldTextCardContent}</div>
                    <div class="enter-wrapper" style="opacity:0;">
                        <h3>${newData.title.toUpperCase()}</h3>
                        <p>${newData.desc}</p>
                        <a href="doctors.html" class="procedure-view-details-btn">VIEW DETAILS</a>
                    </div>
                `;

                imgContainer.innerHTML = `
                    <div class="exit-wrapper">
                        <img src="${oldImgSrc}" alt="Old">
                    </div>
                    <div class="enter-wrapper" style="opacity:0;">
                        <img src="${newData.img}" alt="${newData.title}">
                    </div>
                `;

                // Force layout reflow
                textCard.offsetHeight;

                // Apply direction class to trigger animation
                showcase.className = `procedure-showcase switching-${direction}`;
                
                // Clear opacity override on enter wrappers to let keyframes take over
                textCard.querySelector('.enter-wrapper').style.opacity = '';
                imgContainer.querySelector('.enter-wrapper').style.opacity = '';

                setTimeout(() => {
                    // Set final static values
                    textCard.innerHTML = `
                        <h3>${newData.title.toUpperCase()}</h3>
                        <p>${newData.desc}</p>
                        <a href="doctors.html" class="procedure-view-details-btn">VIEW DETAILS</a>
                    `;
                    imgContainer.innerHTML = `
                        <img src="${newData.img}" alt="${newData.title}">
                    `;
                    showcase.className = 'procedure-showcase';
                    isTransitioning = false;
                }, 500);

                currentIndex = index;
            });
        });
    }

    // Client Reviews Carousel Control
    const reviewsSlider = document.getElementById('reviews-slider');
    if (reviewsSlider) {
        const slides = reviewsSlider.querySelectorAll('.review-slide');
        const prevBtn = document.getElementById('reviews-prev-btn');
        const nextBtn = document.getElementById('reviews-next-btn');
        const reviewsSection = document.querySelector('.reviews-section');
        
        let activeIndex = 0;
        let isTransitioning = false;
        let autoPlayInterval;
        const autoPlayDelay = 5000; // Auto-rotate every 5 seconds
        
        function showSlide(index, direction = 'next') {
            if (index === activeIndex || isTransitioning) return;
            isTransitioning = true;
            
            // Set sliding direction class on parent slider container
            reviewsSlider.className = `reviews-slider slide-${direction}`;
            
            const currentSlide = slides[activeIndex];
            const newSlide = slides[index];
            
            // Trigger exit transition
            currentSlide.classList.remove('active');
            currentSlide.classList.add('leaving');
            
            // Trigger enter transition
            newSlide.classList.add('active');
            
            activeIndex = index;
            
            // Clean up direction classes and leaving state after transition completes (600ms matching CSS)
            setTimeout(() => {
                currentSlide.classList.remove('leaving');
                reviewsSlider.className = 'reviews-slider';
                isTransitioning = false;
            }, 600);
        }
        
        function nextSlide() {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= slides.length) {
                nextIndex = 0;
            }
            showSlide(nextIndex, 'next');
        }
        
        function prevSlide() {
            let prevIndex = activeIndex - 1;
            if (prevIndex < 0) {
                prevIndex = slides.length - 1;
            }
            showSlide(prevIndex, 'prev');
        }
        
        // Auto-play control functions
        function startAutoPlay() {
            stopAutoPlay(); // Prevent multiple intervals
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        }
        
        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
            }
        }
        
        // Navigation button event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoPlay(); // Reset timer on manual click
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoPlay(); // Reset timer on manual click
            });
        }
        
        // Pause on hover
        if (reviewsSection) {
            reviewsSection.addEventListener('mouseenter', stopAutoPlay);
            reviewsSection.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Initial start
        startAutoPlay();
    }
});
