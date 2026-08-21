// =========================================================
// GHOSH DHARA - LAB REPORT SCRIPTS
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. STICKY HEADER & SCROLL REVEAL
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => observer.observe(el));

    // 2. MOBILE MENU CONTROLS
    const menuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMobileNav');
    const navDrawer = document.getElementById('mobileNavDrawer');
    const navOverlay = document.getElementById('mobileNavOverlay');

    function toggleMenu(show) {
        if(show) {
            navDrawer.classList.add('active');
            navOverlay.style.display = 'block';
            setTimeout(() => navOverlay.style.opacity = '1', 10);
            document.body.style.overflow = 'hidden';
        } else {
            navDrawer.classList.remove('active');
            navOverlay.style.opacity = '0';
            setTimeout(() => navOverlay.style.display = 'none', 300);
            document.body.style.overflow = '';
        }
    }
    if(menuBtn) menuBtn.addEventListener('click', () => toggleMenu(true));
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', () => toggleMenu(false));
    if(navOverlay) navOverlay.addEventListener('click', () => toggleMenu(false));

    // 3. BATCH FINDER LOGIC (Strict Compliance Mode)
    const form = document.getElementById('batchSearchForm');
    const input = document.getElementById('batchInput');
    const msgBox = document.getElementById('searchMessage');
    const resultPanel = document.getElementById('resultPanel');

    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = input.value.trim();
            
            // Reset UI
            msgBox.style.display = 'none';
            msgBox.className = 'search-message';
            resultPanel.style.display = 'none';

            if (!val) {
                msgBox.innerHTML = 'We could not find that batch number. Please check your label and try again. <br><br> <a href="contact.html" class="whatsapp-btn">Contact Support on WhatsApp →</a>';
                msgBox.classList.add('error');
                msgBox.style.display = 'block';
            } else {
                // HONESTY COMPLIANCE: 
                // Since there is no live backend data yet, we must NOT invent fake test results.
                // We show the exact honest placeholder text requested by the prompt guidelines.
                
                msgBox.innerHTML = `Batch report lookup is being prepared for <strong>${val}</strong>. Please contact us with your batch number and a photo of your label for assistance. <br><br> <a href="contact.html" class="whatsapp-btn">Get Help on WhatsApp →</a>`;
                msgBox.classList.add('info');
                msgBox.style.display = 'block';

                /* 
                 * DEVELOPER NOTE for Backend Integration:
                 * When live database is ready, replace the above block with fetch() logic.
                 * If a valid report exists, populate the DOM elements inside 'resultPanel' 
                 * and set: resultPanel.style.display = 'block';
                 */
            }
        });
    }

    // 4. REPORT TABS (Simple vs Technical)
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tableContainers = document.querySelectorAll('.table-container');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tableContainers.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding table
            btn.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // 5. FAQ ACCORDION
    const confQuestions = document.querySelectorAll('.faq-question');
    confQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Close all
            confQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });
            // Open clicked if it was closed
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

});