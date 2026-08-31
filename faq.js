// =========================================================
// GHOSH DHARA - FAQ PAGE SCRIPT
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. FAQ ACCORDION LOGIC
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });

            // Toggle current FAQ
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
});
