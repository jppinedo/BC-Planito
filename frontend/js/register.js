const registerForm = document.getElementById('registerForm');
if(registerForm) {
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
    
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        let confirmPassword = document.getElementById('confirmPassword').value;
    
        let valid = true;
    
        if (username === "") {
            valid = false;
            document.getElementById('usernameError').textContent = "Username is required.";
            document.getElementById('usernameError').style.display = "block";
        } else {
            document.getElementById('usernameError').style.display = "none";
        }
    
        if (password === "") {
            valid = false;
            document.getElementById('passwordError').textContent = "Password is required.";
            document.getElementById('passwordError').style.display = "block";
        } else {
            document.getElementById('passwordError').style.display = "none";
        }
    
        if (confirmPassword === "") {
            valid = false;
            document.getElementById('confirmPasswordError').textContent = "Confirm Password is required.";
            document.getElementById('confirmPasswordError').style.display = "block";
        } else if (password !== confirmPassword) {
            valid = false;
            document.getElementById('confirmPasswordError').textContent = "Passwords do not match.";
            document.getElementById('confirmPasswordError').style.display = "block";
        } else {
            document.getElementById('confirmPasswordError').style.display = "none";
        }
    
        if (valid) {
            Api.registerUser(username, password);
        }
    });
}