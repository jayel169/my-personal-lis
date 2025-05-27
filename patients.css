// Sample user database (in a real application, this would be on the server)
const users = {
    'receptionist1': {
        password: '111',
        role: 'receptionist',
        name: 'John Doe'
    },
    'lab1': {
        password: 'lab123',
        role: 'lab_scientist',
        name: 'Jane Smith'
    },
    'admin1': {
        password: 'admin123',
        role: 'admin',
        name: 'Admin User'
    }
};

// Check if user is already logged in
if (sessionStorage.getItem('currentUser')) {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (user.role === 'receptionist') {
        window.location.href = 'home.html';
    } else if (user.role === 'lab_scientist') {
        window.location.href = 'lab_dashboard.html';
    } else if (user.role === 'admin') {
        window.location.href = 'admin_dashboard.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const errorMessage = document.getElementById('errorMessage');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            const role = roleSelect.value;
            
            if (!username || !password || !role) {
                showError('Please fill in all fields.');
                return;
            }
            
            // Check if user exists
            const user = users[username];
            
            if (!user) {
                showError('Invalid username.');
                return;
            }
            
            // Check password and role
            if (user.password !== password) {
                showError('Invalid password.');
                return;
            }
            
            if (user.role !== role) {
                showError('Invalid role for this user.');
                return;
            }
            
            // Store user info in session storage
            sessionStorage.setItem('currentUser', JSON.stringify({
                username: username,
                role: role,
                name: user.name
            }));
            
            // Redirect based on role
            if (role === 'receptionist') {
                window.location.href = 'home.html';
            } else if (role === 'lab_scientist') {
                window.location.href = 'lab_dashboard.html';
            } else if (role === 'admin') {
                window.location.href = 'admin_dashboard.html';
            }
        });
    }

    // Hide error message when user starts typing
    if (usernameInput) {
        usernameInput.addEventListener('input', hideError);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', hideError);
    }
    
    if (roleSelect) {
        roleSelect.addEventListener('change', hideError);
    }

    // Forgot password link
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Please contact the system administrator to reset your password.');
        });
    }
});

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
}

function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}
