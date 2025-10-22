// Menu Page JavaScript

// Extended product data for menu page
const extendedProducts = {
    ...window.SushiApp.products,
    5: {
        id: 5,
        name: "Nigiri Sushi",
        description: "Sushi cá hồi tươi ngon",
        price: 249000,
        image: "images/sushi-5.jpg",
        category: "sushi"
    },
    6: {
        id: 6,
        name: "Chirashi Bowl",
        description: "Cơm sushi với nhiều loại cá",
        price: 199000,
        image: "images/sushi-6.jpg",
        category: "sushi"
    },
    7: {
        id: 7,
        name: "Tuna Sashimi",
        description: "Cá ngừ tươi cắt lát",
        price: 349000,
        image: "images/sushi-7.jpg",
        category: "sashimi"
    },
    8: {
        id: 8,
        name: "Mixed Sashimi",
        description: "Đĩa sashimi hỗn hợp",
        price: 449000,
        image: "images/sushi-8.jpg",
        category: "sashimi"
    },
    9: {
        id: 9,
        name: "California Roll",
        description: "Cuộn California với cua và bơ",
        price: 179000,
        image: "images/sushi-9.jpg",
        category: "maki"
    },
    10: {
        id: 10,
        name: "Spicy Tuna Roll",
        description: "Cuộn cá ngừ cay",
        price: 219000,
        image: "images/sushi-10.jpg",
        category: "maki"
    },
    11: {
        id: 11,
        name: "Rainbow Roll",
        description: "Cuộn cầu vồng với nhiều loại cá",
        price: 379000,
        image: "images/sushi-11.jpg",
        category: "roll"
    },
    12: {
        id: 12,
        name: "Volcano Roll",
        description: "Cuộn núi lửa với sốt cay",
        price: 329000,
        image: "images/sushi-12.jpg",
        category: "roll"
    }
};

// Update original products with categories
Object.keys(extendedProducts).forEach(id => {
    if (!extendedProducts[id].category) {
        if (id <= 2) extendedProducts[id].category = "sashimi";
        else if (id <= 4) extendedProducts[id].category = "roll";
        else extendedProducts[id].category = "sushi";
    }
});

// Menu functionality
document.addEventListener('DOMContentLoaded', function() {
    setupMenuFilters();
    setupMenuSearch();
    setupMenuItems();
});

// Setup filter buttons
function setupMenuFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuCategories = document.querySelectorAll('.menu-category');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter categories
            menuCategories.forEach(category => {
                if (filter === 'all' || category.dataset.category === filter) {
                    category.style.display = 'block';
                    category.classList.remove('hidden');
                } else {
                    category.style.display = 'none';
                    category.classList.add('hidden');
                }
            });
        });
    });
}

// Setup search functionality
function setupMenuSearch() {
    const searchInput = document.getElementById('menu-search');
    const menuItems = document.querySelectorAll('.menu-item');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            menuItems.forEach(item => {
                const title = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                
                if (query === '' || title.includes(query) || description.includes(query)) {
                    item.style.display = 'block';
                    item.classList.remove('hidden');
                } else {
                    item.style.display = 'none';
                    item.classList.add('hidden');
                }
            });
            
            // Hide empty categories
            document.querySelectorAll('.menu-category').forEach(category => {
                const visibleItems = category.querySelectorAll('.menu-item:not(.hidden)');
                if (visibleItems.length === 0 && query !== '') {
                    category.style.display = 'none';
                } else {
                    category.style.display = 'block';
                }
            });
        });
    }
}

// Setup menu items
function setupMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        // Add click event for product details
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(this.dataset.product);
                showProductModal(productId);
            }
        });
        
        // Add to cart functionality
        const addToCartBtn = item.querySelector('.add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const productId = parseInt(this.dataset.id);
                addToCart(productId);
            });
        }
    });
}

// Add to cart function
function addToCart(productId) {
    const product = extendedProducts[productId];
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
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

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showToast(`${product.name} đã được thêm vào giỏ hàng!`, 'success');
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

// Show product modal
function showProductModal(productId) {
    const product = extendedProducts[productId];
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

// Initialize cart display on page load
updateCartDisplay();
