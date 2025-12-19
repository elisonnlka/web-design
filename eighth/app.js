document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const filterAllBtn = document.getElementById('filterAll');
    const filterCompletedBtn = document.getElementById('filterCompleted');
    const filterUncompletedBtn = document.getElementById('filterUncompleted');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');

    let currentFilter = 'all';
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    updateStats();
    renderTasks();

    function updateStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;

        totalTasksSpan.textContent = `Всего задач: ${total}`;
        completedTasksSpan.textContent = `Выполнено: ${completed}`;

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';

        let filteredTasks = tasks;

        if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        } else if (currentFilter === 'uncompleted') {
            filteredTasks = tasks.filter(task => !task.completed);
        }

        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.className = 'empty-message';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.padding = '30px';
            emptyMessage.style.color = '#888';
            emptyMessage.textContent = getEmptyMessage();
            taskList.appendChild(emptyMessage);
            return;
        }

        filteredTasks.forEach((task) => {
            const li = document.createElement('li');
            if (task.completed) {
                li.classList.add('completed');
            }

            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn">Изменить</button>
                    <button class="task-btn delete-btn">Удалить</button>
                </div>
            `;

            taskList.appendChild(li);

            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', function () {
                toggleTask(task.id);
            });

            const editBtn = li.querySelector('.edit-btn');
            const deleteBtn = li.querySelector('.delete-btn');

            editBtn.addEventListener('click', function () {
                editTask(task.id);
            });

            deleteBtn.addEventListener('click', function () {
                deleteTask(task.id);
            });
        });
    }

    function getEmptyMessage() {
        if (currentFilter === 'all' && tasks.length === 0) {
            return 'Список задач пуст. Добавьте первую задачу!';
        } else if (currentFilter === 'completed') {
            return 'Нет выполненных задач';
        } else if (currentFilter === 'uncompleted') {
            return 'Все задачи выполнены!';
        }
        return 'Задачи не найдены';
    }

    function addTask() {
        const text = taskInput.value.trim();

        if (text === '') {
            alert('Введите текст задачи!');
            taskInput.focus();
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = '';
        updateStats();
        renderTasks();
        taskInput.focus();
    }

    function toggleTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            updateStats();
            renderTasks();
        }
    }

    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            const newText = prompt('Измените текст задачи:', task.text);

            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                updateStats();
                renderTasks();
            }
        }
    }

    function deleteTask(id) {
        if (confirm('Удалить задачу?')) {
            tasks = tasks.filter(task => task.id !== id);
            updateStats();
            renderTasks();
        }
    }

    function clearCompletedTasks() {
        const completedCount = tasks.filter(task => task.completed).length;

        if (completedCount === 0) {
            alert('Нет выполненных задач для удаления');
            return;
        }

        if (confirm(`Удалить ${completedCount} выполненных задач?`)) {
            tasks = tasks.filter(task => !task.completed);
            updateStats();
            renderTasks();
        }
    }

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    filterAllBtn.addEventListener('click', function () {
        currentFilter = 'all';
        setActiveFilter(this);
        renderTasks();
    });

    filterCompletedBtn.addEventListener('click', function () {
        currentFilter = 'completed';
        setActiveFilter(this);
        renderTasks();
    });

    filterUncompletedBtn.addEventListener('click', function () {
        currentFilter = 'uncompleted';
        setActiveFilter(this);
        renderTasks();
    });

    clearCompletedBtn.addEventListener('click', clearCompletedTasks);

    function setActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
});