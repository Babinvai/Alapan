// =========================================================
// GHOSH DHARA - OUR STORY SPECIFIC SCRIPTS
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. STICKY HEADER LOGIC
    // When the user scrolls down, add the 'scrolled' class to the header for the ivory blur effect
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
    // Uses Intersection Observer to fade in elements as they enter the screen
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealOptions = {
        threshold: 0.15, // Triggers when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Triggers slightly before it enters the absolute bottom
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

});



