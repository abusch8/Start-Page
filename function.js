const userName = 'Alex';

updateClock();
function updateClock() {
    const date = new Date();
    document.getElementById('welcome-msg').textContent = 'Good ' + ((date.getHours() <= 11) ? 'morning ' : 'evening ') + userName + '!';
    document.getElementById('time').textContent = date.toLocaleTimeString('en-US', {hour12: true});
    document.getElementById('date').textContent = date.toLocaleDateString('en-US', {dateStyle: 'full'});
}   
setInterval(updateClock, 1000);

if (localStorage.getItem('todoList') === null) {
    localStorage.setItem('todoList', '[]');
}
let todoList = JSON.parse(localStorage.getItem('todoList'));

renderList();

const textField = document.getElementById('new-task-in');
textField.addEventListener('keypress', function(ev) {
    if (ev.key === 'Enter') {
        addToList();
    }
});

document.getElementById('add-btn').addEventListener('click', addToList);

document.getElementById('sort-btn').addEventListener('click', function() {
    todoList.sort((a, b) => {
        if ((a.completed && b.completed) || (!a.completed && !b.completed)) {
            return a.str.localeCompare(b.str);
        }
        return (a.completed) ? 1 : -1;
    });
    localStorage.setItem('todoList', JSON.stringify(todoList));
    renderList();
});

document.getElementById('clear-btn').addEventListener('click', function() {
    if (confirm("Are you sure you want to clear the list?")) {
        todoList = [];
        localStorage.setItem('todoList', '[]');
        renderList();
    }
});

function Task(str) {
    this.str = str;
    this.completed = false;
}

function addToList() {
    if (textField.value !== '') {
        todoList.push(new Task(textField.value));
        localStorage.setItem('todoList', JSON.stringify(todoList));
        textField.value = '';
        renderList();
    }
}

function renderList() {
    document.getElementById('todo-list').innerText = '';
    for (let i = 0; i < todoList.length; ++i) {
        const li = document.createElement('li');
        li.setAttribute('id', String(i));
        li.setAttribute('draggable', true);
        li.setAttribute('ondragstart', 'drag(event)');
        li.setAttribute('ondrop', 'drop(event)');
        li.setAttribute('ondragover', 'allowDrop(event)');
        li.addEventListener('click', function() {
            todoList[this.id].completed = !todoList[this.id].completed;
            localStorage.setItem('todoList', JSON.stringify(todoList));
            renderList();
        });
        if (todoList[i].completed) {
            li.setAttribute('class', 'completed');
        }
        li.innerText = todoList[i].str;
        document.getElementById('todo-list').appendChild(li);
    }
}

let dragId = undefined;

function drag(ev) {
    dragId = ev.target.id;
}

function drop(ev) {
    ev.preventDefault();
    if (dragId !== undefined && ev.target.id !== undefined) {
        const swap = todoList[ev.target.id];
        todoList[ev.target.id] = todoList[dragId];
        todoList[dragId] = swap;
        localStorage.setItem('todoList', JSON.stringify(todoList));
        dragId = undefined;
        renderList();
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}
