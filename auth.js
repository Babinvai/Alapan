// =========================================================
// AUTHENTICATION & PROFILE LOGIC
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- REGISTER LOGIC ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // If already logged in, go to profile
        if (localStorage.getItem('ghoshDharaUser')) {
            window.location.href = 'profile.html';
            return;
        }

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            if (!name || !email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            // Simulate saving user
            const user = { name, email, password };
            localStorage.setItem('ghoshDharaUser', JSON.stringify(user));
            
            // Redirect to dashboard
            window.location.href = 'profile.html';
        });
    }

    // --- LOGIN LOGIC ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // If already logged in, go to profile
        if (localStorage.getItem('ghoshDharaUser')) {
            window.location.href = 'profile.html';
            return;
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('log-email').value;
            const password = document.getElementById('log-password').value;

            if (!email || !password) {
                alert("Please enter email and password.");
                return;
            }

            const storedUserStr = localStorage.getItem('ghoshDharaUser');
            if (storedUserStr) {
                const storedUser = JSON.parse(storedUserStr);
                if (storedUser.email === email && storedUser.password === password) {
                    // Success
                    window.location.href = 'profile.html';
                } else {
                    alert("Incorrect email or password.");
                }
            } else {
                alert("No account found with this email. Please register.");
            }
        });
    }

    // --- PROFILE DASHBOARD LOGIC ---
    const profilePage = document.getElementById('profile-dashboard');
    if (profilePage) {
        const storedUserStr = localStorage.getItem('ghoshDharaUser');
        
        // If NOT logged in, redirect to login
        if (!storedUserStr) {
            window.location.href = 'login.html';
            return;
        }

        const user = JSON.parse(storedUserStr);

        // Populate Dashboard Data
        const greetingName = document.getElementById('profile-greeting-name');
        if (greetingName) greetingName.textContent = user.name.split(' ')[0]; // First name

        const infoName = document.getElementById('info-name');
        if (infoName) infoName.textContent = user.name;

        const infoEmail = document.getElementById('info-email');
        if (infoEmail) infoEmail.textContent = user.email;

        // Logout Button
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('ghoshDharaUser');
                window.location.href = 'login.html';
            });
        }
    }
});
