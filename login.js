 // Sample user database (in a real application, this would be on the server)
 const users = {
    'receptionist1': {
        password: 'pass123',
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

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    // Reset error messages
    document.getElementById('usernameError').style.display = 'none';
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('roleError').style.display = 'none';
    
    // Validate inputs
    let isValid = true;
    
    if (!username) {
        document.getElementById('usernameError').textContent = 'Username is required';
        document.getElementById('usernameError').style.display = 'block';
        isValid = false;
    }
    
    if (!password) {
        document.getElementById('passwordError').textContent = 'Password is required';
        document.getElementById('passwordError').style.display = 'block';
        isValid = false;
    }
    
    if (!role) {
        document.getElementById('roleError').textContent = 'Please select your role';
        document.getElementById('roleError').style.display = 'block';
        isValid = false;
    }
    
    if (isValid) {
        // Check if user exists
        const user = users[username];
        
        if (!user) {
            document.getElementById('usernameError').textContent = 'Invalid username';
            document.getElementById('usernameError').style.display = 'block';
            return;
        }
        
        // Check password and role
        if (user.password !== password) {
            document.getElementById('passwordError').textContent = 'Invalid password';
            document.getElementById('passwordError').style.display = 'block';
            return;
        }
        
        if (user.role !== role) {
            document.getElementById('roleError').textContent = 'Invalid role for this user';
            document.getElementById('roleError').style.display = 'block';
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
    }
});

// Add input event listeners to hide error messages when user starts typing
document.getElementById('username').addEventListener('input', function() {
    document.getElementById('usernameError').style.display = 'none';
});

document.getElementById('password').addEventListener('input', function() {
    document.getElementById('passwordError').style.display = 'none';
});

document.getElementById('role').addEventListener('change', function() {
    document.getElementById('roleError').style.display = 'none';
});

document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Please contact your system administrator to reset your password.');
});