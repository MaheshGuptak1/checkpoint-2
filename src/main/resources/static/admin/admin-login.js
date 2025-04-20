document.addEventListener('DOMContentLoaded', function() {
    console.log("Admin login script loaded");
    
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    
    // Exit if we're not on the login page
    if (!adminLoginForm) {
        console.log("Admin login form not found");
        return;
    }
    
    console.log("Admin login form found");
    
    // Check if admin is already logged in
    const storedAdmin = localStorage.getItem('adminUser');
    if (storedAdmin) {
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Test input field functionality
    const usernameField = document.getElementById('username');
    const passwordField = document.getElementById('password');
    
    if (!usernameField || !passwordField) {
        console.error("Form fields not found properly: username=", usernameField, "password=", passwordField);
    }
    
    // Remove the script that prevents submission
    document.querySelectorAll('script').forEach(script => {
        if (script.textContent.includes('Prevent any form from auto-submitting')) {
            script.remove();
        }
    });
    
    // Admin login form submission
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log("Login form submitted");
        
        // Get values directly from the form elements
        const username = document.querySelector('#adminLoginForm #username').value;
        const password = document.querySelector('#adminLoginForm #password').value;
        
        console.log("Username:", username, "Password:", password);
        
        // Validate form
        if (!username || !password) {
            loginError.textContent = 'Please fill in all fields';
            return;
        }
        
        // Clear previous error
        loginError.textContent = '';
        
        // Admin login request - in a real app we'd call the backend
        // For demo purposes, let's just accept admin/admin123
        if (username === 'admin' && password === 'admin123') {
            // Successful login
            const adminUser = {
                id: 1,
                username: 'admin',
                email: 'admin@example.com'
            };
            
            localStorage.setItem('adminUser', JSON.stringify(adminUser));
            window.location.href = 'dashboard.html';
            return;
        }
        
        // For actual backend integration:
        fetch('/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.id) {
                // Successful login
                localStorage.setItem('adminUser', JSON.stringify(data));
                window.location.href = 'dashboard.html';
            } else {
                loginError.textContent = 'Invalid username or password';
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            loginError.textContent = 'Error during login. Please try again.';
        });
    });
    
    // Make sure inputs are focusable
    if (usernameField) {
        usernameField.addEventListener('click', function() {
            this.focus();
        });
    }
    
    if (passwordField) {
        passwordField.addEventListener('click', function() {
            this.focus();
        });
    }
}); 