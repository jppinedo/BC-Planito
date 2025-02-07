
const todoState = {
    formVisible: false,
    formType: 'new-todo', // 'new-todo' | 'edit-todo'
    editing: {
        id: null,
        title: '',
        description: '',
        completed: false
    }
}

const getStorage = () => {
    const userSession = JSON.parse(sessionStorage.getItem('username'));
    if (userSession && userSession.username) {
        document.getElementById('username').textContent = userSession.username;
    } else {
        console.error('No username found in session storage');
    }
}

const setLoading = loading => {
    // Toggle the loading class on the container
    const container = document.querySelector('.container');
    if (container) {
        if(loading) container.classList.add('loading');
        else container.classList.remove('loading');
    }
}

const createTodoHTML = todo => (`
    <div class="todo-card ${todo.completed ? 'todo-completed' : ''}" id="todo-${todo.id}">
        <h3>${todo.title}</h3>
        <p>${todo.description}</p>
        <label class="checkbox-container">
            <input type="checkbox" 
                ${todo.completed ? 'checked' : ''}
                data-id="${todo.id}" 
                data-title="${todo.title}" 
                data-description="${todo.description}"
            >
            <span class="checkmark"></span>
            Completed
        </label>
        <span class="delete-icon action-icon" data-id="${todo.id}" role="button" tabindex="0">
            <i class="fas fa-times"></i>
        </span>
        <span class="edit-icon action-icon" data-id="${todo.id}" role="button" tabindex="0">
            <i class="fas fa-pencil-alt"></i>
        </span>
    </div>
`);


const toggleTodoStatus = async (e) => {
    const checkbox = e.target;
    const id = checkbox.getAttribute('data-id');
    const title = checkbox.getAttribute('data-title');
    const description = checkbox.getAttribute('data-description');
    const completed = checkbox.checked;
    document.getElementById(`todo-${id}`).classList.toggle('todo-completed');
    const response = await Api.updateTodo({id, title, description, completed});
    
}

const removeTodo = async (id) => {
    const response = await Api.removeTodo(id);
    if(response) updateTodos(false);
}

const showModal = (htmlFragment) => {
    const modal = document.getElementById('modalOverlay');
    const container = modal.querySelector('.modal-content');
    container.appendChild(htmlFragment);
    modal.classList.add('show-modal');
}

const hideModal = () => {
    const modal = document.getElementById('modalOverlay');
    const container = modal.querySelector('.modal-content');
    container.innerHTML = '';
    modal.classList.remove('show-modal');
}

const deleteTodo = e => {
    const id = e.currentTarget.getAttribute("data-id");
    const fragment = document.createDocumentFragment();
    const h2 = document.createElement('h2');
    const p = document.createElement('p');
    const button = document.createElement('button');
    h2.textContent = 'Delete todo';
    p.textContent = 'Are you sure you want to eliminate this todo?';
    button.textContent = 'Confirm';
    button.addEventListener('click', () => {
        removeTodo(id);
        hideModal();
    });
    fragment.appendChild(h2);
    fragment.appendChild(p);
    fragment.appendChild(button);
    showModal(fragment);
}

const editTodoAction = e => {
    const id = e.currentTarget.getAttribute('data-id');
    const title = document.querySelector(`#todo-${id} h3`).textContent;
    const description = document.querySelector(`#todo-${id} p`).textContent;
    const completed = document.querySelector(`#todo-${id} .checkbox-container input[type="checkbox"]`).checked;
    todoState.editing = {id, title, description, completed}
    todoState.formType = 'edit-todo';
    toggleFormVisibility();
}

const editTodo = async () => {
    const response = await Api.updateTodo(todoState.editing);
    if(response) updateTodos(true);
}

const addActionListeners = () => {
    // Add event listeners to checkboxes
    document.querySelectorAll('.todo-card input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', toggleTodoStatus);
    });
    // Add event listeners to close icons
    document.querySelectorAll('span.delete-icon').forEach(checkbox => {
        checkbox.addEventListener('click', deleteTodo);
    });
    // Add event listeners to edit icons
    document.querySelectorAll('span.edit-icon').forEach(checkbox => {
        checkbox.addEventListener('click', editTodoAction);
    });
}

const updateTodoList = async () => {
    const todos = await Api.fetchTodos();
    const container = document.getElementById('todo-list');
    container.innerHTML = '';
    const todoList = document.createElement('ul');

    if (todos.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No todos found.';
        container.appendChild(emptyMessage);
    } else {
        todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.innerHTML = createTodoHTML(todo);
            todoList.appendChild(todoItem);
        });
        container.appendChild(todoList);
        addActionListeners();
    }
}

const updateTodos = (toggle = false) => {
    setLoading(true);
    updateTodoList();
    setTimeout(() => {
        setLoading(false);
        if(toggle) toggleFormVisibility();
    }, 500);
}

const createTodo = async (data) => {
    const response = await Api.postNewTodo(data);
    if(response) {
        updateTodos(true);
    } else {
        console.log('failed creating todo');
    }
}

const clearForm = () => {
    document.getElementById('todoTitle').value = '';
    document.getElementById('todoDescription').value = '';
}

const toggleFormVisibility = () => {
    if(todoState.formType === 'edit-todo') {
        document.getElementById('todoTitle').value = todoState.editing.title;
        document.getElementById('todoDescription').value = todoState.editing.description;
    } else {
        clearForm();
    }
    document.getElementById('create-todo').classList.toggle('active');
    document.getElementById('todo-list').classList.toggle('active');
}

const validateTodoForm = (title, description) => {
    let valid = true;
    if (title === "") {
        valid = false;
        document.getElementById('todoTitleError').textContent = "The title is required.";
        document.getElementById('todoTitleError').style.display = "block";
    } else {
        document.getElementById('todoTitleError').style.display = "none";
    }

    if (description === "") {
        valid = false;
        document.getElementById('todoDescriptionError').textContent = "The description is required.";
        document.getElementById('todoDescriptionError').style.display = "block";
    } else {
        document.getElementById('todoDescriptionError').style.display = "none";
    }
    return valid;
}

const onTodoFormSubmit = () => {
    let title = document.getElementById('todoTitle').value;
    let description = document.getElementById('todoDescription').value;
    let valid = validateTodoForm(title, description);
    if(valid) {
        if(todoState.formType === 'new-todo') {
            createTodo({title, description});
        } else {
            todoState.editing.title = title;
            todoState.editing.description = description;
            editTodo();
        }  
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getStorage();
    updateTodos(false);
});

document.getElementById('create-todo-btn').addEventListener('click', () => {
    todoState.formType = 'new-todo';
    todoState.editing = {id: null, title: '', description: ''};
    toggleFormVisibility();
});

document.getElementById('new-todo').addEventListener('submit', (e) => {
    e.preventDefault();
    onTodoFormSubmit();
});

document.getElementById('logout').addEventListener('click', (e) => {
    e.preventDefault();
    Api.logOutUsert();
})