const userName = 'Alex';
document.getElementById('header').textContent = 'Good ' + ((new Date().getHours() <= 11) ? 'morning ' : 'evening ') + userName;

if (localStorage.getItem('todoList') === null) {
    localStorage.setItem('todoList', '[]');
}
let todoList = JSON.parse(localStorage.getItem('todoList'));

printList();

const textField = document.getElementById('new-task-in');
textField.addEventListener('keypress', function(ev) {
    if (ev.key === 'Enter') {
        addToList();
    }
});

document.getElementById('add-btn').addEventListener('click', addToList);

document.getElementById('clear-btn').addEventListener('click', function() {
    if (confirm("Are you sure you want to clear the list?")) {
        todoList = [];
        localStorage.setItem('todoList', '[]');
        printList();
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
        printList();
    }
}

function printList() {
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
            printList();
        });
        if (todoList[i].completed) {
            li.setAttribute('class', 'completed');
        }
        li.innerText = todoList[i].str;
        document.getElementById('todo-list').appendChild(li);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData('index', ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const swap = todoList[ev.target.id];
    todoList[ev.target.id] = todoList[ev.dataTransfer.getData('index')];
    todoList[ev.dataTransfer.getData('index')] = swap;
    localStorage.setItem('todoList', JSON.stringify(todoList));
    printList();
}
