import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut,
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { 
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    addDoc,
    serverTimestamp
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
export { auth, db, collection, addDoc, serverTimestamp };

// =========================================================
// GLOBAL AUTHENTICATION STATE OBSERVER
// =========================================================
onAuthStateChanged(auth, (user) => {
    // 1. Global Header Updates
    const desktopProfileBtns = document.querySelectorAll('.header-account-btn');
    const mobileAccountSection = document.querySelector('.mobile-account-section');

    if (user) {
        // User is logged in
        desktopProfileBtns.forEach(btn => {
            btn.href = 'profile.html';
            btn.style.color = '#174B37';
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
            
            const infoName = document.getElementById('info-name');
            if (infoName) infoName.textContent = user.displayName || 'Not Provided';
            
            const infoEmail = document.getElementById('info-email');
            if (infoEmail) infoEmail.textContent = user.email;

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

                        let ordersHTML = '<div style="display: flex; flex-direction: column; gap: 15px;">';
                        orders.forEach((order) => {
                            const date = order.createdAt ? order.createdAt.toDate().toLocaleDateString() : 'Just now';
                            ordersHTML += `
                                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: left;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                                        <strong style="color: #174B37; font-size: 1.1rem;">${order.orderNumber || 'Order'}</strong>
                                        <span style="color: #888; font-size: 0.9rem;">${date}</span>
                                    </div>
                                    <div style="font-size: 0.9rem; color: #555; white-space: pre-wrap; line-height: 1.5; margin-bottom: 10px;">${order.itemsSummary || 'Items ordered'}</div>
                                    <div style="font-weight: bold; color: #D35400;">Total: ₹${(order.total || 0).toFixed(2)}</div>
                                </div>
                            `;
                        });
                        ordersHTML += '</div>';
                        ordersContainer.innerHTML = ordersHTML;
                    }
                }).catch(error => {
                    console.error("Error fetching orders: ", error);
                    ordersContainer.innerHTML = 'Error loading orders. You might need to create the Firestore database in the Firebase Console and configure index rules.';
                });
            }
        }

        // Redirect if they land on login/register pages
        const isAuthPage = document.getElementById('login-form') || document.getElementById('register-form');
        if (isAuthPage) {
            window.location.href = 'profile.html';
        }

    } else {
        // User is NOT logged in
        desktopProfileBtns.forEach(btn => {
            btn.href = 'login.html';
            btn.style.color = '';
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
                alert("Error creating account: " + error.message);
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
                alert("Invalid email or password.");
                submitBtn.textContent = 'Log In';
                submitBtn.disabled = false;
            });
    });
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
