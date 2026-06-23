document.addEventListener('DOMContentLoaded', () => {
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
});
