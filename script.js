document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission
            
            const mobile = document.getElementById('mobile').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Clear previous alerts
            if (document.querySelector('.alert')) {
                document.querySelector('.alert').remove();
            }
            
            // Basic validation
            if (!mobile || !password) {
                showError('Please fill all fields');
                return;
            }
            
            try {
                // Show loading state
                const submitBtn = document.querySelector('.login-btn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Logging in...';
                submitBtn.disabled = true;
                
                // Send login request
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ mobile, password })
                });
                
                const result = await response.json();
                
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                if (response.ok) {
                    // Success - redirect to dashboard
                    alert(result.message);
                    window.location.href = '/dashboard.html'; // Create this page
                } else {
                    // Handle different error types
                    if (result.error) {
                        showError(result.error);
                    } else {
                        showError('Login failed. Please try again.');
                    }
                }
            } catch (error) {
                // Restore button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                console.error('Login error:', error);
                showError('Network error. Please check your connection and try again.');
            }
        });
    }
    
    // Handle account creation link
    const createAccountLink = document.getElementById('createAccountLink');
    if (createAccountLink) {
        createAccountLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/register.html'; // Create this page
        });
    }
    
    // Utility function to show error messages
    function showError(message) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert error';
        alertDiv.style.cssText = `
            background-color: #fee;
            color: #c33;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            text-align: center;
        `;
        alertDiv.textContent = message;
        
        // Insert before the form
        loginForm.parentNode.insertBefore(alertDiv, loginForm);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
});