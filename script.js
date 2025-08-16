const input = document.getElementById('task-input');
const addButton = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const prioritySelect = document.getElementById('priority-select');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

addButton.addEventListener('click', addTask);
input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') addTask();
});
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Load tasks on page load
document.addEventListener('DOMContentLoaded', renderTasks);

function addTask() {
  const text = input.value.trim();
  const priority = prioritySelect.value;

  if (text === '') return;

  const task = {
    text,
    priority,
    completed: false
  };

  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);

  input.value = '';
  renderTasks();
}

function renderTasks() {
  const tasks = getTasks();
  taskList.innerHTML = '';

  tasks
    .filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    })
    .forEach((task, index) => {
      const li = document.createElement('li');
      li.className = `${task.priority} ${task.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <span>${task.text} (${task.priority})</span>
        <button>Delete</button>
      `;

      li.addEventListener('click', () => {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
      });

      li.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
      });

      taskList.appendChild(li);
    });
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
