const loginForm = document.getElementById('loginForm');
if(loginForm) {
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
    
        let username = document.getElementById('loginUsername').value;
        let password = document.getElementById('loginPassword').value;
    
        let valid = true;
    
        if (username === "") {
            valid = false;
            document.getElementById('loginUsernameError').textContent = "Username is required.";
            document.getElementById('loginUsernameError').style.display = "block";
        } else {
            document.getElementById('loginUsernameError').style.display = "none";
        }
    
        if (password === "") {
            valid = false;
            document.getElementById('loginPasswordError').textContent = "Password is required.";
            document.getElementById('loginPasswordError').style.display = "block";
        } else {
            document.getElementById('loginPasswordError').style.display = "none";
        }
    
        if (valid) {
            Api.loginUser(username, password);
        }
    });
}