import { auth, db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

// =========================================================
// CHECKOUT PAGE LOGIC
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Load Cart Data
    // Check if user clicked "Buy Now" (Direct Checkout) via URL parameter
    const isDirectBuy = window.location.search.includes('buyNow=true');
    let directBuyCartRaw = sessionStorage.getItem('ghoshDharaDirectBuy');
    let cart = [];
    
    if (isDirectBuy && directBuyCartRaw) {
        cart = JSON.parse(directBuyCartRaw) || [];
    } else {
        cart = JSON.parse(localStorage.getItem('ghoshDharaCart')) || [];
    }
    
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const shippingEl = document.getElementById('checkout-shipping');
    const totalEl = document.getElementById('checkout-total');
    
    // Prevent rendering if not on checkout page
    if (!document.querySelector('.checkout-container')) return;

    // Redirect to home if cart is empty
    if (cart.length === 0) {
        alert("Your cart is empty. Let's add some ghee first!");
        window.location.href = "shop.html";
        return;
    }

    // 2. Render Order Summary
    if (checkoutItemsContainer) {
        checkoutItemsContainer.innerHTML = cart.map(item => `
            <div class="summary-item">
                <div class="summary-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="summary-item-info">
                    <h4 class="summary-item-title">Ghosh Dhara Ghee</h4>
                    <p style="font-size: 0.85rem; color: #666; margin: 0;">${item.name}</p>
                </div>
                <p class="summary-item-price">₹${item.price.toFixed(2)}</p>
            </div>
        `).join('');

        // 3. Calculate Totals
        let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        let shipping = subtotal > 999 ? 0 : 99; // Free shipping over ₹999
        let discount = 0;

        const updateTotals = () => {
            let finalTotal = subtotal + shipping - discount;
            if (finalTotal < 0) finalTotal = 0;
            
            subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
            shippingEl.textContent = shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`;
            totalEl.textContent = `₹${finalTotal.toFixed(2)}`;
            
            const discountLine = document.getElementById('discount-line');
            const discountEl = document.getElementById('checkout-discount');
            if (discountLine && discountEl) {
                if (discount > 0) {
                    discountLine.style.display = 'flex';
                    discountEl.textContent = `-₹${discount.toFixed(2)}`;
                } else {
                    discountLine.style.display = 'none';
                }
            }
        };
        
        updateTotals();

        // 3.5 Promo Code Logic
        const btnApplyPromo = document.getElementById('btn-apply-promo');
        const promoInput = document.getElementById('promo-code-input');
        const promoMsg = document.getElementById('promo-message');
        const discountLabel = document.getElementById('discount-label');
        
        if (btnApplyPromo && promoInput) {
            btnApplyPromo.addEventListener('click', () => {
                const code = promoInput.value.trim().toUpperCase();
                if (!code) {
                    promoMsg.textContent = "Please enter a code.";
                    promoMsg.className = "promo-msg error";
                    return;
                }
                
                // Dummy logic for demonstration
                if (code === 'GHOSH10') {
                    discount = subtotal * 0.10; // 10% off
                    promoMsg.textContent = "🎉 10% discount applied successfully!";
                    promoMsg.className = "promo-msg success";
                    if (discountLabel) discountLabel.textContent = code;
                    updateTotals();
                } else if (code === 'WELCOME50') {
                    discount = 50; // flat ₹50 off
                    promoMsg.textContent = "🎉 Flat ₹50 discount applied!";
                    promoMsg.className = "promo-msg success";
                    if (discountLabel) discountLabel.textContent = code;
                    updateTotals();
                } else {
                    discount = 0;
                    promoMsg.textContent = "Invalid or expired promo code.";
                    promoMsg.className = "promo-msg error";
                    updateTotals();
                }
            });
        }
    }

    // 4. Handle Order Submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Strict validation
            const name = document.getElementById('c-name').value.trim();
            const phone = document.getElementById('c-phone').value.trim();
            const address = document.getElementById('c-address').value.trim();
            const city = document.getElementById('c-city').value.trim();
            const pin = document.getElementById('c-pin').value.trim();

            const phoneRegex = /^[0-9]{10}$/;
            const pinRegex = /^[0-9]{6}$/;
            const cityRegex = /^[a-zA-Z\s]{3,}$/;

            if (!name || name.length < 3) {
                alert("Please enter a valid Full Name (at least 3 characters).");
                return;
            }
            if (!phoneRegex.test(phone)) {
                alert("Please enter a valid 10-digit WhatsApp number (without +91).");
                return;
            }
            if (!address || address.length < 10) {
                alert("Please enter a complete address (minimum 10 characters).");
                return;
            }
            if (!cityRegex.test(city)) {
                alert("Please enter a valid city name.");
                return;
            }
            if (!pinRegex.test(pin)) {
                alert("Please enter a valid 6-digit PIN code.");
                return;
            }

            

            // REGIONAL AVAILABILITY CHECK (PIN CODE PREFIX)
            // 700: Kolkata/Greater Kolkata
            // 711: Howrah
            // 712: Hooghly
            // 741: Nadia
            // 743: North & South 24 Parganas
            const allowedPrefixes = ['700', '711', '712', '741', '743'];
            const pinPrefix = pin.substring(0, 3);
            
            const errDiv = document.getElementById('checkout-error-message');
            errDiv.style.display = 'none'; // reset previous errors

            if (!allowedPrefixes.includes(pinPrefix)) {
                errDiv.innerHTML = "<strong>Delivery Unavailable</strong><br>We're sorry, but we don't currently deliver to this PIN code. We are expanding rapidly, so delivery to your area will be available very soon!";
                errDiv.style.display = 'block';
                return;
            }

            // Simulate Processing
            const submitBtn = checkoutForm.querySelector('.btn-place-order');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Processing Securely...";
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;

            setTimeout(async () => {
                const orderNumber = "GD" + Math.floor(100000 + Math.random() * 900000);
                
                // 1. Calculate Totals
                let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
                let shipping = subtotal > 999 ? 0 : 99;
                let finalTotal = subtotal + shipping;

                // 2. Format Order Details for Email
                let orderItems = cart.map(item => `1x ${item.name} (₹${item.price.toFixed(2)})`).join('\n');
                
                const orderDetails = `
ORDER NUMBER: ${orderNumber}

CUSTOMER DETAILS
Name: ${name}
Phone: ${phone}
Address: ${address}, ${city} - ${pin}

ORDER ITEMS
${orderItems}

SUMMARY
Subtotal: ₹${subtotal.toFixed(2)}
Shipping: ${shipping === 0 ? 'Free' : '₹' + shipping.toFixed(2)}
TOTAL: ₹${finalTotal.toFixed(2)}
PAYMENT: Cash on Delivery
                `;

                // 3. SECURE SILENT EMAIL SUBMISSION (Web3Forms)
                // The email address is completely hidden behind the access key so hackers cannot scrape it.
                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            // YOUR UNIQUE ACCESS KEY GOES HERE
                            access_key: "ec976ff1-daec-4d08-b874-7fd7ccee1c4c",
                            subject: `New Ghee Order - ${orderNumber} (₹${finalTotal.toFixed(2)})`,
                            from_name: "Ghosh Dhara Website",
                            message: orderDetails
                        })
                    });

                    
                    if (response.status !== 200) {
                        console.error("Failed to send order email.");
                    }
                } catch (error) {
                    console.error("Error submitting order.", error);
                }

                // 3.5 SAVE ORDER TO FIRESTORE (If user is logged in)
                try {
                    const user = auth.currentUser;
                    if (user) {
                        await addDoc(collection(db, "orders"), {
                            userId: user.uid,
                            orderNumber: orderNumber,
                            itemsSummary: orderItems,
                            total: finalTotal,
                            status: "Processing",
                            createdAt: serverTimestamp()
                        });
                    }
                } catch (error) {
                    console.error("Error saving order to Firestore:", error);
                }

                // 4. Clear Cart
                localStorage.removeItem('ghoshDharaCart');
                sessionStorage.removeItem('ghoshDharaDirectBuy');
                
                // 5. Show Success Modal instantly (Customer never leaves the page)
                const modal = document.getElementById('orderSuccessModal');
                document.getElementById('orderNumberDisplay').textContent = orderNumber;
                modal.classList.add('active');

            }, 1000); // 1 second simulated loading
        });
    }
});