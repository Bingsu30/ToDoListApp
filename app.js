document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const lowPriority = document.getElementById('lowPriority');
    const mediumPriority = document.getElementById('mediumPriority');
    const highPriority = document.getElementById('highPriority');
    const dueDateInput = document.getElementById('dueDateInput');
    const dueTimeInput = document.getElementById('dueTimeInput');
    const taskList = document.getElementById('taskList');
    

    let selectedTaskIndex;

 
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  
    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(function (task, index) {
            const li = document.createElement('li');
            const taskStatus = task.completed ? 'completed' : 'incomplete';
            const checkboxIcon = task.completed ? '✓' : '○';
    
            li.innerHTML = `
                <span class="task-status ${taskStatus} ${task.completed ? 'checked' : ''}" onclick="toggleTaskStatus(${index})">${checkboxIcon}</span>
                <span class="description ${taskStatus}">${task.description || 'No description'}</span>
                <span class="priority">${task.priority || 'No priority'}</span>
                <span class="due-date">${formatDueDate(task.dueDate, task.dueTime)}</span>
                <button class="edit" data-index="${index}">Edit</button>
                <button class="delete" data-index="${index}">Delete</button>
            `;
    
            li.classList.add('add-glow');
            taskList.appendChild(li);

            if (task.completed) {
                li.classList.add('checked');
            }
        });
    
        
        localStorage.setItem('tasks', JSON.stringify(tasks));

        
        function formatDueDate(dueDate, dueTime) {
            if (!dueDate && !dueTime) {
                return 'No due date/time';
            }

            const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };

           
            return new Date(`${dueDate || '1970-01-01'} ${dueTime || ''}`).toLocaleString('en-US', options);
        }
    }

   
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const description = taskInput.value.trim();
        const priority = getSelectedPriority();
        const dueDate = dueDateInput.value;
        const dueTime = dueTimeInput.value;

        const newTask = {
            description: description || null,
            priority: priority || null,
            dueDate: validateDueDate(dueDate) ? dueDate : null,
            dueTime: validateDueTime(dueTime) ? dueTime : null,
            completed: false,
        };

        if (newTask.description || newTask.priority || newTask.dueDate || newTask.dueTime) {
            tasks.push(newTask);
            renderTasks();
            taskInput.value = '';
            resetPrioritySelection(); 
            dueDateInput.value = ''; 
            dueTimeInput.value = ''; 
        } else {
            alert('Please provide valid information for the task.');
        }
    });

    
    function getSelectedPriority() {
        if (lowPriority.checked) {
            return 'Priority: Low';
        } else if (mediumPriority.checked) {
            return 'Priority: Medium';
        } else if (highPriority.checked) {
            return 'Priority: High';
        }
        
    }


    function resetPrioritySelection() {
        lowPriority.checked = false;
        mediumPriority.checked = false;
        highPriority.checked = false;
    }

   
    function validateDueDate(dateString) {
        if (!dateString) {
            return true; 
        }

        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateString);
    }

    
    function validateDueTime(timeString) {
        if (!timeString) {
            return true; 
        }

        const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        return regex.test(timeString);
    }

    
    window.toggleTaskStatus = function (index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    };

    
    taskList.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('edit')) {
            const index = target.dataset.index;
            selectedTaskIndex = index;
            openEditModal(index);
        } else if (target.classList.contains('delete')) {
            const index = target.dataset.index;
            if (confirm('Are you sure you want to delete this task?')) {
                tasks.splice(index, 1);
                renderTasks();
            }
        }
    });

    
    function openEditModal(index) {
        const editedDescriptionInput = document.getElementById('editedDescription');
        const editedPriorityInput = document.getElementById('editedPriority');
        const editedDueDateInput = document.getElementById('editedDueDate');
        const editedDueTimeInput = document.getElementById('editedDueTime');

        
        editedDescriptionInput.value = tasks[index].description || '';
        editedPriorityInput.value = tasks[index].priority || '';
        editedDueDateInput.value = tasks[index].dueDate || '';
        editedDueTimeInput.value = tasks[index].dueTime || '';

      
        const editModal = document.getElementById('editModal');
        editModal.style.display = 'block';
    }

   
    function closeEditModal() {
        const editModal = document.getElementById('editModal');
        editModal.style.display = 'none';
    }

    
    function saveEditedTask() {
        const editedDescriptionInput = document.getElementById('editedDescription');
        const editedPriorityInput = document.getElementById('editedPriority');
        const editedDueDateInput = document.getElementById('editedDueDate');
        const editedDueTimeInput = document.getElementById('editedDueTime');

       
        const newDescription = editedDescriptionInput.value;
        const newPriority = editedPriorityInput.value;
        const newDueDate = editedDueDateInput.value;
        const newDueTime = editedDueTimeInput.value;

        
        const editedTask = {
            description: newDescription || null,
            priority: newPriority || null,
            dueDate: validateDueDate(newDueDate) ? newDueDate : null,
            dueTime: validateDueTime(newDueTime) ? newDueTime : null,
            completed: tasks[selectedTaskIndex].completed,
        };

        if (editedTask.description || editedTask.priority || editedTask.dueDate || editedTask.dueTime) {
            tasks[selectedTaskIndex] = editedTask;
            renderTasks();
            closeEditModal();
        } else {
            alert('Please provide valid information for the task.');
        }
    }

   
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    saveChangesBtn.addEventListener('click', saveEditedTask);

    
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', closeEditModal);

    
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

    renderTasks();
});
