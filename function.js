const userName = 'Alex';

updateClock();
function updateClock() {
    const date = new Date();
    document.getElementById('welcome-msg').textContent = 'Good ' + ((date.getHours() <= 11) ? 'morning ' : 'evening ') + userName + '!';
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

const addTextField = document.getElementById('add-field');
addTextField.addEventListener('keypress', function(ev) {
    if (ev.key === 'Enter') {
        addToList();
    }
});

document.getElementById('add-btn').addEventListener('click', addToList);

document.getElementById('sort-btn').addEventListener('click', function() {
    tasks.sort((a, b) => {
        if ((a.completed && b.completed) || (!a.completed && !b.completed)) {
            return a.str.localeCompare(b.str);
        }
        return (a.completed) ? 1 : -1;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderList();
});

document.getElementById('clear-btn').addEventListener('click', function() {
    if (confirm("Are you sure you want to clear the list?")) {
        editing = false;
        tasks = [];
        localStorage.setItem('tasks', '[]');
        renderList();
    }
});

function Task(str) {
    this.str = str;
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
    document.getElementById('task-list').innerText = '';
    for (let i = 0; i < tasks.length; ++i) {
        const container = document.createElement('div');
        container.setAttribute('class', 'li-container');

        const outerDiv = document.createElement('div');
        outerDiv.setAttribute('class', 'li-wrapper');

        const innerDiv = document.createElement('div');
        innerDiv.innerText = tasks[i].str;
        innerDiv.setAttribute('draggable', true);
        innerDiv.setAttribute('ondragstart', 'drag(event)');
        innerDiv.setAttribute('ondrop', 'drop(event)');
        innerDiv.setAttribute('ondragover', 'allowDrop(event)');
        innerDiv.setAttribute('id', 'task-' + String(i).padStart(3, '0'));
        innerDiv.addEventListener('click', function() {
            if (!editing) {
                console.log(this.id.slice(this.id.length - 3));
                tasks[Number(this.id.slice(this.id.length - 3))].completed = !tasks[Number(this.id.slice(this.id.length - 3))].completed;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderList();
            }
        });

        const li = document.createElement('li');
        if (tasks[i].completed) {
            li.setAttribute('class', 'completed');
        }
        li.appendChild(innerDiv);
        outerDiv.appendChild(li)
        container.appendChild(outerDiv);

        const editButton = document.createElement('button');
        editButton.setAttribute('id', 'edit-btn-' + String(i).padStart(3, '0'));
        editButton.setAttribute('class', 'edit-btn');
        editButton.innerText = 'Edit';
        editButton.addEventListener('click', function() {
            editing = true;
            li.setAttribute('draggable', false);
            editTextField.value = li.innerText;
            innerDiv.style.display = 'none';
            editButton.style.display = 'none';
            deleteButton.style.display = 'none';
            editTextField.style.display = 'inline-block';
            confirmButton.style.display = 'inline-block';
            editTextField.select();
        });
        container.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.setAttribute('id', 'delete-btn-' + String(i).padStart(3, '0'));
        deleteButton.setAttribute('class', 'delete-btn');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', function() {
            tasks.splice(this.id.slice(this.id.length - 3), 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderList();
        });
        container.appendChild(deleteButton);

        const editTextField = document.createElement('input');
        editTextField.setAttribute('type', 'text');
        editTextField.setAttribute('id', 'edit-field-' + String(i).padStart(3, '0'));
        editTextField.setAttribute('class', 'edit-field');
        editTextField.addEventListener('keypress', function(ev) {
            if (ev.key === 'Enter') {
                modifyList();
            }
        });
        li.appendChild(editTextField);

        const confirmButton = document.createElement('button');
        confirmButton.setAttribute('id', 'confirm-btn-' + String(i).padStart(3, '0'));
        confirmButton.setAttribute('class', 'confirm-btn');
        confirmButton.innerText = 'Confirm';
        confirmButton.addEventListener('click', modifyList);
        container.appendChild(confirmButton);

        function modifyList() {
            if (editTextField.value !== '') {
                editing = false;
                editTextField.style.display = 'none';
                confirmButton.style.display = 'none';
                innerDiv.style.display = 'inline-block';
                tasks[Number(editTextField.id.slice(editTextField.id.length - 3))].str = editTextField.value;
                localStorage.setItem('tasks', JSON.stringify(tasks));
                renderList();
            }
        }

        container.addEventListener('mouseenter', function() {
            if (!editing) {
                deleteButton.style.display = 'inline-block';
                editButton.style.display = 'inline-block';
            }
        });

        container.addEventListener('mouseleave', function() {
            deleteButton.style.display = 'none';
            editButton.style.display = 'none';
        });

        document.getElementById('task-list').appendChild(container);
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
        console.log(ev.target.id.slice(ev.target.id.length - 3));
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
