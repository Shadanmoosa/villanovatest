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

    // Mobile Navigation Dropdown Toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault(); // Prevent navigating immediately
                    dropdown.classList.toggle('open');
                }
            });
        }

        // Close mobile drawer when clicking any child link of the dropdown
        const subLinks = dropdown.querySelectorAll('.dropdown-menu a');
        subLinks.forEach(subLink => {
            subLink.addEventListener('click', () => {
                setTimeout(() => {
                    if (mainNav && menuToggle) {
                        mainNav.classList.remove('mobile-active');
                        document.body.classList.remove('mobile-menu-open');
                        menuToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
                    }
                }, 150); // Delay menu closing slightly to avoid page navigation cancel issues in mobile browsers
            });
        });
    });

    // Appointment Form Booking Handler
    // Configuration: Replace with your Web3Forms Access Key from https://web3forms.com
    const WEB3FORMS_ACCESS_KEY = "3ed5c319-1c62-4376-9d3a-9a14041546b5"; 

    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic form validation (only name and phone are required now)
            const name = document.getElementById('client-name').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const treatment = document.getElementById('treatment-select').value;
            const doctor = document.getElementById('doctor-select').value;
            const date = document.getElementById('booking-date').value;
            const time = document.getElementById('booking-time').value;
            
            if (!name || !phone) {
                showToast('Please fill out Name and Phone fields to register your interest.', 'error');
                return;
            }

            const submitBtn = appointmentForm.querySelector('.form-submit-btn');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'PROCESSING...';
            submitBtn.disabled = true;

            // Demo mode fallback if no key is configured
            if (WEB3FORMS_ACCESS_KEY === "YOUR_ACCESS_KEY_HERE" || !WEB3FORMS_ACCESS_KEY) {
                console.warn("Web3Forms Access Key is not configured. Simulating success...");
                setTimeout(() => {
                    showToast(`Demo Mode: Thank you, ${name}! Your request has been registered. (Please configure WEB3FORMS_ACCESS_KEY in main.js to receive real emails)`, 'success');
                    appointmentForm.reset();
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                }, 1200);
                return;
            }

            // Real email submission using Web3Forms
            const payload = {
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: `New Interest Registration - ${name}`,
                from_name: "Villanova Cosmetics Clinic",
                name: name,
                phone: phone,
                treatment: treatment || "Not Specified",
                doctor: doctor || "Not Specified",
                date: date || "Not Specified",
                time: time || "Not Specified"
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(async (response) => {
                const json = await response.json();
                if (response.status === 200) {
                    showToast(`Thank you, ${name}! Your request has been registered. We will contact you soon.`, 'success');
                    appointmentForm.reset();
                } else {
                    console.error(json);
                    showToast(json.message || 'Something went wrong. Please try again.', 'error');
                }
            })
            .catch((error) => {
                console.error(error);
                showToast('Failed to submit request. Please check your internet connection.', 'error');
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
        });

        // WhatsApp submit button click listener
        const whatsappBtn = document.getElementById('whatsapp-submit-btn');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', () => {
                const name = document.getElementById('client-name').value.trim();
                const phone = document.getElementById('client-phone').value.trim();
                const treatment = document.getElementById('treatment-select').value;
                const doctor = document.getElementById('doctor-select').value;
                const date = document.getElementById('booking-date').value;
                const time = document.getElementById('booking-time').value;
                
                if (!name || !phone) {
                    showToast('Please fill out Name and Phone fields to book via WhatsApp.', 'error');
                    return;
                }

                // Construct WhatsApp message text
                let message = `Hi, I would like to book an appointment at Villanova Cosmetics Clinic.`;
                message += `\nName: ${name}`;
                message += `\nPhone: ${phone}`;
                if (treatment) message += `\nTreatment: ${treatment}`;
                if (doctor) message += `\nDoctor: ${doctor}`;
                if (date) message += `\nDate: ${date}`;
                if (time) message += `\nTime: ${time}`;

                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/971581187071?text=${encodedMessage}`;
                
                window.open(whatsappUrl, '_blank');
            });
        }
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
    window.showToast = showToast;

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

    // Scroll Reveal Intersection Observer API
    const revealElements = document.querySelectorAll('.reveal-element, .procedures-carousel-track .procedure-card');
    if (revealElements.length > 0) {
        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                        // Stop observing once visible to optimize CPU
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '0px 0px -80px 0px',
                threshold: 0.1
            });
            
            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            // Fallback for older browsers
            revealElements.forEach(el => el.classList.add('reveal-visible'));
        }
    }
    
    // Scroll-driven Parallax Animations (Unified Manager)
    const parallaxItems = [
        {
            element: document.querySelector('.about-img-front'),
            container: document.querySelector('.about-cosmetic-images'),
            speed: 0.15
        },
        {
            element: document.querySelector('.artistry-img-small-wrapper'),
            container: document.querySelector('.artistry-images-wrapper'),
            speed: 0.12
        }
    ].filter(item => item.element && item.container);

    if (parallaxItems.length > 0) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            let ticking = false;

            const updateParallaxes = () => {
                const viewportHeight = window.innerHeight;
                const viewportCenter = viewportHeight / 2;

                parallaxItems.forEach(item => {
                    const rect = item.container.getBoundingClientRect();

                    // Only calculate if the container is currently visible in viewport
                    if (rect.top < viewportHeight && rect.bottom > 0) {
                        const containerCenter = rect.top + (rect.height / 2);
                        const diff = containerCenter - viewportCenter;
                        const translateY = diff * item.speed;

                        // Apply translation using 3D transforms for GPU hardware acceleration
                        item.element.style.transform = `translate3d(0, ${translateY}px, 0)`;
                    }
                });
                ticking = false;
            };

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(updateParallaxes);
                    ticking = true;
                }
            }, { passive: true });

            // Run once on load to position correctly
            updateParallaxes();
        }
    }

    // Sticky main header scrolled styling scroll effect on mobile & desktop
    const mainHeader = document.querySelector('.main-header.header-transparent');
    if (mainHeader) {
        const checkScroll = () => {
            if (window.scrollY > 40) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', checkScroll, { passive: true });
        checkScroll(); // check initial state
    }

    // Procedures Carousel (Services) Control
    const procViewport = document.getElementById('procedures-viewport');
    const procTrack = document.getElementById('procedures-track');
    const procPrevBtn = document.getElementById('procedures-prev-btn');
    const procNextBtn = document.getElementById('procedures-next-btn');
    const procContainer = document.querySelector('.procedures-carousel-container');

    if (procViewport && procTrack) {
        const originalCards = Array.from(procTrack.querySelectorAll('.procedure-card'));
        const totalOriginals = originalCards.length;
        
        // Clone first 4 items and append
        for (let i = 0; i < 4; i++) {
            const clone = originalCards[i].cloneNode(true);
            clone.classList.add('carousel-clone');
            procTrack.appendChild(clone);
        }
        // Clone last 4 items and prepend in correct chronological order
        for (let i = totalOriginals - 1; i >= totalOriginals - 4; i--) {
            const clone = originalCards[i].cloneNode(true);
            clone.classList.add('carousel-clone');
            procTrack.insertBefore(clone, procTrack.firstChild);
        }
        
        const allCards = procTrack.querySelectorAll('.procedure-card');
        
        let index = 4; // Start at first original card
        let autoplayTimer;
        let isTransitioning = false;
        let isGridView = false;
        
        function getVisibleCount() {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 768) return 2;
            if (window.innerWidth <= 1024) return 3;
            return 4;
        }

        function initPosition() {
            if (window.innerWidth <= 480) {
                procTrack.style.transform = 'none';
                procTrack.style.transition = 'none';
                return;
            }
            const cardWidth = allCards[0].getBoundingClientRect().width;
            procTrack.style.transition = 'none';
            procTrack.style.transform = `translateX(-${index * cardWidth}px)`;
            procTrack.offsetHeight; // force reflow
        }
        
        initPosition();

        function updateSliderPosition(animate = true) {
            if (window.innerWidth <= 480) {
                procTrack.style.transform = 'none';
                procTrack.style.transition = 'none';
                return;
            }
            
            if (animate) {
                procTrack.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            } else {
                procTrack.style.transition = 'none';
                procTrack.offsetHeight; // Force reflow to immediately apply transition: none before setting transform
            }
            
            const cardWidth = allCards[0].getBoundingClientRect().width;
            procTrack.style.transform = `translateX(-${index * cardWidth}px)`;
        }

        function nextSlide() {
            if (window.innerWidth <= 480 || isTransitioning || isGridView) return;
            isTransitioning = true;
            index++;
            updateSliderPosition(true);
        }

        function prevSlide() {
            if (window.innerWidth <= 480 || isTransitioning || isGridView) return;
            isTransitioning = true;
            index--;
            updateSliderPosition(true);
        }

        procTrack.addEventListener('transitionend', () => {
            isTransitioning = false;
            
            // Seamless wrap-around jump
            if (index >= 4 + totalOriginals) {
                index = 4;
                updateSliderPosition(false);
            } else if (index < 4) {
                index = 4 + totalOriginals - (4 - index);
                updateSliderPosition(false);
            }
        });

        if (procNextBtn) {
            procNextBtn.addEventListener('click', () => {
                nextSlide();
                startAutoplay();
            });
        }

        if (procPrevBtn) {
            procPrevBtn.addEventListener('click', () => {
                prevSlide();
                startAutoplay();
            });
        }

        function startAutoplay() {
            stopAutoplay();
            if (window.innerWidth <= 480 || isGridView) return;
            autoplayTimer = setInterval(nextSlide, 2500);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
            }
        }

        if (procContainer) {
            procContainer.addEventListener('mouseenter', () => {
                if (!isGridView) stopAutoplay();
            });
            procContainer.addEventListener('mouseleave', () => {
                if (!isGridView) startAutoplay();
            });
        }

        window.addEventListener('resize', () => {
            if (isGridView) return;
            if (window.innerWidth <= 480) {
                procTrack.style.transform = 'none';
                procTrack.style.transition = 'none';
                stopAutoplay();
            } else {
                initPosition();
                startAutoplay();
            }
        });

        // Touch Dragging Support for Manual Swipe
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        procTrack.addEventListener('touchstart', (e) => {
            if (window.innerWidth <= 480 || isGridView) return;
            startX = e.touches[0].clientX;
            isDragging = true;
            stopAutoplay();
        }, { passive: true });
        
        procTrack.addEventListener('touchmove', (e) => {
            if (!isDragging || window.innerWidth <= 480 || isGridView) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        procTrack.addEventListener('touchend', () => {
            if (!isDragging || window.innerWidth <= 480 || isGridView) return;
            isDragging = false;
            const diffX = startX - currentX;
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoplay();
        });

        // View All Services Button Toggle
        const viewAllBtn = document.getElementById('view-all-services-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', (e) => {
                e.preventDefault();
                isGridView = !isGridView;
                
                // Fade out track before switching layout for premium visual transition
                procTrack.style.transition = 'opacity 0.2s ease';
                procTrack.style.opacity = '0';
                
                if (isGridView) {
                    viewAllBtn.textContent = 'SHOW SLIDER VIEW';
                    stopAutoplay();
                } else {
                    viewAllBtn.textContent = 'VIEW ALL SERVICES';
                }
                
                setTimeout(() => {
                    if (isGridView) {
                        procContainer.classList.add('grid-view-active');
                    } else {
                        procContainer.classList.remove('grid-view-active');
                        initPosition();
                        // Smoothly scroll back to the carousel viewport so the user doesn't lose their place when layout collapses
                        procViewport.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Force reflow and fade back in
                    procTrack.offsetHeight;
                    procTrack.style.transition = 'opacity 0.4s ease, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    procTrack.style.opacity = '1';
                    
                    if (!isGridView) {
                        startAutoplay();
                    }
                }, 200);
            });
        }

        // Auto-switch to grid view if URL contains #services-section
        const handleServicesHash = () => {
            if (window.location.hash === '#services-section') {
                if (!isGridView && viewAllBtn) {
                    viewAllBtn.click();
                }
            }
        };

        // Listen for load and hashchange
        window.addEventListener('load', () => {
            setTimeout(handleServicesHash, 150); // Small delay to guarantee preloader & carousel initialization
        });
        window.addEventListener('hashchange', handleServicesHash);

        // Click listener on header SERVICES link to force grid view even if hash doesn't change
        const servicesNavLinks = document.querySelectorAll('a[href*="#services-section"]');
        servicesNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!isGridView && viewAllBtn) {
                    viewAllBtn.click();
                }
            });
        });

        startAutoplay();
    }

    // ==========================================================================
    // INTERACTIVE DOCTORS SECTION (Filtering & Quick View Modal)
    // ==========================================================================
    const doctorData = {
        'doc-1': {
            name: 'DR. PIERO CRABAI',
            role: 'PLASTIC SURGERY SPECIALIST',
            badge: 'ITALIAN BOARD CERTIFIED',
            img: 'images/villanovadoctors/DRPIEROCRABAI.jpg',
            bio: 'Dr. Piero Crabai is an internationally renowned plastic surgeon with over 25 years of surgical excellence in Dubai and Europe. He combines artistic vision with cutting-edge surgical techniques to achieve natural, age-defying results.',
            exp: '25+ Years Experience',
            lang: 'English, Italian, French',
            linkedin: 'https://www.linkedin.com/in/piero-crabai-9a754160/',
            instagram: 'https://www.instagram.com/crabaisurgery/',
            website: 'https://crabaisurgery.com/',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Piero%20Crabai'
        },
        'doc-2': {
            name: 'DR. MAJED',
            role: 'DENTAL SPECIALIST',
            badge: 'DENTISTRY & SMILE DESIGN',
            img: 'images/villanovadoctors/drmajed.jpg',
            bio: 'Dr. Majed specializes in advanced dentistry, smile design, veneers, implants, and comprehensive oral aesthetic rehabilitation.',
            exp: '15+ Years Experience',
            lang: 'English, Arabic',
            linkedin: 'https://linkedin.com',
            instagram: 'https://www.instagram.com/majedhatem/',
            website: 'https://villanovamedical.ae',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Majed'
        },
        'doc-3': {
            name: 'DR. MOHAMMED ABEDIAN',
            role: 'GENERAL SURGERY SPECIALIST',
            badge: 'GENERAL SURGEON',
            img: 'images/villanovadoctors/DrMohammedAbedian.jpg',
            bio: 'Dr. Mohammed Abedian is a consultant general surgeon specializing in advanced laparoscopic procedures, abdominal surgery, and surgical wellness.',
            exp: '18+ Years Experience',
            lang: 'English, Arabic, Persian',
            linkedin: 'https://www.linkedin.com/in/mohammad-abedian-a0a69736/',
            instagram: 'https://instagram.com',
            website: 'https://mohammadabedian.com/',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Mohammed%20Abedian'
        },
        'doc-4': {
            name: 'DR. HUSAIN HAIDAR',
            role: 'GENERAL SURGERY SPECIALIST',
            badge: 'GENERAL SURGEON',
            img: 'images/villanovadoctors/drhusainhaidar.jpg',
            bio: 'Dr. Husain Haidar provides senior general surgical care focusing on minimally invasive techniques, abdominal interventions, and patient recovery.',
            exp: '16+ Years Experience',
            lang: 'English, Arabic',
            linkedin: 'https://www.linkedin.com/in/drhusainhaidar/',
            instagram: 'https://www.instagram.com/drhusainhaidar/',
            website: 'https://drhusainhaidar.com/',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Husain%20Haidar'
        },
        'doc-5': {
            name: 'DR. HAMED ABASI',
            role: 'ENT SPECIALIST',
            badge: 'EAR, NOSE & THROAT',
            img: 'images/villanovadoctors/drhamedabasi.jpg',
            bio: 'Dr. Hamed Abasi is an Otolaryngologist (ENT Specialist) expert in sinus care, nasal aesthetics, throat treatments, and head & neck surgery.',
            exp: '14+ Years Experience',
            lang: 'English, Persian, Arabic',
            linkedin: 'https://www.linkedin.com/in/hamed-abasi-6076a657/',
            instagram: 'https://www.instagram.com/drhamedabasi_uae/',
            website: 'https://villanovamedical.ae',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Hamed%20Abasi'
        },
        'doc-6': {
            name: 'DR. AMR',
            role: 'AESTHETIC DOCTOR',
            badge: 'AESTHETIC MEDICINE',
            img: 'images/villanovadoctors/drAmr.jpg',
            bio: 'Dr. Amr specializes in non-surgical facial aesthetics, dermal fillers, neuromodulators, skin rejuvenation, and personalized anti-aging care.',
            exp: '',
            lang: 'English, Arabic',
            linkedin: 'https://linkedin.com',
            instagram: 'https://www.instagram.com/dr.raiboy/',
            website: 'https://raiboy.com/',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Amr'
        },
        'doc-7': {
            name: 'DR. SEREEN AL-HELO',
            role: 'DENTAL SPECIALIST',
            badge: 'COSMETIC DENTISTRY',
            img: 'images/villanovadoctors/DrSereenAlhelo.jpg',
            bio: 'Dr. Sereen Al-Helo is a skilled dental specialist dedicated to smile design, teeth whitening, veneers, and aesthetic dental restoration.',
            exp: '15+ Years Experience',
            lang: 'English, Arabic',
            linkedin: 'https://www.linkedin.com/in/dr-sereen-elhelou-b-d-s%F0%9F%92%89-992723195/',
            instagram: 'https://www.instagram.com/dr.sereen.alhelo/',
            website: 'https://villanovamedical.ae',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Sereen%20Al-Helo'
        },
        'doc-8': {
            name: 'DR. NAYEREH KABOLI',
            role: 'NUTRITION SPECIALIST',
            badge: 'CLINICAL NUTRITIONIST',
            img: 'images/villanovadoctors/drnayereKaboli.jpg',
            bio: 'Dr. Nayereh Kaboli provides clinical nutritional therapy, metabolic body composition analysis, personalized dietary planning, and health optimization.',
            exp: '14+ Years Experience',
            lang: 'English, Persian',
            linkedin: 'https://www.linkedin.com/in/dr-nayere-esmaeil-kaboli-b502a776/',
            instagram: 'https://www.instagram.com/clinic_taghzie/',
            website: 'https://villanovamedical.ae',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Nayereh%20Kaboli'
        },
        'doc-9': {
            name: 'DR. ABAS RAHIMI',
            role: 'PHYSIOTHERAPY SPECIALIST',
            badge: 'PHYSIOTHERAPEUTIC MEDICINE',
            img: 'images/villanovadoctors/drabasrahimi.jpg',
            bio: 'Dr. Abas Rahimi is a consultant physiotherapist specializing in musculoskeletal rehabilitation, sports injuries, posture correction, and physical wellness.',
            exp: '17+ Years Experience',
            lang: 'English, Persian, Arabic',
            linkedin: 'https://www.linkedin.com/in/abbas-r-89878a78/',
            instagram: 'https://www.instagram.com/pt_dr.rahimi/',
            website: 'physiotherapy.html',
            whatsapp: 'https://wa.me/971509398270?text=Hi%20Villanova,%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Abas%20Rahimi'
        }
    };

    // Filter Category Tabs logic
    const filterBtns = document.querySelectorAll('.v-filter-btn');
    const doctorCards = document.querySelectorAll('.v-doctor-card');

    if (filterBtns.length > 0 && doctorCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                doctorCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.92)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Touch device tap toggle support for cards
    doctorCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('.v-btn-quickview') || e.target.closest('.v-btn-book') || e.target.closest('.v-social-pill')) {
                return; // Let native button click handle
            }
            if (window.innerWidth <= 1024) {
                const isActive = card.classList.contains('hover-active');
                doctorCards.forEach(c => c.classList.remove('hover-active'));
                if (!isActive) card.classList.add('hover-active');
            }
        });
    });

    // Quick View Modal Controller
    const modal = document.getElementById('v-doctor-modal');
    if (modal) {
        const modalOverlay = modal.querySelector('.v-modal-overlay');
        const modalClose = modal.querySelector('.v-modal-close');
        
        const modalImg = document.getElementById('v-modal-img');
        const modalBadge = document.getElementById('v-modal-badge');
        const modalName = document.getElementById('v-modal-name');
        const modalRole = document.getElementById('v-modal-role');
        const modalBio = document.getElementById('v-modal-bio');
        const modalExp = document.getElementById('v-modal-exp');
        const modalLang = document.getElementById('v-modal-lang');
        const modalLinkedin = document.getElementById('v-modal-linkedin');
        const modalInstagram = document.getElementById('v-modal-instagram');
        const modalWebsite = document.getElementById('v-modal-website');
        const modalBookBtn = document.getElementById('v-modal-book-btn');

        const openModal = (docId) => {
            const data = doctorData[docId];
            if (!data) return;

            if (modalImg) modalImg.src = data.img;
            if (modalBadge) modalBadge.textContent = data.badge;
            if (modalName) modalName.textContent = data.name;
            if (modalRole) modalRole.textContent = data.role;
            if (modalBio) modalBio.textContent = data.bio;
            if (modalExp) {
                modalExp.textContent = data.exp;
                const expItem = modalExp.closest('.v-detail-item');
                if (expItem) {
                    expItem.style.display = data.exp ? '' : 'none';
                }
            }
            if (modalLang) modalLang.textContent = data.lang;

            if (modalLinkedin) modalLinkedin.href = data.linkedin;
            if (modalInstagram) modalInstagram.href = data.instagram;
            if (modalWebsite) modalWebsite.href = data.website;
            if (modalBookBtn) modalBookBtn.href = data.whatsapp;

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        document.querySelectorAll('.v-btn-quickview').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const docId = btn.getAttribute('data-doc-id');
                openModal(docId);
            });
        });

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Welcome Video Modal Controller
    const videoModal = document.getElementById('v-video-modal');
    const welcomeVideo = document.getElementById('v-welcome-video');
    const videoBadge = document.querySelector('.doctor-video-badge');

    if (videoModal && welcomeVideo && videoBadge) {
        const videoOverlay = videoModal.querySelector('.v-video-overlay');
        const videoClose = videoModal.querySelector('.v-video-close');

        const openVideoModal = () => {
            videoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            welcomeVideo.play().catch(err => {
                console.log("Auto-play blocked or video failed to play:", err);
            });
        };

        const closeVideoModal = () => {
            videoModal.classList.remove('active');
            document.body.style.overflow = '';
            welcomeVideo.pause();
            welcomeVideo.currentTime = 0; // reset video playback
        };

        videoBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            openVideoModal();
        });

        if (videoClose) videoClose.addEventListener('click', closeVideoModal);
        if (videoOverlay) videoOverlay.addEventListener('click', closeVideoModal);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });
    }

    // About Page View All Doctors Toggle
    const viewAllDoctorsBtn = document.getElementById('view-all-doctors-btn');
    if (viewAllDoctorsBtn) {
        viewAllDoctorsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const hiddenCards = document.querySelectorAll('.v-doctor-card.hidden-doctor');
            hiddenCards.forEach((card, index) => {
                card.classList.remove('hidden-doctor');
                card.classList.add('fade-in-doctor');
                card.style.animationDelay = `${index * 80}ms`;
            });
            // Hide the button after expansion
            viewAllDoctorsBtn.parentElement.style.display = 'none';
        });
    }

    // Premium Services Slider Carousel (About Page)
    const sliderTrack = document.getElementById('v-slider-track');
    const sliderViewport = document.getElementById('v-slider-viewport');
    if (sliderTrack && sliderViewport) {
        const originalCards = Array.from(sliderTrack.querySelectorAll('.v-slider-card'));
        const dotsContainer = document.getElementById('v-slider-dots');

        // Clone 4 cards at start and end to make it infinite
        const numClones = 4;
        
        // Clone first elements and append to end
        for (let i = 0; i < numClones; i++) {
            const clone = originalCards[i].cloneNode(true);
            clone.classList.add('v-slider-clone');
            sliderTrack.appendChild(clone);
        }
        
        // Clone last elements and prepend to start
        for (let i = originalCards.length - numClones; i < originalCards.length; i++) {
            const clone = originalCards[i].cloneNode(true);
            clone.classList.add('v-slider-clone');
            sliderTrack.insertBefore(clone, sliderTrack.firstChild);
        }

        // Get the full list of cards including clones
        const allCards = Array.from(sliderTrack.querySelectorAll('.v-slider-card'));
        
        // Start index at the first original card (after prepended clones)
        let currentIndex = numClones; 
        let isTransitioning = false;

        // Create pagination dots for original cards only
        originalCards.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.classList.add('v-slider-dot');
            if (idx === 0) dot.classList.add('active-dot');
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.addEventListener('click', () => {
                if (isTransitioning) return;
                goToOriginalIndex(idx);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.v-slider-dot');

        function updateSliderPosition(animate = true) {
            if (animate) {
                sliderTrack.style.transition = 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
            } else {
                sliderTrack.style.transition = 'none';
            }

            const viewportWidth = sliderViewport.offsetWidth;
            const cardWidth = allCards[0].offsetWidth;
            const computedGap = parseInt(window.getComputedStyle(sliderTrack).gap) || 35;
            const centerOffset = (viewportWidth - cardWidth) / 2;
            const trackOffset = -currentIndex * (cardWidth + computedGap) + centerOffset;

            sliderTrack.style.transform = `translateX(${trackOffset}px)`;

            // Update active states based on current centered card
            allCards.forEach((card, idx) => {
                if (idx === currentIndex) {
                    card.classList.add('active-slide');
                } else {
                    card.classList.remove('active-slide');
                }
            });

            // Update active dots matching current original index
            const origIndex = getOriginalIndex(currentIndex);
            dots.forEach((dot, idx) => {
                if (idx === origIndex) {
                    dot.classList.add('active-dot');
                } else {
                    dot.classList.remove('active-dot');
                }
            });
        }

        function getOriginalIndex(index) {
            let originalIndex = (index - numClones) % originalCards.length;
            if (originalIndex < 0) {
                originalIndex += originalCards.length;
            }
            return originalIndex;
        }

        function goToSlide(index, animate = true) {
            if (isTransitioning && animate) return;
            currentIndex = index;
            isTransitioning = animate;
            updateSliderPosition(animate);
            // Reset autoplay timer on manual transition
            startAutoplay();
        }

        function goToOriginalIndex(origIdx) {
            goToSlide(origIdx + numClones);
        }

        // Handle seamless wrapping after transition ends
        sliderTrack.addEventListener('transitionend', () => {
            isTransitioning = false;
            
            // If scrolled past original slides to right clones
            if (currentIndex >= originalCards.length + numClones) {
                currentIndex = currentIndex - originalCards.length;
                updateSliderPosition(false);
            }
            // If scrolled past original slides to left clones
            else if (currentIndex < numClones) {
                currentIndex = currentIndex + originalCards.length;
                updateSliderPosition(false);
            }
        });

        // Autoplay Logic
        let autoplayInterval;

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 4000); // Cycles slides every 4 seconds
        }

        function stopAutoplay() {
            if (autoplayInterval) {
                clearInterval(autoplayInterval);
            }
        }

        // Support clicking directly on side cards to slide to them
        allCards.forEach((card, idx) => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('v-slider-card-btn')) return;
                goToSlide(idx);
            });
        });

        // Initialize positioning and autoplay
        updateSliderPosition(false);
        startAutoplay();

        // Pause autoplay on mouse hover
        sliderViewport.addEventListener('mouseenter', stopAutoplay);
        sliderViewport.addEventListener('mouseleave', startAutoplay);

        // Handle window resizing
        window.addEventListener('resize', () => {
            updateSliderPosition(false);
        });

        // Mobile touch & swipe navigation
        let startX = 0;
        let isDragging = false;
        
        sliderViewport.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });

        sliderViewport.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            const diffX = e.changedTouches[0].clientX - startX;
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    goToSlide(currentIndex - 1);
                } else {
                    goToSlide(currentIndex + 1);
                }
            }
            isDragging = false;
        }, { passive: true });
    }
});

