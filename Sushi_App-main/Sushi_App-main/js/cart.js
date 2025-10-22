// Cart Page JavaScript

// Product data (same as in main script)
const products = {
    1: { id: 1, name: "Sushi Set A", description: "Bộ sushi truyền thống với 8 miếng", price: 299000, image: "images/sushi-1.jpg" },
    2: { id: 2, name: "Sashimi Premium", description: "Cá hồi tươi ngon nhập khẩu", price: 399000, image: "images/sushi-2.jpg" },
    3: { id: 3, name: "Maki Roll", description: "Cuộn sushi với tôm và bơ", price: 199000, image: "images/sushi-3.jpg" },
    4: { id: 4, name: "Dragon Roll", description: "Cuộn rồng với tôm tempura", price: 349000, image: "images/sushi-4.jpg" },
    5: { id: 5, name: "Nigiri Sushi", description: "Sushi cá hồi tươi ngon", price: 249000, image: "images/sushi-5.jpg" },
    6: { id: 6, name: "Chirashi Bowl", description: "Cơm sushi với nhiều loại cá", price: 199000, image: "images/sushi-6.jpg" },
    7: { id: 7, name: "Tuna Sashimi", description: "Cá ngừ tươi cắt lát", price: 349000, image: "images/sushi-7.jpg" },
    8: { id: 8, name: "Mixed Sashimi", description: "Đĩa sashimi hỗn hợp", price: 449000, image: "images/sushi-8.jpg" },
    9: { id: 9, name: "California Roll", description: "Cuộn California với cua và bơ", price: 179000, image: "images/sushi-9.jpg" },
    10: { id: 10, name: "Spicy Tuna Roll", description: "Cuộn cá ngừ cay", price: 219000, image: "images/sushi-10.jpg" },
    11: { id: 11, name: "Rainbow Roll", description: "Cuộn cầu vồng với nhiều loại cá", price: 379000, image: "images/sushi-11.jpg" },
    12: { id: 12, name: "Volcano Roll", description: "Cuộn núi lửa với sốt cay", price: 329000, image: "images/sushi-12.jpg" }
};

// Mobile menu functions (needed for header)
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// Local (non-conflicting) state for this page
let cartState = JSON.parse(localStorage.getItem('cart')) || [];
let currentUserState = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
    initializeCartPage();
});

// Listen for storage changes to sync cart across tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'cart') {
        refreshCartFromStorage();
    }
});

// Also refresh when page becomes visible (user switches back to cart tab)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        refreshCartFromStorage();
    }
});

function initializeCartPage() {
    console.log('Initializing cart page...');
    
    // Setup mobile menu first
    setupMobileMenu();
    
    // Load cart data first
    cartState = JSON.parse(localStorage.getItem('cart')) || [];
    currentUserState = JSON.parse(localStorage.getItem('currentUser')) || null;
    
    console.log('Cart data loaded:', cartState);
    
    // Initialize all components
    loadCartItems();
    setupEventListeners();
    updateCartSummary();
    updateCartDisplay();
    checkUserLogin();
}

// Add function to refresh cart from localStorage
function refreshCartFromStorage() {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Refreshing cart from storage:', storedCart);
    cartState = storedCart;
    loadCartItems();
    updateCartSummary();
    updateCartDisplay();
}

// Force refresh cart on page load
function forceRefreshCart() {
    console.log('Force refreshing cart...');
    cartState = JSON.parse(localStorage.getItem('cart')) || [];
    loadCartItems();
    updateCartSummary();
    updateCartDisplay();
}

// Load cart items
function loadCartItems() {
    const cartList = document.getElementById('cartList');
    const cartEmpty = document.getElementById('cartEmpty');
    
    // Force reload from localStorage
    cartState = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Loading cart items:', cartState);
    
    if (!cartList || !cartEmpty) {
        console.error('Cart elements not found!');
        return;
    }
    
    if (cartState.length === 0) {
        cartList.style.display = 'none';
        cartEmpty.style.display = 'block';
        return;
    }
    
    cartList.style.display = 'block';
    cartEmpty.style.display = 'none';
    
    cartList.innerHTML = cartState.map(item => {
        const product = products[item.id];
        if (!product) {
            console.warn('Product not found for ID:', item.id);
            return '';
        }
        
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPkltYWdlPC90ZXh0Pjwvc3ZnPg=='">
                </div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>${product.description}</p>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" onchange="updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item-btn" onclick="removeItem(${item.id})">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clearCart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', showCheckoutModal);
    }
    
    // Checkout form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    // Modal close buttons
    const modalClose = document.querySelector('.modal-close');
    const cancelCheckout = document.getElementById('cancelCheckout');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (modalClose) {
        modalClose.addEventListener('click', hideCheckoutModal);
    }
    
    if (cancelCheckout) {
        cancelCheckout.addEventListener('click', hideCheckoutModal);
    }
    
    if (checkoutModal) {
        checkoutModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideCheckoutModal();
            }
        });
    }
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }
    
    const item = cartState.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        loadCartItems();
        updateCartSummary();
        updateCartDisplay();
    }
}

// Remove item
function removeItem(productId) {
    cartState = cartState.filter(item => item.id !== productId);
    saveCart();
    loadCartItems();
    updateCartSummary();
    updateCartDisplay();
    showToast('Sản phẩm đã được xóa khỏi giỏ hàng!', 'success');
}

// Clear cart
function clearCart() {
    if (cartState.length === 0) return;
    
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
        cartState = [];
        saveCart();
        loadCartItems();
        updateCartSummary();
        updateCartDisplay();
        showToast('Giỏ hàng đã được xóa!', 'success');
    }
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 30000;
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shipping').textContent = formatPrice(shipping);
    document.getElementById('tax').textContent = formatPrice(tax);
    document.getElementById('total').textContent = formatPrice(total);
    
    // Disable checkout if cart is empty
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cartState.length === 0;
        checkoutBtn.style.opacity = cartState.length === 0 ? '0.5' : '1';
    }
}

// Update cart display in header
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cartState.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartState));
}

// Show checkout modal
function showCheckoutModal() {
    if (cartState.length === 0) {
        showToast('Giỏ hàng trống!', 'warning');
        return;
    }
    
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Pre-fill form if user is logged in
        if (currentUserState) {
            document.getElementById('customerName').value = currentUserState.name || '';
            document.getElementById('customerPhone').value = currentUserState.phone || '';
            document.getElementById('customerEmail').value = currentUserState.email || '';
        }
    }
}

// Hide checkout modal
function hideCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Handle checkout form submission
function handleCheckout(e) {
    e.preventDefault();
    
    if (!validateCheckoutForm()) {
        return;
    }
    
    const formData = new FormData(e.target);
    const orderData = {
        customerName: formData.get('customerName'),
        customerPhone: formData.get('customerPhone'),
        customerEmail: formData.get('customerEmail'),
        deliveryAddress: formData.get('deliveryAddress'),
        deliveryTime: formData.get('deliveryTime'),
        notes: formData.get('notes'),
        paymentMethod: document.querySelector('input[name="payment"]:checked').value
    };
    
    // Create order
    const order = createOrder(orderData);
    if (order) {
        hideCheckoutModal();
        showOrderConfirmation(order);
    }
}

// Validate checkout form
function validateCheckoutForm() {
    const requiredFields = ['customerName', 'customerPhone', 'deliveryAddress'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (!field.value.trim()) {
            showFieldError(field, 'Trường này là bắt buộc');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate phone number
    const phoneField = document.getElementById('customerPhone');
    const phoneRegex = /^[0-9]{10,11}$/;
    if (phoneField.value && !phoneRegex.test(phoneField.value)) {
        showFieldError(phoneField, 'Số điện thoại không hợp lệ');
        isValid = false;
    }
    
    // Validate email
    const emailField = document.getElementById('customerEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailField.value && !emailRegex.test(emailField.value)) {
        showFieldError(emailField, 'Email không hợp lệ');
        isValid = false;
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    field.parentNode.appendChild(error);
    field.classList.add('error');
}

// Clear field error
function clearFieldError(field) {
    const error = field.parentNode.querySelector('.field-error');
    if (error) {
        error.remove();
    }
    field.classList.remove('error');
}

// Create order
function createOrder(orderData) {
    const order = {
        id: Date.now(),
        userId: currentUserState ? currentUserState.id : null,
        items: [...cartState],
        customerInfo: orderData,
        subtotal: cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping: 30000,
        tax: Math.round(cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1),
        total: cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 30000 + Math.round(cartState.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.1),
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cartState = [];
    saveCart();
    loadCartItems();
    updateCartSummary();
    updateCartDisplay();
    
    return order;
}

// Show order confirmation
function showOrderConfirmation(order) {
    const modal = document.createElement('div');
    modal.className = 'checkout-modal show';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle" style="color: #27ae60;"></i> Đặt Hàng Thành Công!</h3>
                </div>
                <div class="modal-body">
                    <div class="order-confirmation">
                        <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
                        <p><strong>Khách hàng:</strong> ${order.customerInfo.customerName}</p>
                        <p><strong>Số điện thoại:</strong> ${order.customerInfo.customerPhone}</p>
                        <p><strong>Địa chỉ giao hàng:</strong> ${order.customerInfo.deliveryAddress}</p>
                        <p><strong>Tổng tiền:</strong> ${formatPrice(order.total)}</p>
                        <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodName(order.customerInfo.paymentMethod)}</p>
                        <div class="confirmation-actions">
                            <button class="btn btn-primary" onclick="window.location.href='history.html'">Xem Lịch Sử</button>
                            <button class="btn btn-secondary" onclick="window.location.href='menu.html'">Tiếp Tục Mua Sắm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Auto close after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
            window.location.href = 'history.html';
        }
    }, 10000);
}

// Get payment method name
function getPaymentMethodName(method) {
    const methods = {
        'cod': 'Thanh toán khi nhận hàng',
        'bank': 'Chuyển khoản ngân hàng',
        'momo': 'Ví điện tử MoMo'
    };
    return methods[method] || method;
}

// Check user login status
function checkUserLogin() {
    if (currentUserState) {
        updateUserInterface();
    }
}

// Update user interface
function updateUserInterface() {
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    
    if (currentUserState && loginBtn && registerBtn) {
        loginBtn.textContent = currentUserState.name;
        loginBtn.href = 'profile.html';
        registerBtn.textContent = 'Đăng Xuất';
        registerBtn.href = '#';
        registerBtn.addEventListener('click', logout);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    currentUserState = null;
    location.reload();
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Show toast notification
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

// Expose functions to global scope for inline handlers and cross-file usage
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.clearCart = clearCart;
window.showCheckoutModal = showCheckoutModal;
window.hideCheckoutModal = hideCheckoutModal;
window.handleCheckout = handleCheckout;
window.formatPrice = formatPrice;
