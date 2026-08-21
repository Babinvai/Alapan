document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================
       2. SCROLL REVEAL ANIMATIONS
    ========================================================= */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    /* =========================================================
       3. PRESELECT FORM REASON & SMOOTH SCROLL
    ========================================================= */
    const scrollButtons = document.querySelectorAll('.scroll-to-form');
    const reasonSelect = document.getElementById('contactReason');

    scrollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const reason = button.getAttribute('data-reason');
            
            // Set the dropdown value
            if (reason && reasonSelect) {
                reasonSelect.value = reason;
                // Remove error styling if it existed
                reasonSelect.parentElement.parentElement.classList.remove('has-error');
            }

            // Scroll to form
            const formSection = document.getElementById('contactFormSection');
            if (formSection) {
                const headerOffset = 100;
                const elementPosition = formSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
/* =========================================================
       4. FAQ ACCORDION LOGIC (Class Toggle Method)
    ========================================================= */
    // Select all the accordion blocks
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            
            // Step 1: Close all other accordions first
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open'); // Removes the CSS trigger
                    otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                }
            });

            // Step 2: Toggle the one you just clicked
            item.classList.toggle('open');
            
            // Step 3: Animate the "+" to a "-" by updating the aria-expanded attribute
            const isOpen = item.classList.contains('open');
            header.setAttribute('aria-expanded', isOpen);
        });
    });
    /* =========================================================
       5. FORM VALIDATION & SUBMISSION
    ========================================================= */
    const contactForm = document.getElementById('ghoshDharaContactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous errors and statuses
            let isValid = true;
            document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
            formSuccess.classList.add('hidden');
            formError.classList.add('hidden');

            // Honeypot check for bots
            if (contactForm._honey.value !== "") {
                return false; 
            }

            // Validate Required Fields
            const requiredFields = ['fullName', 'emailAddress', 'contactReason', 'message'];
            requiredFields.forEach(id => {
                const field = document.getElementById(id);
                if (!field.value.trim()) {
                    field.closest('.form-group').classList.add('has-error');
                    isValid = false;
                }
            });

            // Validate Email specifically
            const emailField = document.getElementById('emailAddress');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailField.value && !emailPattern.test(emailField.value)) {
                emailField.closest('.form-group').classList.add('has-error');
                isValid = false;
            }

            // Validate Checkbox
            const consentBox = document.getElementById('consent');
            if (!consentBox.checked) {
                consentBox.closest('.checkbox-group').classList.add('has-error');
                isValid = false;
            }

            if (isValid) {
                // Change button state
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                /* 
                 * SIMULATED API CALL 
                 * Replace the setTimeout block with your actual fetch() request to your backend/CRM
                 */
                setTimeout(() => {
                    // Success Simulation
                    submitBtn.textContent = 'Send Message';
                    submitBtn.disabled = false;
                    
                    formSuccess.classList.remove('hidden');
                    contactForm.reset();
                    
                    // If simulating an error instead:
                    // formError.classList.remove('hidden');
                }, 1500);
            }
        });

        // Real-time validation removal on input
        contactForm.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('input', () => {
                input.closest('.form-group')?.classList.remove('has-error');
            });
        });
    }
});