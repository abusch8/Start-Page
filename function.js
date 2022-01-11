if (localStorage.getItem('userName') === null) {
    localStorage.setItem('userName', JSON.stringify('User'));
}
const userName = JSON.parse(localStorage.getItem('userName'));

updateClock();
function updateClock() {
    const date = new Date();
    document.getElementById('welcome_msg').textContent = 'Good ' + ((date.getHours() <= 11) ? 'morning ' : 'evening ') + userName + '!';
    document.getElementById('time').textContent = date.toLocaleTimeString('en-US', {hour12: true});
    document.getElementById('date').textContent = date.toLocaleDateString('en-US', {dateStyle: 'full'});
}   
setInterval(updateClock, 1000);

if (localStorage.getItem('tasks') === null) {
    localStorage.setItem('tasks', '[]');
}
let tasks = JSON.parse(localStorage.getItem('tasks'));

renderList();

let editing = false;

const addTextField = document.getElementById('add_field');
addTextField.addEventListener('keypress', function(ev) {
    if (ev.key === 'Enter') {
        addToList();
    }
});

document.getElementById('add_btn').addEventListener('click', addToList);

document.getElementById('sort_btn').addEventListener('click', function() {
    tasks.sort((a, b) => {
        if ((a.completed && b.completed) || (!a.completed && !b.completed)) {
            return a.value.localeCompare(b.value);
        }
        return (a.completed) ? 1 : -1;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderList();
});

document.getElementById('clear_btn').addEventListener('click', function() {
    if (confirm("Are you sure you want to clear the list?")) {
        editing = false;
        tasks = [];
        localStorage.setItem('tasks', '[]');
        renderList();
    }
});

function Task(value) {
    this.value = value;
    this.completed = false;
}

function addToList() {
    if (addTextField.value !== '') {
        tasks.push(new Task(addTextField.value));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTextField.value = '';
        renderList();
    }
}

function renderList() {
    document.getElementById('task_list').innerText = '';
    for (let i = 0; i < tasks.length; ++i) {
        const taskContainer = document.createElement('div');
        taskContainer.setAttribute('class', 'task-container');

        const liWrapper = document.createElement('div');
        liWrapper.setAttribute('class', 'li-wrapper');

        const li = document.createElement('li');

        const task = document.createElement('div');
        task.setAttribute('id', 'task_' + String(i).padStart(3, '0'));
        task.setAttribute('class', (tasks[i].completed) ? 'task-completed' : 'task');
        task.setAttribute('draggable', true);
        task.setAttribute('ondragstart', 'drag(event)');
        task.setAttribute('ondrop', 'drop(event)');
        task.setAttribute('ondragover', 'allowDrop(event)');
        task.innerText = tasks[i].value;
        task.addEventListener('click', function() {
            if (!editing) {
                tasks[Number(this.id.slice(this.id.length - 3))].completed = !tasks[Number(this.id.slice(this.id.length - 3))].completed;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderList();
            }
        });

        li.appendChild(task);
        liWrapper.appendChild(li);
        taskContainer.appendChild(liWrapper);

        const popUpContainer = document.createElement('div');
        popUpContainer.setAttribute('class', 'btn-popup-container');

        const editButton = document.createElement('button');
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('class', 'edit-btn');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', function() {
            editing = true;
            editField.value = task.innerText;
            task.style.display = 'none';
            popUpContainer.style.display = 'none';
            editContainer.style.display = 'inline';
            editField.select();
        });
        popUpContainer.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('class', 'delete-btn');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', function() {
            tasks.splice(task.id.slice(task.id.length - 3), 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderList();
        });
        popUpContainer.appendChild(deleteButton);
        taskContainer.appendChild(popUpContainer);

        const editContainer = document.createElement('div');
        editContainer.setAttribute('class', 'edit-task-container');

        const editField = document.createElement('input');
        editField.setAttribute('type', 'text');
        editField.setAttribute('class', 'edit-field');
        editField.addEventListener('keypress', function(ev) {
            if (ev.key === 'Enter') {
                modifyList();
            }
        });
        editContainer.appendChild(editField);

        const confirmButton = document.createElement('button');
        confirmButton.setAttribute('type', 'submit');
        confirmButton.setAttribute('class', 'confirm-btn');
        confirmButton.innerText = 'Confirm';
        confirmButton.addEventListener('click', modifyList);
        editContainer.appendChild(confirmButton);
        li.appendChild(editContainer);

        function modifyList() {
            if (editField.value !== '') {
                editing = false;
                editContainer.style.display = 'none';
                task.style.display = 'inline';
                tasks[Number(task.id.slice(task.id.length - 3))].value = editField.value;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderList();
            }
        }

        taskContainer.addEventListener('mouseenter', function() {
            if (!editing) {
               popUpContainer.style.display = 'inline';
            }
        });

        taskContainer.addEventListener('mouseleave', function() {
            popUpContainer.style.display = 'none';
        });

        document.getElementById('task_list').appendChild(taskContainer);
    }
}

let dragId = undefined;

function drag(ev) {
    if (editing) {
        ev.preventDefault();
    }
    dragId = Number(ev.target.id.slice(ev.target.id.length - 3));
}

function drop(ev) {
    ev.preventDefault();
    if (dragId !== undefined && ev.target.id !== undefined) {
        const swap = tasks[Number(ev.target.id.slice(ev.target.id.length - 3))];
        tasks[Number(ev.target.id.slice(ev.target.id.length - 3))] = tasks[dragId];
        tasks[dragId] = swap;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        dragId = undefined;
        renderList();
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

const settingsMenu = document.getElementById('settings_menu');

document.getElementById('settings_btn').addEventListener('click', function() {
    settingsMenu.style.visibility = 'visible';
});

document.getElementById('close_btn').addEventListener('click', function() {
    settingsMenu.style.visibility = 'hidden';
});

const userNameField = document.getElementById('user_name_field');
userNameField.value = userName;

document.getElementById('update_btn').addEventListener('click', function() {
    localStorage.setItem('userName', JSON.stringify(userNameField.value));
});
