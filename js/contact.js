// Contact Page JavaScript

// Initialize contact page
document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    setupContactForm();
    setupFAQ();
    updateCartDisplay();
    checkUserLogin();
}

// Setup contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
        
        // Setup form validation
        const inputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    const formData = new FormData(e.target);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    showLoading(e.target.querySelector('.submit-btn'));
    
    // Simulate API call
    setTimeout(() => {
        // Save contact message to localStorage
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(contactData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        showSuccess('Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại sớm nhất.');
        
        // Reset form
        e.target.reset();
        
        hideLoading(e.target.querySelector('.submit-btn'));
    }, 1000);
}

// Validate form
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (!value) {
        showFieldError(field, 'Trường này là bắt buộc');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Email không hợp lệ');
            return false;
        }
    }
    
    // Phone validation
    if (fieldName === 'phone') {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Số điện thoại không hợp lệ (10-11 số)');
            return false;
        }
    }
    
    // Name validation
    if (fieldName === 'firstName' || fieldName === 'lastName') {
        if (value.length < 2) {
            showFieldError(field, 'Tên phải có ít nhất 2 ký tự');
            return false;
        }
    }
    
    // Message validation
    if (fieldName === 'message') {
        if (value.length < 10) {
            showFieldError(field, 'Tin nhắn phải có ít nhất 10 ký tự');
            return false;
        }
    }
    
    return true;
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

// Show loading state
function showLoading(button) {
    button.classList.add('loading');
    button.disabled = true;
}

// Hide loading state
function hideLoading(button) {
    button.classList.remove('loading');
    button.disabled = false;
}

// Show success message
function showSuccess(message) {
    showMessage(message, 'success');
}

// Show error message
function showError(message) {
    showMessage(message, 'error');
}

// Show message
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;
    
    const form = document.querySelector('.contact-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Setup FAQ
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
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
