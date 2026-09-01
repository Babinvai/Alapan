// Global Cart Variables
let cartTotalItems = 0;
let cartTotalPrice = 0;

// =========================================================
// CART OPEN / CLOSE LOGIC
// =========================================================
window.openCart = function() {
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    if(cartOverlay && cartDrawer) {
        cartOverlay.style.display = 'block';
        setTimeout(() => {
            cartOverlay.style.opacity = '1';
            cartDrawer.classList.add('open');
        }, 10);
        
        // Locks the background from scrolling
        document.body.classList.add('no-scroll');
    }
};

window.closeCart = function() {
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    if(cartOverlay && cartDrawer) {
        cartDrawer.classList.remove('open');
        cartOverlay.style.opacity = '0';
        setTimeout(() => {
            cartOverlay.style.display = 'none';
        }, 300);
        
        // Unlocks the background so the user can scroll normally again
        document.body.classList.remove('no-scroll');
    }
};

window.showToast = function() {
    const cartToast = document.getElementById('cartToast');
    if(cartToast) {
        cartToast.classList.add('show');
        setTimeout(() => {
            cartToast.classList.remove('show');
        }, 3000);
    } else {
        alert("✅ Product added to cart!"); // Fallback if toast HTML is missing
    }
};

// ADD TO CART FUNCTION
window.addToCart = function(productName, price) {
    cartTotalItems++;
    cartTotalPrice += price;

    // Update Header Icons
    const cartIcons = document.querySelectorAll('.cart-icon-btn');
    cartIcons.forEach(icon => {
        icon.innerHTML = `🛒 (${cartTotalItems})`;
    });

    // Add Item to Drawer
    const cartItemsContainer = document.querySelector('.cart-items');
    if(cartItemsContainer) {
        if(cartTotalItems === 1) cartItemsContainer.innerHTML = ''; // Clear empty message
        
        cartItemsContainer.innerHTML += `
            <div style="display: flex; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                <div style="width: 70px; height: 70px; background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px;"></div>
                <div style="flex: 1; text-align: left;">
                    <h4 class="font-serif" style="color: var(--brand-green); font-size: 1rem; margin: 0 0 5px 0;">[Brand Name] Ghee</h4>
                    <p style="font-size: 0.85rem; color: #666; margin: 0 0 5px 0;">${productName}</p>
                    <p style="font-weight: bold; color: var(--brand-gold); margin: 0;">₹${price}</p>
                </div>
            </div>
        `;
    }

    // Update Total Price
    const cartFooter = document.querySelector('.cart-footer span:nth-child(2)');
    if(cartFooter) {
        cartFooter.innerHTML = `₹${cartTotalPrice.toFixed(2)}`;
    }

    // Trigger feedback
    window.showToast();
    window.openCart(); 
};

// BUY NOW FUNCTION
window.buyNow = function(productName) {
    // Redirects immediately to product page
    window.location.href = 'shop.html'; 
};

// ==========================================
// Wait for page to load before attaching clicks
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    // Attach Cart Close Buttons
    const closeCartBtn = document.getElementById('closeCart');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if(closeCartBtn) closeCartBtn.addEventListener('click', window.closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click', window.closeCart);

    // Attach Header Cart Icon Clicks
    const cartIcons = document.querySelectorAll('.cart-icon-btn');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            window.openCart();
        });
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if(mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            if(mobileNav.style.display === 'flex') {
                mobileNav.style.display = 'none';
            } else {
                mobileNav.style.display = 'flex';
            }
        });
    }
});


    
        document.addEventListener('DOMContentLoaded', () => {
            const track = document.getElementById('reviewTrack');
            let isDown = false;
            let startX;
            let scrollLeft;
            let isHovered = false;
            let scrollSpeed = 1; // You can change this to 2 to make it scroll faster

            // The continuous automatic loop
            function autoScroll() {
                if (!isHovered && !isDown) {
                    track.scrollLeft += scrollSpeed;
                }

                // Seamlessly loops forward or backward infinitely
                if (track.scrollLeft >= track.scrollWidth / 2) {
                    track.scrollLeft -= track.scrollWidth / 2;
                } else if (track.scrollLeft <= 0) {
                    track.scrollLeft += track.scrollWidth / 2;
                }

                requestAnimationFrame(autoScroll);
            }

            requestAnimationFrame(autoScroll); // Start the engine

            // Manual Drag-to-Scroll for Desktop
            track.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - track.offsetLeft;
                scrollLeft = track.scrollLeft;
            });
            track.addEventListener('mouseleave', () => { isDown = false; });
            track.addEventListener('mouseup', () => { isDown = false; });
            track.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - track.offsetLeft;
                const walk = (x - startX) * 2; // Multiplier adjusts drag sensitivity
                track.scrollLeft = scrollLeft - walk;
            });

            // Pause on Hover & Touch
            const cards = document.querySelectorAll('.interactive-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => isHovered = true);
                card.addEventListener('mouseleave', () => isHovered = false);
                card.addEventListener('touchstart', () => isHovered = true, {passive: true});
                card.addEventListener('touchend', () => {
                    setTimeout(() => isHovered = false, 1500); // Resumes 1.5s after touch ends
                });
            });
        });
    


    // --- SCROLL TRIGGER FOR FALLING STAMPS (SAFE PLACEMENT) ---
document.addEventListener('DOMContentLoaded', () => {
    const stampObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // When the stamp scrolls into the viewport
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('is-stamped');
                // Stop observing it so it doesn't replay endlessly
                stampObserver.unobserve(entry.target); 
            }
        });
    }, { 
        threshold: 0.3 // Triggers when 30% of the stamp section is visible
    });

    // Attach the observer to all graphics safely after the page loads
   // Attach the observer to all graphics safely after the page loads
    const stamps = document.querySelectorAll('.stamp-container'); // <-- UPDATED HERE
    if (stamps.length > 0) {
        stamps.forEach(stamp => {
            stampObserver.observe(stamp);
        });
    }
});





// =========================================================
// MASTER CART LOGIC (Memory, Images, Total Calculation)
// =========================================================

// 1. Load Cart from Browser Memory
let cart = JSON.parse(localStorage.getItem('ghoshDharaCart')) || [];

// 2. Save Cart to Browser Memory
function saveCart() {
    localStorage.setItem('ghoshDharaCart', JSON.stringify(cart));
}

// 3. Master Function to Draw the Cart UI
window.updateCartUI = function() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartIcons = document.querySelectorAll('.cart-icon-btn, .cart-count');
    
    // Calculate precise totals
    let totalItems = cart.length;
    let totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    // A. Update Header Icons
    cartIcons.forEach(icon => {
        if (icon.classList.contains('cart-count')) {
            icon.textContent = totalItems;
        } else {
            icon.innerHTML = `🛒 (${totalItems})`;
        }
    });

    // B. Update Total Price (Searches for the specific Subtotal box)
    const cartFooter = document.querySelector('.cart-footer');
    if (cartFooter) {
        // This forces the footer to always show the correct total price
        cartFooter.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 1.2rem; color: #174B37;">
                <span style="font-weight: 600;">Subtotal</span>
                <span style="font-weight: 700; font-family: 'Playfair Display', serif;">₹${totalPrice.toFixed(2)}</span>
            </div>
            <p style="font-size: 0.8rem; color: #666; margin-top: -10px; margin-bottom: 15px;">Shipping and taxes calculated at checkout.</p>
            <div id="cart-checkout-error"></div>
            <a href="#" onclick="handleCheckoutClick(event)" style="display: block; width: 100%; padding: 15px; background: #174B37; color: #fff; text-align: center; text-decoration: none; font-weight: 600; border-radius: 4px; transition: transform 0.2s ease;">Proceed to Secure Checkout</a>
            <p style="text-align: center; font-size: 0.75rem; color: #666; margin-top: 10px;">💳 Cards, UPI & Net Banking Accepted</p>
        `;
    }

    // C. Draw the Products & The Stylish Empty Cart
    if (cartItemsContainer) {
        if (cart.length === 0) {
            // STYLISH EMPTY CART DESIGN
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; margin-top: 60px;">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#D9B12D" stroke-width="1.5" style="margin-bottom: 15px;">
                        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <h3 style="color: #174B37; font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 10px;">Your cart is empty</h3>
                    <p style="color: #5A6963; font-size: 0.95rem;">Looks like you haven't added any pure ghee yet.</p>
        
<button onclick="window.location.href='shop.html'" style="margin-top: 20px; padding: 10px 20px; background: transparent; border: 1px solid #D9B12D; color: #174B37; font-weight: 600; border-radius: 4px; cursor: pointer; transition: all 0.3s ease;">Continue Shopping</button>
            `;
            return;
        }

        // Draw saved items with images and remove buttons
        cartItemsContainer.innerHTML = cart.map((item, index) => `
            <div style="display: flex; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
                <div style="width: 70px; height: 70px; background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;">
                    <!-- Passes the image URL to the cart -->
                    <img src="${item.img}" alt="Ghosh Dhara Ghee" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="flex: 1; text-align: left;">
                    <h4 class="font-serif" style="color: #174B37; font-size: 1rem; margin: 0 0 5px 0;">Ghosh Dhara Ghee</h4>
                    <p style="font-size: 0.85rem; color: #666; margin: 0 0 5px 0;">${item.name}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                        <p style="font-weight: bold; color: #D9B12D; margin: 0;">₹${item.price.toFixed(2)}</p>
                        <!-- REMOVE BUTTON -->
                        <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #B86745; font-size: 0.85rem; text-decoration: underline; cursor: pointer; padding: 0;">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

// 4. Upgraded Add to Cart Function (Now accepts Images!)
window.addToCart = function(productName, price, imgUrl) {
    // If no image is provided, it uses a beautiful default jar image
    let fallbackImg = "https://images.unsplash.com/photo-1605807646983-377bc5a76493?auto=format&fit=crop&q=80&w=200"; 
    
    cart.push({ 
        name: productName, 
        price: parseFloat(price), 
        img: imgUrl || fallbackImg 
    });
    
    saveCart();
    updateCartUI();
    window.showToast();
    window.openCart();
};

// 5. Remove Function
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

// 6. Automatically draw cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI(); 
    
});





// =========================================================
// MOBILE NAVIGATION DRAWER LOGIC
// =========================================================
// =========================================================
// MOBILE NAVIGATION DRAWER LOGIC
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMobileNav = document.getElementById('closeMobileNav');
    const mobileNavDrawer = document.getElementById('mobileNavDrawer');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');

    if (mobileMenuBtn && mobileNavDrawer) {
        // Open Drawer (Adds Scroll Lock)
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavDrawer.classList.add('active');
            mobileNavOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
        });

        // Close Drawer via 'X' Button (Removes Scroll Lock)
        closeMobileNav.addEventListener('click', () => {
            mobileNavDrawer.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });

        // Close Drawer by tapping the dark background (Removes Scroll Lock)
        mobileNavOverlay.addEventListener('click', () => {
            mobileNavDrawer.classList.remove('active');
            mobileNavOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
});// =========================================================
// CHECKOUT NAVIGATION HANDLER
// =========================================================

window.handleCheckoutClick = function(e) {
    e.preventDefault();
    if (window.firebaseUserLoggedIn) {
        window.location.href = "checkout.html";
    } else {
        const errDiv = document.getElementById('cart-checkout-error');
        if (errDiv) {
            errDiv.innerHTML = `
                <div style="background: #FFF0F0; color: #D32F2F; padding: 12px; border-radius: 6px; margin-bottom: 15px; font-size: 0.85rem; text-align: center; border: 1px solid #FFCDD2; font-family: 'Inter', sans-serif;">
                    Please <a href="login.html" style="color: #D32F2F; font-weight: bold; text-decoration: underline;">Log In</a> or <a href="register.html" style="color: #D32F2F; font-weight: bold; text-decoration: underline;">Create an Account</a> to proceed.
                </div>
            `;
        } else {
            window.location.href = "login.html";
        }
    }
}










// =========================================================
