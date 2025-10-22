// Authentication JavaScript

// Global variables
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Initialize authentication
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    setupFormValidation();
    setupPasswordStrength();
    setupEventListeners();
    checkExistingLogin();
}

// Setup form validation
function setupFormValidation() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
                if (this.type === 'password') {
                    updatePasswordStrength();
                }
            });
        });
    });
}

// Setup password strength indicator
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
}

// Update password strength
function updatePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!passwordInput || !strengthFill || !strengthText) return;
    
    const password = passwordInput.value;
    const strength = calculatePasswordStrength(password);
    
    strengthFill.className = 'strength-fill';
    strengthFill.classList.add(strength.level);
    strengthText.textContent = strength.text;
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 1;
    else feedback.push('Ít nhất 8 ký tự');
    
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Có chữ thường');
    
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Có chữ hoa');
    
    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('Có số');
    
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('Có ký tự đặc biệt');
    
    if (score <= 2) {
        return { level: 'weak', text: 'Mật khẩu yếu' };
    } else if (score <= 3) {
        return { level: 'fair', text: 'Mật khẩu trung bình' };
    } else if (score <= 4) {
        return { level: 'good', text: 'Mật khẩu tốt' };
    } else {
        return { level: 'strong', text: 'Mật khẩu mạnh' };
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.btn-social');
    socialButtons.forEach(button => {
        button.addEventListener('click', handleSocialLogin);
    });
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const rememberMe = formData.get('rememberMe');
    
    showLoading(e.target.querySelector('.auth-btn'));
    
    // Simulate API call
    setTimeout(() => {
        const user = authenticateUser(email, password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            }
            
            showSuccess('Đăng nhập thành công!');
            
            setTimeout(() => {
                const returnUrl = getUrlParameter('return') || 'index.html';
                window.location.href = returnUrl;
            }, 1500);
        } else {
            showError('Email/số điện thoại hoặc mật khẩu không đúng!');
        }
        
        hideLoading(e.target.querySelector('.auth-btn'));
    }, 1000);
}

// Handle register form submission
function handleRegister(e) {
    e.preventDefault();
    
    if (!validateForm(e.target)) {
        return;
    }
    
    const formData = new FormData(e.target);
    const userData = {
        id: Date.now(),
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        address: formData.get('address') || '',
        createdAt: new Date().toISOString()
    };
    
    showLoading(e.target.querySelector('.auth-btn'));
    
    // Simulate API call
    setTimeout(() => {
        if (isEmailExists(userData.email)) {
            showError('Email này đã được sử dụng!');
            hideLoading(e.target.querySelector('.auth-btn'));
            return;
        }
        
        if (isPhoneExists(userData.phone)) {
            showError('Số điện thoại này đã được sử dụng!');
            hideLoading(e.target.querySelector('.auth-btn'));
            return;
        }
        
        // Add user to database
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto login after registration
        currentUser = userData;
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        showSuccess('Đăng ký thành công! Đang chuyển hướng...');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
        
        hideLoading(e.target.querySelector('.auth-btn'));
    }, 1000);
}

// Handle social login
function handleSocialLogin(e) {
    const provider = e.target.closest('.btn-social').classList.contains('btn-google') ? 'google' : 'facebook';
    
    showToast(`Đăng nhập với ${provider} đang được phát triển!`, 'info');
}

// Authenticate user
function authenticateUser(email, password) {
    return users.find(user => 
        (user.email === email || user.phone === email) && 
        user.password === password
    );
}

// Check if email exists
function isEmailExists(email) {
    return users.some(user => user.email === email);
}

// Check if phone exists
function isPhoneExists(phone) {
    return users.some(user => user.phone === phone);
}

// Validate form
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Special validation for register form
    if (form.id === 'registerForm') {
        const password = form.querySelector('#password').value;
        const confirmPassword = form.querySelector('#confirmPassword').value;
        
        if (password !== confirmPassword) {
            showFieldError(form.querySelector('#confirmPassword'), 'Mật khẩu xác nhận không khớp!');
            isValid = false;
        }
        
        const agreeTerms = form.querySelector('#agreeTerms');
        if (!agreeTerms.checked) {
            showError('Vui lòng đồng ý với điều khoản sử dụng!');
            isValid = false;
        }
    }
    
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
    if (fieldName === 'email' && field.type === 'email') {
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
    
    // Password validation
    if (fieldName === 'password') {
        if (value.length < 6) {
            showFieldError(field, 'Mật khẩu phải có ít nhất 6 ký tự');
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
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const error = document.createElement('div');
    error.className = 'field-error';
    error.textContent = message;
    
    field.parentNode.parentNode.appendChild(error);
    field.classList.add('error');
}

// Clear field error
function clearFieldError(field) {
    const error = field.parentNode.parentNode.querySelector('.field-error');
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
    
    const form = document.querySelector('.auth-form');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Show toast notification
function showToast(message, type = 'info') {
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

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.parentNode.querySelector('.toggle-password');
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Check existing login
function checkExistingLogin() {
    if (currentUser) {
        // User is already logged in, redirect to home
        window.location.href = 'index.html';
    }
}

// Get URL parameter
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
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

// Initialize cart display
updateCartDisplay();
