import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updateProfile,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    addDoc,
    serverTimestamp,
    doc,
    deleteDoc,
    limit
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBN4KadgxMff5yTQtgWddUXyz2n8vF_xTw",
    authDomain: "gd-product.firebaseapp.com",
    projectId: "gd-product",
    storageBucket: "gd-product.firebasestorage.app",
    messagingSenderId: "407220117708",
    appId: "1:407220117708:web:cf7e02e4300804af472269",
    measurementId: "G-KFV2EZZQM5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export for checkout.js
export { auth, db, collection, addDoc, serverTimestamp, doc, deleteDoc };

// =========================================================
// GLOBAL AUTHENTICATION STATE OBSERVER
// =========================================================
onAuthStateChanged(auth, (user) => {
    // 1. Global Header Updates
    const desktopProfileBtns = document.querySelectorAll('.header-account-btn');
    const mobileAccountSection = document.querySelector('.mobile-account-section');

    if (user) {
        // User is logged in
        window.firebaseUserLoggedIn = true;
        desktopProfileBtns.forEach(btn => {
            const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');
            btn.href = 'profile.html';
            btn.innerHTML = `
                <div style="width: 36px; height: 36px; background-color: #174B37; border: 2px solid #D9B12D; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s ease;">
                    <span style="color: #D9B12D; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 1.2rem; line-height: 1; padding-top: 2px;">${initial}</span>
                </div>
            `;
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.textDecoration = 'none';
        });

        if (mobileAccountSection) {
            const displayName = user.displayName ? user.displayName.split(' ')[0] : 'User';
            mobileAccountSection.innerHTML = `
                <h3 style="color: #174B37; margin-bottom: 15px;">Welcome, ${displayName}!</h3>
                <a href="profile.html" style="display: block; width: 100%; padding: 12px; background: #174B37; color: #fff; text-align: center; text-decoration: none; border-radius: 6px; font-weight: bold;">MY DASHBOARD</a>
            `;
        }

        // Dashboard Page population
        const profilePage = document.getElementById('profile-dashboard');
        if (profilePage) {
            const greetingName = document.getElementById('profile-greeting-name');
            if (greetingName) greetingName.textContent = user.displayName ? user.displayName.split(' ')[0] : 'User';

            const profileAvatarSpan = document.querySelector('#profile-avatar span');
            const sidebarAvatar = document.getElementById('sidebar-avatar-initial');
            const userInitial = user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U');
            
            if (profileAvatarSpan) {
                profileAvatarSpan.textContent = userInitial;
            }
            if (sidebarAvatar) {
                sidebarAvatar.textContent = userInitial;
            }

            const infoName = document.getElementById('info-name');
            if (infoName) infoName.textContent = user.displayName || 'Not Provided';

            const infoEmail = document.getElementById('info-email');
            if (infoEmail) infoEmail.textContent = user.email;

            // Name Edit Logic
            const btnEditName = document.getElementById('btn-edit-name');
            const displayGroup = document.getElementById('info-name-display-group');
            const editGroup = document.getElementById('info-name-edit-group');
            const inputEditName = document.getElementById('input-edit-name');
            const btnSaveName = document.getElementById('btn-save-name');

            if (btnEditName) {
                // Remove previous event listeners by cloning
                const newBtnEdit = btnEditName.cloneNode(true);
                btnEditName.parentNode.replaceChild(newBtnEdit, btnEditName);

                newBtnEdit.addEventListener('click', () => {
                    document.getElementById('info-name-display-group').style.display = 'none';
                    document.getElementById('info-name-edit-group').style.display = 'flex';
                    const inp = document.getElementById('input-edit-name');
                    inp.value = user.displayName || '';
                    inp.focus();
                });
            }

            if (btnSaveName) {
                const newBtnSave = btnSaveName.cloneNode(true);
                btnSaveName.parentNode.replaceChild(newBtnSave, btnSaveName);

                newBtnSave.addEventListener('click', () => {
                    const newName = document.getElementById('input-edit-name').value.trim();
                    if (!newName) return;
                    
                    newBtnSave.textContent = '...';
                    newBtnSave.disabled = true;

                    updateProfile(user, { displayName: newName })
                        .then(() => {
                            // Update UI instantly
                            if (infoName) infoName.textContent = newName;
                            if (greetingName) greetingName.textContent = newName.split(' ')[0];
                            const newInitial = newName.charAt(0).toUpperCase();
                            if (profileAvatarSpan) profileAvatarSpan.textContent = newInitial;
                            if (sidebarAvatar) sidebarAvatar.textContent = newInitial;
                            
                            // Revert back to display mode
                            document.getElementById('info-name-display-group').style.display = 'flex';
                            document.getElementById('info-name-edit-group').style.display = 'none';
                            newBtnSave.textContent = 'Save';
                            newBtnSave.disabled = false;
                        })
                        .catch(err => {
                            console.error("Error updating name:", err);
                            newBtnSave.textContent = 'Save';
                            newBtnSave.disabled = false;
                            alert("Failed to update name.");
                        });
                });
            }

            // Fetch and render Recent Orders
            const ordersContainer = document.querySelector('.empty-orders');
            if (ordersContainer) {
                ordersContainer.innerHTML = 'Loading your orders...';

                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid)
                );

                getDocs(q).then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        ordersContainer.innerHTML = `
                            You haven't placed any orders yet. <br><br>
                            <a href="shop.html" style="color: #174B37; font-weight: bold;">Start Shopping &rarr;</a>
                        `;
                    } else {
                        // Fetch all orders into an array and sort them in memory to avoid needing a Firestore composite index
                        let orders = [];
                        querySnapshot.forEach((doc) => {
                            orders.push(doc.data());
                        });

                        // Sort descending by createdAt
                        orders.sort((a, b) => {
                            const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
                            const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
                            return timeB - timeA;
                        });

                        let ordersHTML = '';
                        orders.forEach((order) => {
                            let dateStr = 'Just now';
                            if (order.createdAt) {
                                const d = order.createdAt.toDate();
                                dateStr = d.toLocaleDateString() + ' at ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            }
                            const date = dateStr;
                            
                            // Mock status logic for visual flair
                            const now = new Date();
                            const orderDate = order.createdAt ? order.createdAt.toDate() : new Date();
                            const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
                            let status = "Processing";
                            let statusColor = "color: #B26A00; background: #FFF4E5; border-color: #FFE0B2;"; // Orange
                            if (diffDays > 3) {
                                status = "Delivered";
                                statusColor = "color: #2E7D32; background: #E8F5E9; border-color: #C8E6C9;"; // Green
                            }

                            ordersHTML += `
                                <div class="order-card-modern">
                                    <div class="order-header-modern">
                                        <div class="order-id-date">
                                            <span class="order-id">${order.orderNumber || 'Order'}</span>
                                            <span class="order-date">${date}</span>
                                        </div>
                                        <span class="order-status-badge" style="${statusColor}">${status}</span>
                                    </div>
                                    <div class="order-body-modern">
                                        <div class="order-product-info">
                                            <div class="order-product-icon">🍯</div>
                                            <div class="order-product-details">
                                                <p style="font-size: 0.95rem; white-space: pre-wrap; font-weight: 500;">${order.itemsSummary || 'Items ordered'}</p>
                                            </div>
                                        </div>
                                        <div class="order-total-modern">
                                            ₹${(order.total || 0).toFixed(2)}
                                        </div>
                                    </div>
                                    <div class="order-actions">
                                        <a href="shop.html" class="btn-order-again">Order Again</a>
                                    </div>
                                </div>
                            `;
                        });
                        ordersContainer.innerHTML = ordersHTML;
                    }
                }).catch(error => {
                    console.error("Error fetching orders: ", error);
                    ordersContainer.innerHTML = 'Error loading orders. You might need to create the Firestore database in the Firebase Console and configure index rules.';
                });
            }

            // ----------------------------------------------------------------
            // DYNAMIC VIEWS & CRUD FOR ADDRESSES AND PAYMENTS
            // ----------------------------------------------------------------
            setupProfileTabs();
            fetchAddresses(user.uid);
            fetchPayments(user.uid);
            setupForms(user.uid);
        }

        // ----------------------------------------------------------------
        // AUTO-FILL CHECKOUT FORM
        // ----------------------------------------------------------------
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            const nameInput = document.getElementById('c-name');
            const phoneInput = document.getElementById('c-phone');
            const addressInput = document.getElementById('c-address');
            const cityInput = document.getElementById('c-city');
            const pinInput = document.getElementById('c-pin');

            if (nameInput && !nameInput.value) nameInput.value = user.displayName || '';
            
            // Fetch most recent address to autofill the rest
            const q = query(collection(db, "users", user.uid, "addresses"), orderBy("createdAt", "desc"), limit(1));
            getDocs(q).then(snapshot => {
                if(!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    if(addressInput && !addressInput.value) addressInput.value = data.street || '';
                    if(cityInput && !cityInput.value) cityInput.value = data.city || '';
                    if(pinInput && !pinInput.value) pinInput.value = data.pin || '';
                    if(phoneInput && !phoneInput.value) phoneInput.value = data.phone || '';
                }
            }).catch(err => console.error("Error auto-filling address:", err));
        }

        // Redirect if they land on login/register pages
        const isAuthPage = document.getElementById('login-form') || document.getElementById('register-form');
        if (isAuthPage) {
            window.location.href = 'profile.html';
        }

    } else {
        // User is NOT logged in
        window.firebaseUserLoggedIn = false;

        // Block checkout for guests if they land directly on checkout.html
        const isCheckoutPage = document.querySelector('.checkout-container');
        if (isCheckoutPage) {
            window.location.href = 'login.html';
        }

        desktopProfileBtns.forEach(btn => {
            btn.href = 'login.html';
            btn.style.color = '';
            btn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            `;
        });

        if (mobileAccountSection) {
            mobileAccountSection.innerHTML = `
                <a href="login.html" class="btn-login" style="margin-bottom: 10px; text-decoration: none;">LOG IN</a>
                <a href="register.html" class="btn-register" style="text-decoration: none;">REGISTER</a>
            `;
        }

        // Redirect if they land on dashboard
        const profilePage = document.getElementById('profile-dashboard');
        if (profilePage) {
            window.location.href = 'login.html';
        }
    }
});

// =========================================================
// ERROR UI HELPER
// =========================================================
function showAuthError(form, message) {
    let errorDiv = form.querySelector('.auth-error-msg');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error-msg';
        errorDiv.style.backgroundColor = '#FDF0F0';
        errorDiv.style.color = '#D32F2F';
        errorDiv.style.padding = '12px 15px';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.marginBottom = '20px';
        errorDiv.style.fontSize = '0.9rem';
        errorDiv.style.display = 'flex';
        errorDiv.style.alignItems = 'center';
        errorDiv.style.gap = '10px';
        errorDiv.style.border = '1px solid #F8D7D7';
        errorDiv.style.animation = 'fadeIn 0.3s ease-in-out';
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    errorDiv.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 18px; height: 18px; flex-shrink: 0;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>${message}</span>
    `;
    
    if (!document.getElementById('auth-error-style')) {
        const style = document.createElement('style');
        style.id = 'auth-error-style';
        style.innerHTML = `@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`;
        document.head.appendChild(style);
    }
}

// =========================================================
// REGISTER FORM LOGIC
// =========================================================
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const submitBtn = registerForm.querySelector('button[type="submit"]');

        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Attach name to user profile
                return updateProfile(userCredential.user, {
                    displayName: name
                });
            })
            .then(() => {
                window.location.href = 'profile.html';
            })
            .catch((error) => {
                let msg = "Error creating account. Please try again.";
                if (error.code === 'auth/email-already-in-use') msg = "This email is already registered.";
                else if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
                
                showAuthError(registerForm, msg);
                submitBtn.textContent = 'Create Account';
                submitBtn.disabled = false;
            });
    });
}

// =========================================================
// LOGIN FORM LOGIC
// =========================================================
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('log-email').value;
        const password = document.getElementById('log-password').value;
        const submitBtn = loginForm.querySelector('button[type="submit"]');

        submitBtn.textContent = 'Logging In...';
        submitBtn.disabled = true;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                window.location.href = 'profile.html';
            })
            .catch((error) => {
                showAuthError(loginForm, "Invalid email or password. Please try again.");
                submitBtn.textContent = 'Log In';
                submitBtn.disabled = false;
            });
    });

    // Forgot Password Logic
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('log-email');
            const email = emailInput.value.trim();
            
            if (!email) {
                showAuthError(loginForm, "Please enter your email address above first to reset your password.");
                emailInput.focus();
                return;
            }

            forgotPasswordLink.textContent = "Sending link...";
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    // Reusing the error banner to show success message (green color hack)
                    const errBanner = loginForm.querySelector('.auth-error');
                    if(errBanner) errBanner.remove();
                    
                    const successBanner = document.createElement('div');
                    successBanner.className = 'auth-error';
                    successBanner.style.background = '#E8F5E9';
                    successBanner.style.color = '#2E7D32';
                    successBanner.style.border = '1px solid #C8E6C9';
                    successBanner.textContent = "Password reset email sent! Check your inbox.";
                    loginForm.insertBefore(successBanner, loginForm.firstChild);
                    
                    forgotPasswordLink.textContent = "Forgot password?";
                })
                .catch((error) => {
                    let msg = "Failed to send reset email.";
                    if (error.code === 'auth/user-not-found') msg = "No account found with this email.";
                    if (error.code === 'auth/invalid-email') msg = "Invalid email format.";
                    showAuthError(loginForm, msg);
                    forgotPasswordLink.textContent = "Forgot password?";
                });
        });
    }
}

// =========================================================
// LOGOUT LOGIC
// =========================================================
const logoutBtn = document.getElementById('btn-logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
            window.location.href = 'login.html';
        }).catch((error) => {
            alert("Error logging out.");
        });
    });
}

// =========================================================
// PASSWORD VISIBILITY TOGGLE
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                `;
            } else {
                input.type = 'password';
                this.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 20px; height: 20px;">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            }
        });
    });
});

// =========================================================
// DASHBOARD DYNAMIC VIEWS & CRUD
// =========================================================

function setupProfileTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const views = document.querySelectorAll('.profile-view');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active from all links and views
            tabLinks.forEach(l => l.classList.remove('active'));
            views.forEach(v => v.classList.remove('active'));
            
            // Add active to clicked link and corresponding view
            link.classList.add('active');
            const targetId = link.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if(targetView) targetView.classList.add('active');
        });
    });
}

function setupForms(uid) {
    // Address Form Toggles
    const btnShowAddr = document.getElementById('btn-show-address-form');
    const addrFormContainer = document.getElementById('address-form-container');
    const btnCancelAddr = document.getElementById('btn-cancel-address');
    const addrForm = document.getElementById('add-address-form');

    if(btnShowAddr) {
        btnShowAddr.addEventListener('click', () => {
            addrFormContainer.classList.add('active');
            btnShowAddr.style.display = 'none';
        });
    }

    if(addrForm) {
        // Prevent multiple listeners if setupForms runs again
        const newForm = addrForm.cloneNode(true);
        addrForm.parentNode.replaceChild(newForm, addrForm);
        
        const newCancelBtn = newForm.querySelector('#btn-cancel-address');
        if (newCancelBtn) {
            newCancelBtn.addEventListener('click', () => {
                addrFormContainer.classList.remove('active');
                btnShowAddr.style.display = 'block';
                newForm.reset();
            });
        }

        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const label = document.getElementById('addr-label').value.trim();
            const street = document.getElementById('addr-street').value.trim();
            const phone = document.getElementById('addr-phone').value.trim();
            const city = document.getElementById('addr-city').value.trim();
            const pin = document.getElementById('addr-pin').value.trim();

            const submitBtn = newForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Saving...";
            submitBtn.disabled = true;

            try {
                await addDoc(collection(db, "users", uid, "addresses"), {
                    label, street, phone, city, pin,
                    createdAt: serverTimestamp()
                });
                newForm.reset();
                document.getElementById('address-form-container').classList.remove('active');
                document.getElementById('btn-show-address-form').style.display = 'block';
                fetchAddresses(uid); // Refresh list
            } catch(err) {
                console.error("Error adding address:", err);
                alert("Failed to save address.");
            } finally {
                submitBtn.textContent = "Save Address";
                submitBtn.disabled = false;
            }
        });
    }

    // Payment Form Toggles
    const btnShowPay = document.getElementById('btn-show-payment-form');
    const payFormContainer = document.getElementById('payment-form-container');
    const btnCancelPay = document.getElementById('btn-cancel-payment');
    const payForm = document.getElementById('add-payment-form');

    if(btnShowPay) {
        btnShowPay.addEventListener('click', () => {
            payFormContainer.classList.add('active');
            btnShowPay.style.display = 'none';
        });
    }

    if(payForm) {
        const newPayForm = payForm.cloneNode(true);
        payForm.parentNode.replaceChild(newPayForm, payForm);

        const newCancelBtnPay = newPayForm.querySelector('#btn-cancel-payment');
        if (newCancelBtnPay) {
            newCancelBtnPay.addEventListener('click', () => {
                payFormContainer.classList.remove('active');
                btnShowPay.style.display = 'block';
                newPayForm.reset();
            });
        }

        newPayForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const upiId = document.getElementById('pay-upi').value.trim();

            const submitBtn = newPayForm.querySelector('button[type="submit"]');
            submitBtn.textContent = "Saving...";
            submitBtn.disabled = true;

            try {
                await addDoc(collection(db, "users", uid, "paymentMethods"), {
                    type: "UPI",
                    upiId: upiId,
                    createdAt: serverTimestamp()
                });
                newPayForm.reset();
                document.getElementById('payment-form-container').classList.remove('active');
                document.getElementById('btn-show-payment-form').style.display = 'block';
                fetchPayments(uid); // Refresh list
            } catch(err) {
                console.error("Error adding payment method:", err);
                alert("Failed to save payment method.");
            } finally {
                submitBtn.textContent = "Save Method";
                submitBtn.disabled = false;
            }
        });
    }
}

async function fetchAddresses(uid) {
    const container = document.getElementById('addresses-container');
    if(!container) return;

    try {
        const q = query(collection(db, "users", uid, "addresses"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if(snapshot.empty) {
            container.innerHTML = '<div class="empty-orders">No addresses saved yet.</div>';
            return;
        }

        let html = '';
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            html += `
                <div class="data-card-modern">
                    <div class="data-info">
                        <h4>${data.label}</h4>
                        <p>${data.street}<br>${data.city} - ${data.pin}<br><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                    </div>
                    <button class="btn-delete-data" onclick="window.deleteUserDoc('${uid}', 'addresses', '${docSnap.id}')">Remove</button>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (err) {
        console.error("Error fetching addresses:", err);
        container.innerHTML = '<div class="empty-orders" style="color:red;">Error loading addresses. Database rules might prevent access.</div>';
    }
}

async function fetchPayments(uid) {
    const container = document.getElementById('payments-container');
    if(!container) return;

    try {
        const q = query(collection(db, "users", uid, "paymentMethods"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        if(snapshot.empty) {
            container.innerHTML = '<div class="empty-orders">No payment methods saved yet.</div>';
            return;
        }

        let html = '';
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            html += `
                <div class="data-card-modern">
                    <div class="data-info">
                        <h4>${data.type}</h4>
                        <p>${data.upiId}</p>
                    </div>
                    <button class="btn-delete-data" onclick="window.deleteUserDoc('${uid}', 'paymentMethods', '${docSnap.id}')">Remove</button>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (err) {
        console.error("Error fetching payments:", err);
        container.innerHTML = '<div class="empty-orders" style="color:red;">Error loading payments. Database rules might prevent access.</div>';
    }
}

// Global delete function for inline onclick handlers
window.deleteUserDoc = async function(uid, subcollection, docId) {
    if(!confirm("Are you sure you want to remove this?")) return;
    
    try {
        await deleteDoc(doc(db, "users", uid, subcollection, docId));
        if (subcollection === 'addresses') {
            fetchAddresses(uid);
        } else {
            fetchPayments(uid);
        }
    } catch(err) {
        console.error("Error deleting document:", err);
        alert("Failed to delete.");
    }
}
