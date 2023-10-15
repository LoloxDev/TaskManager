const taskForm = document.getElementById('taskForm');
const submitButton = document.getElementById('submitButton');
const token = localStorage.getItem('token');

let taskTable = 2; // 0 = tableau de tâches undone, 1 = tâches done, 2 = toutes les tâches

taskForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const postData = {
        taskName: taskForm.elements.taskName.value,
        taskStatus: taskForm.elements.taskStatus.value,
        token: token
    };

    fetch(`/addTask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Modification de la couleur du bouton et son contenu pour informer l'utilisateur du succès / echec
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

        fetchAndDisplayTasks();
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout de la tâche ou récupération des données :', error);
    });
});

// Création du tableau de la liste des taches
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
    statusCell.textContent = task.isDone === 1 ? 'Terminée' : 'En attente';
    row.appendChild(statusCell);

    // Colonne des boutons
    const buttonsCell = document.createElement('td');

    // Modifier
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
                            token: token
                        };
                    
                        console.log('Données envoyées pour l\'édition de la tâche :', postData);
                    
                        fetch(`/editTask`, {
                            method: 'POST',
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

    // Supprimer
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
        console.log(taskIdToDelete)
        deleteConfirmButton.setAttribute('data-task-id', taskIdToDelete);
    });

    buttonsCell.appendChild(deleteButton);

    // Marquer comme fait
    if(task['isDone'] === 0){
        const markDoneButton = document.createElement('button');
        const markDoneIcon = document.createElement('i');
        markDoneIcon.className = 'fa-solid fa-check';
        markDoneButton.appendChild(markDoneIcon);
        markDoneButton.className = 'btn btn-success tasksBtn';
        markDoneButton.addEventListener('click', function() {

            const postData = {
                taskId: task.id,
                taskName: task.name,
                taskStatus: 1,
                token: token
            };
        
            fetch(`/editTask`, {
                method: 'POST',
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
    let url = `/tasks?token=${token}`;

    // Ajoutez le paramètre status pour savoir sur quel liste nous sommes
    if (status !== null && status !== '2') {
        url += `&status=${status}`;
    }

    fetch(url)
        .then(response => {
            if (response.status === 401) {
              window.location.href = '/login'; // Redirigez l'utilisateur vers la page de connexion
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
        fetchAndDisplayTasks(taskTable);
    });
});

const deleteButtons = document.querySelectorAll('.delete-task-button');

deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', function() {
        const taskId = this.getAttribute('data-task-id')


        fetch(`/deleteTask/${taskId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'token': token
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

// Pour récupérer toutes les tâches
fetchAndDisplayTasks();