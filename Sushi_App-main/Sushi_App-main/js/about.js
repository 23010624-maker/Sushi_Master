// About Page JavaScript

// Initialize about page
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

function initializeAboutPage() {
    setupAnimations();
    updateCartDisplay();
    checkUserLogin();
}

// Setup animations
function setupAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.value-card, .team-member, .award-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Check user login
function checkUserLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    if (currentUser) {
        updateUserInterface();
    }
}

// Update user interface
function updateUserInterface() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (loginBtn && registerBtn) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        if (currentUser) {
            loginBtn.textContent = currentUser.name;
            loginBtn.href = 'profile.html';
            registerBtn.textContent = 'Đăng Xuất';
            registerBtn.href = '#';
            registerBtn.addEventListener('click', logout);
        }
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    location.reload();
}
