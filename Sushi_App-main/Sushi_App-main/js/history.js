// History Page JavaScript

// Product data (same as in other files)
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

// Global variables
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let filteredOrders = [];

// Initialize history page
document.addEventListener('DOMContentLoaded', function() {
    initializeHistoryPage();
});

function initializeHistoryPage() {
    checkUserLogin();
    setupEventListeners();
    loadOrders();
    updateCartDisplay();
}

// Check user login
function checkUserLogin() {
    if (!currentUser) {
        showLoginRequired();
        return;
    }
    
    // Filter orders for current user
    orders = orders.filter(order => 
        order.userId === currentUser.id || 
        order.customerInfo?.customerPhone === currentUser.phone ||
        order.customerInfo?.customerEmail === currentUser.email
    );
    
    updateUserInterface();
}

// Show login required message
function showLoginRequired() {
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');
    
    ordersList.style.display = 'none';
    noOrders.style.display = 'block';
    
    noOrders.innerHTML = `
        <div class="no-orders-content">
            <i class="fas fa-lock"></i>
            <h3>Vui lòng đăng nhập</h3>
            <p>Bạn cần đăng nhập để xem lịch sử đơn hàng</p>
            <a href="login.html" class="btn btn-primary">Đăng Nhập</a>
        </div>
    `;
}

// Update user interface
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

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    location.reload();
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterOrders(filter);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Search input
    const searchInput = document.getElementById('orderSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchOrders(this.value);
        });
    }
    
    // Modal close
    const modalClose = document.querySelector('.modal-close');
    const orderModal = document.getElementById('orderModal');
    
    if (modalClose) {
        modalClose.addEventListener('click', hideOrderModal);
    }
    
    if (orderModal) {
        orderModal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideOrderModal();
            }
        });
    }
}

// Load orders
function loadOrders() {
    if (!currentUser) return;
    
    filteredOrders = [...orders];
    displayOrders();
}

// Filter orders
function filterOrders(filter) {
    if (filter === 'all') {
        filteredOrders = [...orders];
    } else {
        filteredOrders = orders.filter(order => order.status === filter);
    }
    
    displayOrders();
}

// Search orders
function searchOrders(query) {
    if (!query.trim()) {
        filteredOrders = [...orders];
    } else {
        filteredOrders = orders.filter(order => 
            order.id.toString().includes(query) ||
            order.customerInfo?.customerName?.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    displayOrders();
}

// Display orders
function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    const noOrders = document.getElementById('noOrders');
    
    if (filteredOrders.length === 0) {
        ordersList.style.display = 'none';
        noOrders.style.display = 'block';
        return;
    }
    
    ordersList.style.display = 'block';
    noOrders.style.display = 'none';
    
    // Sort orders by date (newest first)
    const sortedOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    ordersList.innerHTML = sortedOrders.map(order => {
        return createOrderCard(order);
    }).join('');
    
    // Add click events to order cards
    document.querySelectorAll('.order-card').forEach(card => {
        card.addEventListener('click', function() {
            const orderId = parseInt(this.dataset.orderId);
            showOrderDetail(orderId);
        });
    });
}

// Create order card
function createOrderCard(order) {
    const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
    const orderTime = new Date(order.createdAt).toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const itemsHtml = order.items.map(item => {
        const product = products[item.id];
        return `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p>Số lượng: ${item.quantity}</p>
                </div>
            </div>
        `;
    }).join('');
    
    const statusText = getStatusText(order.status);
    const statusClass = order.status;
    
    return `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-info">
                    <h3>Đơn hàng #${order.id}</h3>
                    <p>Ngày đặt: ${orderDate} lúc ${orderTime}</p>
                </div>
                <div class="order-status ${statusClass}">${statusText}</div>
            </div>
            
            <div class="order-details">
                <div class="order-items">
                    ${itemsHtml}
                </div>
                
                <div class="order-summary">
                    <h4>Tổng tiền</h4>
                    <p>${formatPrice(order.total)}</p>
                </div>
                
                <div class="order-actions">
                    <button class="order-action-btn primary" onclick="event.stopPropagation(); showOrderDetail(${order.id})">
                        <i class="fas fa-eye"></i> Xem Chi Tiết
                    </button>
                    ${getOrderActionButton(order)}
                </div>
            </div>
        </div>
    `;
}

// Get status text
function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ Xử Lý',
        'confirmed': 'Đã Xác Nhận',
        'preparing': 'Đang Chuẩn Bị',
        'delivering': 'Đang Giao',
        'delivered': 'Đã Giao',
        'cancelled': 'Đã Hủy'
    };
    return statusMap[status] || status;
}

// Get order action button
function getOrderActionButton(order) {
    switch (order.status) {
        case 'pending':
            return `
                <button class="order-action-btn" onclick="event.stopPropagation(); cancelOrder(${order.id})">
                    <i class="fas fa-times"></i> Hủy Đơn
                </button>
            `;
        case 'delivered':
            return `
                <button class="order-action-btn" onclick="event.stopPropagation(); reorder(${order.id})">
                    <i class="fas fa-redo"></i> Đặt Lại
                </button>
            `;
        default:
            return '';
    }
}

// Show order detail modal
function showOrderDetail(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const content = document.getElementById('orderDetailContent');
    
    const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');
    const orderTime = new Date(order.createdAt).toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    const itemsHtml = order.items.map(item => {
        const product = products[item.id];
        return `
            <div class="detail-item">
                <div class="detail-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="detail-item-info">
                    <h4>${item.name}</h4>
                    <p>${product.description}</p>
                    <div class="detail-item-price">${formatPrice(item.price)}</div>
                </div>
                <div class="detail-item-quantity">x${item.quantity}</div>
            </div>
        `;
    }).join('');
    
    const statusText = getStatusText(order.status);
    const statusClass = order.status;
    
    content.innerHTML = `
        <div class="order-detail-header">
            <div class="order-detail-info">
                <h2>Đơn hàng #${order.id}</h2>
                <p><strong>Ngày đặt:</strong> ${orderDate} lúc ${orderTime}</p>
                <p><strong>Khách hàng:</strong> ${order.customerInfo.customerName}</p>
                <p><strong>Số điện thoại:</strong> ${order.customerInfo.customerPhone}</p>
                <p><strong>Email:</strong> ${order.customerInfo.customerEmail || 'Không có'}</p>
                <p><strong>Địa chỉ giao hàng:</strong> ${order.customerInfo.deliveryAddress}</p>
                <p><strong>Thời gian giao:</strong> ${getDeliveryTimeText(order.customerInfo.deliveryTime)}</p>
                ${order.customerInfo.notes ? `<p><strong>Ghi chú:</strong> ${order.customerInfo.notes}</p>` : ''}
            </div>
            <div class="order-detail-status">
                <div class="order-status ${statusClass}">${statusText}</div>
            </div>
        </div>
        
        <div class="order-detail-items">
            <h3>Sản phẩm đã đặt</h3>
            ${itemsHtml}
        </div>
        
        <div class="order-detail-summary">
            <div class="summary-row">
                <span>Tạm tính:</span>
                <span>${formatPrice(order.subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Phí vận chuyển:</span>
                <span>${formatPrice(order.shipping)}</span>
            </div>
            <div class="summary-row">
                <span>Thuế (10%):</span>
                <span>${formatPrice(order.tax)}</span>
            </div>
            <div class="summary-row">
                <span>Tổng cộng:</span>
                <span>${formatPrice(order.total)}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Hide order modal
function hideOrderModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Get delivery time text
function getDeliveryTimeText(deliveryTime) {
    const timeMap = {
        'asap': 'Giao ngay (30-45 phút)',
        '1hour': 'Sau 1 giờ',
        '2hours': 'Sau 2 giờ',
        'tomorrow': 'Ngày mai'
    };
    return timeMap[deliveryTime] || deliveryTime;
}

// Cancel order
function cancelOrder(orderId) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        return;
    }
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'cancelled';
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Update filtered orders
        const filteredIndex = filteredOrders.findIndex(o => o.id === orderId);
        if (filteredIndex !== -1) {
            filteredOrders[filteredIndex].status = 'cancelled';
        }
        
        displayOrders();
        showToast('Đơn hàng đã được hủy!', 'success');
    }
}

// Reorder
function reorder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Add items to cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    order.items.forEach(item => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            });
        }
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    showToast('Sản phẩm đã được thêm vào giỏ hàng!', 'success');
    
    // Redirect to cart
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1500);
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
