const Api = {
    getCookie: function(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        
        if (parts.length < 2) {
            this.logOut();
            return;
        }
        return parts.pop().split(';').shift(); 
    },
    logOut: function() {
        window.location.href = './login';
    },
    logOutUsert: function() {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        this.logOut();
    },
    storeUser: function(data) {
        const { id, username, token } = data
        document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict; max-age=3600`;
        const user = { id, username }
        sessionStorage.setItem('username', JSON.stringify(user));
    },
    registerUser: async function(username, password) {
        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(response => response.json())
          .then(data => {
            if (data.token) {
                this.storeUser(data);
                window.location.href = './home';
                // Redirect or perform other actions after successful login
            } else {
                console.error('Login failed');
            }
            
          }).catch(error => {
              console.error('Error:', error);
              // Handle registration error
          });
    },
    loginUser: async function(username, password) {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(response => response.json())
          .then(data => {
            if (data.token) {
                this.storeUser(data);
                window.location.href = './home';
            } else {
                console.error('Login failed');
            }
          }).catch(error => {
              console.error('Error:', error);
              // Handle login error
          });
    },
    fetchTodos: async function() {
        const token = this.getCookie('authToken');
        try {
            const response = await fetch('http://localhost:3000/todos', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching todos:', error);
            return [];
        }
    },
    postNewTodo: async function(data) {
        const token = this.getCookie('authToken');
        const dataObj = data;
        try {
            const response = await fetch('http://localhost:3000/todos', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataObj)
            });
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            return true;
        } catch (error) {
            console.error('Error fetching todos:', error);
            return error
        }
    },
    updateTodo: async function(data) {
        const token = this.getCookie('authToken');
        const dataObj = data;
        try {
            const response = await fetch(`http://localhost:3000/todos/${dataObj.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataObj)
            });
            if (!response.ok) {
                throw new Error('Failed to update todo');
            }
            return true;
        } catch (error) {
            console.error('Error updating todo:', error);
            return error;
        }
    },
    removeTodo: async function(id) {
        const token = this.getCookie('authToken');
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to remove todo');
            }
            return true;
        } catch (error) {
            console.error('Error removing todo:', error);
            return error;
        }
    }
}

