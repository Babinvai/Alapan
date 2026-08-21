// =========================================================
// GHOSH DHARA - QUALITY & TRACEABILITY SCRIPTS
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. STICKY HEADER LOGIC
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // 3. FAQ ACCORDION LOGIC
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Close all others
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });

            // Toggle current
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});

// =========================================================
// BATCH FORM VALIDATION LOGIC
// =========================================================
function handleBatchLookup(event) {
    event.preventDefault(); // Prevents page reload
    
    const inputField = document.getElementById('batchInput');
    const feedbackBox = document.getElementById('batchFeedback');
    const batchValue = inputField.value.trim();

    // Reset styles
    feedbackBox.className = 'batch-feedback active';
    feedbackBox.innerHTML = '';

    if (batchValue === "") {
        feedbackBox.innerHTML = `
            <div class="feedback-box error">
                <strong>Wait!</strong> Please enter a batch number to search.
            </div>`;
        return;
    }

    // Since no live database exists yet, we display the mandated placeholder state.
    feedbackBox.innerHTML = `
        <div class="feedback-box info">
            <strong>Batch lookup is being prepared.</strong> 
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Please contact Ghosh Dhara with your batch number for support.</p>
            <a href="contact.html" style="display: inline-block; margin-top: 15px; color: #174B37; font-weight: 600; text-decoration: underline;">Contact Support on WhatsApp</a>
        </div>`;
}

// =========================================================
// DIRECT MOBILE MENU CONTROLS
// =========================================================
window.openQualityMenu = function() {
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    if (drawer && overlay) {
        drawer.classList.add('active');
        overlay.classList.add('active');
        document.body.classList.add('no-scroll');
    }
};

window.closeQualityMenu = function() {
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    if (drawer && overlay) {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
};