document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('new-task');
    const addTaskBtn = document.getElementById('add-task');
    const filterBtn = document.getElementById('filter-btn');
    const filterOptions = document.querySelector('.filter-options');
    const searchInput = document.getElementById('search-task');
    const tasksList = document.getElementById('tasks-list');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
  
    renderTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    filterBtn.addEventListener('click', function() {
        filterOptions.style.display = filterOptions.style.display === 'block' ? 'none' : 'block';
    });
    
    document.addEventListener('click', function(e) {
        if (!filterBtn.contains(e.target) && !filterOptions.contains(e.target)) {
            filterOptions.style.display = 'none';
        }
    });

    document.querySelectorAll('.filter-options button').forEach(btn => {
        btn.addEventListener('click', function() {
            currentFilter = this.getAttribute('data-filter');
            filterOptions.style.display = 'none';
            renderTasks();
        });
    });

    searchInput.addEventListener('input', function() {
        renderTasks();
    });
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            tasks.push({
                id: Date.now(),
                text: taskText,
                completed: false
            });
            saveTasks();
            taskInput.value = '';
            renderTasks();
        }
    }
    
    function renderTasks() {
        tasksList.innerHTML = '';
        
        const searchTerm = searchInput.value.toLowerCase();
        
        const filteredTasks = tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(searchTerm);
            
            if (currentFilter === 'all') return matchesSearch;
            if (currentFilter === 'completed') return task.completed && matchesSearch;
            if (currentFilter === 'pending') return !task.completed && matchesSearch;
            
            return true;
        });
        
        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '<li class="task-item" style="justify-content: center;">Nenhuma tarefa encontrada</li>';
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            taskItem.innerHTML = `
                <button class="check-btn" data-id="${task.id}"></button>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" data-id="${task.id}">✕</button>
            `;
            
            tasksList.appendChild(taskItem);
        });
       
        document.querySelectorAll('.check-btn').forEach(btn => {
            btn.addEventListener('click', toggleTask);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    
    function toggleTask(e) {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            saveTasks();
            renderTasks();
        }
    }
    
    function deleteTask(e) {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});