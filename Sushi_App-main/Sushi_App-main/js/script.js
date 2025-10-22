// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Product Data
const products = {
    1: {
        id: 1,
        name: "Sushi Set A",
        description: "Bộ sushi truyền thống với 8 miếng",
        price: 299000,
        image: "images/sushi-1.jpg"
    },
    2: {
        id: 2,
        name: "Sashimi Premium",
        description: "Cá hồi tươi ngon nhập khẩu",
        price: 399000,
        image: "images/sushi-2.jpg"
    },
    3: {
        id: 3,
        name: "Maki Roll",
        description: "Cuộn sushi với tôm và bơ",
        price: 199000,
        image: "images/sushi-3.jpg"
    },
    4: {
        id: 4,
        name: "Dragon Roll",
        description: "Cuộn rồng với tôm tempura",
        price: 349000,
        image: "images/sushi-4.jpg"
    }
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupMobileMenu();
    setupCart();
    setupAnimations();
    setupProductCards();
    updateCartDisplay();
    checkUserLogin();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Cart Functions
function setupCart() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
    
    // Also handle buttons added dynamically
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            e.stopPropagation();
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(button.dataset.id);
            if (productId) {
                addToCart(productId);
            }
        }
    });
}

function addToCart(productId) {
    const product = products[productId];
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    showToast(`${product.name} đã được thêm vào giỏ hàng!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showToast('Sản phẩm đã được xóa khỏi giỏ hàng!', 'success');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCart();
            updateCartDisplay();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Animation Setup
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
    document.querySelectorAll('.product-card, .about-text, .about-image').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Product Cards Setup
function setupProductCards() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = parseInt(this.dataset.product);
            if (productId) {
                // Navigate to product detail page or show modal
                showProductModal(productId);
            }
        });
    });
}

// Product Modal
function showProductModal(productId) {
    const product = products[productId];
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-body">
                    <div class="modal-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="modal-info">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <div class="modal-price">${formatPrice(product.price)}</div>
                        <div class="modal-actions">
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                                Thêm Vào Giỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Event listeners
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    modal.querySelector('.add-to-cart').addEventListener('click', function() {
        addToCart(productId);
        closeModal();
    });

    function closeModal() {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto';
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Utility Functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// User Authentication
function checkUserLogin() {
    if (currentUser) {
        updateUserInterface();
    }
}

function updateUserInterface() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (currentUser && loginBtn && registerBtn) {
        loginBtn.textContent = currentUser.name;
        loginBtn.href = 'profile.html';
        registerBtn.textContent = 'Đăng Xuất';
        registerBtn.href = '#';
        registerBtn.addEventListener('click', logout);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    location.reload();
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showFieldError(input, 'Trường này là bắt buộc');
            isValid = false;
        } else {
            clearFieldError(input);
        }
    });

    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    field.parentNode.appendChild(error);
    field.classList.add('error');
}

function clearFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
    field.classList.remove('error');
}

// Smooth Scrolling
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Search Functionality
function searchProducts(query) {
    const results = Object.values(products).filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    return results;
}

// Order Management
function createOrder() {
    if (cart.length === 0) {
        showToast('Giỏ hàng trống!', 'warning');
        return;
    }

    if (!currentUser) {
        showToast('Vui lòng đăng nhập để đặt hàng!', 'warning');
        return;
    }

    const order = {
        id: Date.now(),
        userId: currentUser.id,
        items: [...cart],
        total: getCartTotal(),
        status: 'pending',
        date: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();

    showToast('Đặt hàng thành công!', 'success');
    return order;
}

// Export functions for use in other pages
window.SushiApp = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    formatPrice,
    showToast,
    validateForm,
    smoothScroll,
    searchProducts,
    createOrder,
    products,
    cart,
    currentUser
};
