// =========================================================
// GHOSH DHARA - SHOP SCRIPTS (100% Synced with script.js)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. STICKY HEADER & SCROLL REVEAL
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
        revealElements.forEach(el => observer.observe(el));
    }

    // 2. PRODUCT GALLERY & SIZE SELECTION LOGIC
    let currentSize = "500g Everyday Jar";
    let currentPrice = 850;
    let currentImg = "500ml.png";

    const mainImg = document.getElementById('mainProductImage');
    const thumbBtns = document.querySelectorAll('.thumb-btn');
    const sizeCards = document.querySelectorAll('.size-card');
    const priceDisplay = document.getElementById('currentPrice');
    const unitPriceDisplay = document.getElementById('unitPrice');
    const stickyPrice = document.querySelector('.sticky-price');
    const stickySize = document.querySelector('.sticky-size');

    function updateProductSelection(imgSrc) {
        if(mainImg) mainImg.src = imgSrc;
        thumbBtns.forEach(b => {
            if(b.getAttribute('data-img') === imgSrc) b.classList.add('active');
            else b.classList.remove('active');
        });
    }

    thumbBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const newSrc = btn.getAttribute('data-img');
            updateProductSelection(newSrc);
            sizeCards.forEach(card => {
                if(card.getAttribute('data-img') === newSrc) card.click();
            });
        });
    });

    

   const discountBadge = document.getElementById('discountBadge'); // Target the new badge

    sizeCards.forEach(card => {
        card.addEventListener('click', () => {
            sizeCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            currentSize = card.getAttribute('data-size');
            currentPrice = parseInt(card.getAttribute('data-price'));
            currentImg = card.getAttribute('data-img');
            const unitText = card.getAttribute('data-unit');
            const discountVal = card.getAttribute('data-discount'); // Get the discount number

            if(priceDisplay) priceDisplay.textContent = `₹${currentPrice}`;
            if(unitPriceDisplay) unitPriceDisplay.textContent = unitText;
            if(stickyPrice) stickyPrice.textContent = `₹${currentPrice}`;
            if(stickySize) stickySize.textContent = currentSize;
            
            // Dynamic Discount Badge Logic
            if(discountBadge) {
                if (discountVal && discountVal !== "") {
                    // Inject the number and the word "OFF"
                    discountBadge.innerHTML = `${discountVal}%<br><span>OFF</span>`;
                    discountBadge.style.display = 'flex';
                } else {
                    // Hide the badge if there is no discount for this size
                    discountBadge.style.display = 'none';
                }
            }
            
            updateProductSelection(currentImg);
        });
    });

    // 3. QUANTITY CONTROL
    const qtyInput = document.getElementById('qtyInput');
    if(document.getElementById('qtyMinus')) {
        document.getElementById('qtyMinus').addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            if (val > 1) qtyInput.value = val - 1;
        });
    }
    if(document.getElementById('qtyPlus')) {
        document.getElementById('qtyPlus').addEventListener('click', () => {
            let val = parseInt(qtyInput.value);
            qtyInput.value = val + 1;
        });
    }

    // 4. THE MAGIC SYNC: Delegating Add To Cart to script.js!
    const addBtn = document.getElementById('btnAddToCart');
    if(addBtn) {
        addBtn.addEventListener('click', () => {
            const qty = parseInt(qtyInput.value) || 1;
            
            if (typeof window.addToCart === 'function') {
                let addedCount = 0;
                function addNext() {
                    if (addedCount < qty) {
                        window.addToCart(currentSize, currentPrice, currentImg);
                        addedCount++;
                        setTimeout(addNext, 50); 
                    } else {
                        const toast = document.getElementById('cartToast');
                        if(toast) {
                            toast.classList.add('show');
                            setTimeout(() => toast.classList.remove('show'), 3000);
                        }
                    }
                }
                addNext();
            } else {
                console.error("Cart function not found! Is script.js linked at the bottom of shop.html?");
            }
        });
    }

    const buyNowBtn = document.getElementById('btnBuyNow');
    if(buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            if (typeof window.BuyNow === 'function') {
                window.BuyNow(currentSize);
            } else {
                if(addBtn) addBtn.click();
                if (typeof window.openCart === 'function') window.openCart();
            }
        });
    }

    // 5. PRODUCT CONFIDENCE ACCORDION
    const confQuestions = document.querySelectorAll('.conf-question');
    confQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            confQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                q.nextElementSibling.style.maxHeight = null;
            });
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });


    // =========================================================
    // DELIVERY PINCODE CHECKER LOGIC
    // =========================================================
    const btnCheckPincode = document.getElementById('btnCheckPincode');
    const pincodeInput = document.getElementById('pincodeInput');
    const pincodeMessage = document.getElementById('pincodeMessage');

    if(btnCheckPincode && pincodeInput && pincodeMessage) {
        btnCheckPincode.addEventListener('click', () => {
            const pin = pincodeInput.value.trim();
            pincodeMessage.className = 'pincode-msg'; // Reset classes
            
            // Basic validation for a 6-digit Indian PIN code
            if(pin.length === 6 && !isNaN(pin)) {
                // UI Success State
                pincodeMessage.textContent = `✓ Delivery available to ${pin}. Standard shipping 3-5 days.`;
                pincodeMessage.classList.add('success');
            } else {
                // UI Error State
                pincodeMessage.textContent = 'Please enter a valid 6-digit PIN code.';
                pincodeMessage.classList.add('error');
            }
        });
        
        // Let users press "Enter" on their keyboard to check
        pincodeInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') {
                e.preventDefault(); // Stop page from refreshing
                btnCheckPincode.click();
            }
        });
    }



    
    // 6. MOBILE STICKY BAR OBSERVER
    const mainActionArea = document.querySelector('.purchase-actions');
    const stickyBar = document.getElementById('mobileStickyCart');
    if (mainActionArea && stickyBar && window.innerWidth <= 992) {
        const cartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyBar.classList.remove('visible');
                } else {
                    stickyBar.classList.add('visible');
                }
            });
        }, { threshold: 0 });
        cartObserver.observe(mainActionArea);
    }
});

// =========================================================
// GLOBAL MENU CONTROLS (Only menu, cart is in script.js)
// =========================================================
window.openShopMenu = function() {
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    if(drawer) drawer.classList.add('active');
    if(overlay) {
        overlay.style.display = 'block';
        setTimeout(() => overlay.style.opacity = '1', 10);
    }
    document.body.style.overflow = 'hidden';
};

window.closeShopMenu = function() {
    const drawer = document.getElementById('mobileNavDrawer');
    const overlay = document.getElementById('mobileNavOverlay');
    if(drawer) drawer.classList.remove('active');
    if(overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.style.display = 'none', 300);
    }
    document.body.style.overflow = '';
};



// Setup Continuous Cyclic Loop for Thumbnails & Manual Navigation
    const thumbnailTrack = document.getElementById('thumbnailTrack');
    const trackContainer = document.getElementById('thumbTrackContainer');
    const btnLeft = document.getElementById('thumbNavLeft');
    const btnRight = document.getElementById('thumbNavRight');

    if (thumbnailTrack && trackContainer) {
        // Clone the original thumbnails to allow seamless looping
        const originalThumbs = Array.from(thumbnailTrack.children);
        originalThumbs.forEach(thumb => {
            const clone = thumb.cloneNode(true);
            
            clone.addEventListener('click', () => {
                const newSrc = clone.getAttribute('data-img');
                updateProductSelection(newSrc);
                
                sizeCards.forEach(card => {
                    if(card.getAttribute('data-img') === newSrc) card.click();
                });
                document.querySelectorAll('.thumb-btn').forEach(b => {
                    if(b.getAttribute('data-img') === newSrc) b.classList.add('active');
                    else b.classList.remove('active');
                });
            });
            
            thumbnailTrack.appendChild(clone);
        });

        // Auto Scroll & Seamless Loop Logic
        let autoScrollInterval;
        let isManuallyScrolling = false;
        let resumeScrollTimeout;

        const autoScroll = () => {
            // Only scroll automatically if the user isn't hovering, touching, or clicking buttons
            if (!isManuallyScrolling && !trackContainer.matches(':hover') && !trackContainer.matches(':active')) {
                trackContainer.scrollLeft += 1;
                
                // Seamless loop: if scrolled halfway, jump back to 0 instantly
                if (trackContainer.scrollLeft >= thumbnailTrack.scrollWidth / 2) {
                    trackContainer.scrollLeft = 0;
                }
            }
            autoScrollInterval = requestAnimationFrame(autoScroll);
        };
        const startAutoScroll = () => { autoScrollInterval = requestAnimationFrame(autoScroll); };
        startAutoScroll();

        const pauseForManualInteraction = () => {
            isManuallyScrolling = true;
            clearTimeout(resumeScrollTimeout);
            resumeScrollTimeout = setTimeout(() => {
                isManuallyScrolling = false;
            }, 600); // Wait for the smooth scroll to finish
        };

        // Manual Navigation Buttons
        if (btnLeft && btnRight) {
            btnLeft.addEventListener('click', () => {
                pauseForManualInteraction();
                // If at the very start, silently jump to the middle clone area so they can scroll backwards
                if (trackContainer.scrollLeft <= 0) {
                    trackContainer.scrollLeft = thumbnailTrack.scrollWidth / 2;
                }
                trackContainer.scrollBy({ left: -140, behavior: 'smooth' });
            });
            btnRight.addEventListener('click', () => {
                pauseForManualInteraction();
                trackContainer.scrollBy({ left: 140, behavior: 'smooth' });
            });
        }
    }


    /* =========================================================
   FAQ / ACCORDION LOGIC ("Before you bring it home")
========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Select all the accordion buttons on the page
    const accordionQuestions = document.querySelectorAll('.faq-question'); 

    accordionQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;
            
            // 1. Close all other open accordions (optional, but keeps the page clean)
            accordionQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                if (q.nextElementSibling) {
                    q.nextElementSibling.style.maxHeight = null;
                }
                // Reset the icon back to '+'
                const icon = q.querySelector('.icon');
                if (icon) icon.textContent = '+';
            });

            // 2. Open the one that was just clicked (if it was previously closed)
            if (!isExpanded) {
                question.setAttribute('aria-expanded', 'true');
                if (answer) {
                    // Magically calculates the exact height needed to show the text
                    answer.style.maxHeight = answer.scrollHeight + "px"; 
                }
                // Change the icon to '-' (or a times symbol)
                const icon = question.querySelector('.icon');
                if (icon) icon.textContent = '−'; 
            }
        });
    });
});