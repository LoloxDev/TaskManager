const taskForm = document.getElementById('taskForm');
const submitButton = document.getElementById('submitButton');

let taskTable = 2; // 0 = tableau de tâches undone, 1 = tâches done, 2 = toutes les tâches


async function getUser() {
    const response = await fetch('/user/whoAmI');
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des informations de session');
    }
    const data = await response.json();
    console.log(data.user);
    return data.user;
}

document.getElementById('getUser').addEventListener('click', async function() {
    try {
        const user = await getUser();
        console.log('Utilisateur récupéré :', user);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
    }
});


async function personnaliserUtilisateur() {
    try {
        const userData = await getUser();
        const userMenuButton = document.getElementById('userMenuButton');
        const userMenuLi = document.getElementById('userMenuLi');
        userMenuButton.textContent += userData['prenom'];

        const userMenu = document.getElementById('userMenu');

        userMenuLi.addEventListener('mouseenter', function () {
            userMenu.classList.add('fade-transition');
        });

        userMenuLi.addEventListener('mouseleave', function () {
            userMenu.classList.remove('fade-transition');
        });


    } catch (error) {
        console.error('Erreur lors de la personnalisation de l\'utilisateur :', error);
    }
}

personnaliserUtilisateur();

taskForm.addEventListener('submit', function (event) { 
    event.preventDefault();

    const postData = {
        taskName: taskForm.elements.taskName.value,
        taskStatus: taskForm.elements.taskStatus.value,
    };

    fetch(`/tasks/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('ID de la tâche ajoutée :', data.taskId);

            submitButton.style.backgroundColor = 'green';
            submitButton.textContent = 'Tache ajoutée avec succès !';

            setTimeout(() => {
                submitButton.style.backgroundColor = '';
                submitButton.textContent = 'Ajouter une tâche';
            }, 1500);
        } else {
            console.error(data.error);
            submitButton.style.backgroundColor = 'red';
            submitButton.textContent = 'Échec de l\'ajout de la tâche';

            setTimeout(() => {
                submitButton.style.backgroundColor = '';
                submitButton.textContent = 'Ajouter une tâche';
            }, 1500);
        }

        fetchAndDisplayTasks(postData.taskStatus);
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout de la tâche ou récupération des données :', error);
    });
});

function createTaskRow(task, taskTable) {

    const row = document.createElement('tr');

    const idCell = document.createElement('td');
    idCell.textContent = task.id;
    row.appendChild(idCell);

    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameCell.textContent = task.name;
    nameInput.type = 'text';
    nameInput.value = task.name;
    nameInput.classList.add('edit-task-input');
    nameInput.style.display = 'none';
    nameCell.appendChild(nameInput);
    row.appendChild(nameCell);

    const statusCell = document.createElement('td');
    statusCell.textContent = task.isdone === true ? 'Terminée' : 'En attente';
    row.appendChild(statusCell);

    const buttonsCell = document.createElement('td');

    const editButton = document.createElement('button');
    const editIcon = document.createElement('i');
    editIcon.className = 'fa-solid fa-pen-to-square ';
    editButton.appendChild(editIcon);
    editButton.className = 'btn btn-primary tasksBtn';

    editButton.addEventListener('click', function() {
        const nameCell = row.querySelector('td:nth-child(2)');
        const nameInput = nameCell.querySelector('.edit-task-input');
    
        if (nameInput.style.display === 'none') {
            nameInput.style.display = 'block';
            nameCell.textContent = '';
            nameCell.appendChild(nameInput);
            nameInput.focus();

            nameInput.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    const newName = nameInput.value;
                        const postData = {
                            taskName: newName,
                            taskId: task.id,
                            taskStatus:task.isDone,
                        };
                    
                        console.log('Données envoyées pour l\'édition de la tâche :', postData);
                    
                        fetch('/tasks/tasks/${postData.taskId}', {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(postData)
                        })
                        .then(response => response.json())
                    nameCell.textContent = newName;
                    nameInput.style.display = 'none';
                }
            });
        } else {
            const newName = nameInput.value;
            nameCell.textContent = newName;
            nameInput.style.display = 'none';
        }
    });
    buttonsCell.appendChild(editButton);

    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('i');
    const deleteConfirmButton = document.getElementById('confirmDeleteBtn')
    deleteButton.setAttribute('data-bs-target', '#deleteModal');
    deleteButton.setAttribute('data-bs-toggle', 'modal');
    deleteIcon.className = 'fa-solid fa-trash';
    deleteButton.appendChild(deleteIcon);
    deleteButton.className = 'btn btn-danger tasksBtn';
    deleteButton.addEventListener('click', function() {
        const taskIdToDelete = task.id;
        deleteConfirmButton.setAttribute('data-task-id', taskIdToDelete);
    });

    buttonsCell.appendChild(deleteButton);

    if(task['isdone'] === false){
        const markDoneButton = document.createElement('button');
        const markDoneIcon = document.createElement('i');
        markDoneIcon.className = 'fa-solid fa-check';
        markDoneButton.appendChild(markDoneIcon);
        markDoneButton.className = 'btn btn-success tasksBtn';
        markDoneButton.addEventListener('click', function() {

            const postData = {
                taskId: task.id,
                taskName: task.name,
                taskStatus: true,
            };
        
            fetch(`/tasks/tasks/${postData.taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchAndDisplayTasks(taskTable);
                } else {
                    console.error(data.error);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la modification de la tâche :', error);
            });
            
        });
        buttonsCell.appendChild(markDoneButton);
    }

    row.appendChild(buttonsCell);
    return row;
}

function fetchAndDisplayTasks(status = null) {
    let url = `/tasks/tasks`;

    switch (status) {
      case "1":
        status = true
        break;
      case "0":
        status = false
        break;
      default:
        status = null
    }

    console.log(status)

    if (status !== null) {
        url += `?status=${status}`;
    }

    fetch(url)
        .then(response => {
            if (response.status === 401) {
              window.location.href = '/login';
            }
            return response.json();
        })
        .then(tasks => {
            const tableBody = document.getElementById('taskTableBody');
            tableBody.innerHTML = '';

            tasks.forEach(task => {
                const row = createTaskRow(task, taskTable);
                tableBody.appendChild(row);
            });
        })}

const filtersButtons = document.querySelectorAll('.filter-btn');

filtersButtons.forEach(button => {
    button.addEventListener('click', function() {
        taskTable = this.getAttribute('data-status').toString();
console.log(taskTable)
        fetchAndDisplayTasks(taskTable);
    });
});

const deleteButtons = document.querySelectorAll('.delete-task-button');

deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', function() {
        const taskId = this.getAttribute('data-task-id')

        fetch(`/tasks/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                fetchAndDisplayTasks(taskTable);
            } else {
                console.error(data.error);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de la tâche :', error);
        });
    });
});

fetchAndDisplayTasks();