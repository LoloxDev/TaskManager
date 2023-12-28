const taskForm = document.getElementById('taskForm'); // Formulaire d'ajout de tâches
const submitButton = document.getElementById('submitButton'); // Bouton submit d'ajout de tâches

let taskTable = 2; // 0 = tableau de tâches undone, 1 = tâches done, 2 = toutes les tâches

// Méthode de modification de style des boutons selon succes
export function stylizeButton(button, success, message) {
    if (success) {
        // Modification de la couleur du bouton et son contenu pour informer l'utilisateur du succès
        button.style.backgroundColor = 'green';
        button.textContent = message || 'Opération réussie !';
    } else {
        // Modification de la couleur du bouton et son contenu pour informer l'utilisateur de l'échec
        button.style.backgroundColor = 'red';
        button.textContent = message || 'Échec de l\'opération';

        setTimeout(() => {
            button.style.backgroundColor = '';
            button.textContent = 'Réessayer';
        }, 1500);
    }

    setTimeout(() => {
        button.style.backgroundColor = '';
        button.textContent = 'Ajouter une tâche'; // ou un texte par défaut si besoin
    }, 1500);
}

document.getElementById('getUser').addEventListener('click', function(){
    fetch(`/user`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    })
})

// Récupération des infos session utilisateur
async function getUser() {
    try {
        const response = await fetch('/user');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de session :', error);
        throw error; // Vous pouvez gérer cette erreur de manière appropriée
    }
}

getUser();

// Personnalisation user
async function personnaliserUtilisateur() {
    try {
        const userData = await getUser();
        const navbarNav = document.getElementById('navbar-nav');
        navbarNav.insertAdjacentHTML('afterbegin', `<li class="nav-item">Bienvenue ${userData.nom}</li>`);
    } catch (error) {
        console.error('Erreur lors de la personnalisation de l\'utilisateur :', error);
    }
}

personnaliserUtilisateur()

// Création d'un nouvelle tâche
taskForm.addEventListener('submit', function (event) { 
    event.preventDefault();

    const postData = {
        taskName: taskForm.elements.taskName.value,
        taskStatus: taskForm.elements.taskStatus.value,
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

        fetchAndDisplayTasks(postData.taskStatus); // On appelle la méthode qui raffraichit la liste 
    })
    .catch(error => {
        console.error('Erreur lors de l\'ajout de la tâche ou récupération des données :', error);
    });
});

// Création du tableau de la liste des taches
function createTaskRow(task, taskTable) {

    const row = document.createElement('tr');

    // Colonne des ID
    const idCell = document.createElement('td');
    idCell.textContent = task.id;
    row.appendChild(idCell);

    // Colonne du nom de la tâche
    const nameCell = document.createElement('td');
    const nameInput = document.createElement('input');
    nameCell.textContent = task.name;
    nameInput.type = 'text';
    nameInput.value = task.name;
    nameInput.classList.add('edit-task-input');
    nameInput.style.display = 'none';
    nameCell.appendChild(nameInput);
    row.appendChild(nameCell);

    // Colonne du statut de la tâche
    const statusCell = document.createElement('td');
    statusCell.textContent = task.isdone === true ? 'Terminée' : 'En attente';
    row.appendChild(statusCell);

    // Colonne des boutons
    const buttonsCell = document.createElement('td');

    // Bouton Modifier
    const editButton = document.createElement('button');
    const editIcon = document.createElement('i');
    editIcon.className = 'fa-solid fa-pen-to-square ';
    editButton.appendChild(editIcon);
    editButton.className = 'btn btn-primary tasksBtn';

    // On gère la modification en affichant un input --> bouton enter pour valider
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

    // Bouton supprimer
    const deleteButton = document.createElement('button');
    const deleteIcon = document.createElement('i');
    const deleteConfirmButton = document.getElementById('confirmDeleteBtn')
    deleteButton.setAttribute('data-bs-target', '#deleteModal');
    deleteButton.setAttribute('data-bs-toggle', 'modal');
    deleteIcon.className = 'fa-solid fa-trash';
    deleteButton.appendChild(deleteIcon);
    deleteButton.className = 'btn btn-danger tasksBtn';
    deleteButton.addEventListener('click', function() {
        const taskIdToDelete = task.id; // Au clique, on récupère l'id de la tâche et on le transfert au bouton de la modale
        deleteConfirmButton.setAttribute('data-task-id', taskIdToDelete);
    });

    buttonsCell.appendChild(deleteButton);

    // Bouton marquer comme fait
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

// Méthode qui actualise la liste des tâches ( En paramètre le status ( type de liste sur laquel on est ))
function fetchAndDisplayTasks(status = null) {
    let url = `/tasks`;

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

    // Ajoutez le paramètre status pour savoir sur quel liste nous sommes
    if (status !== null) {
        url += `?status=${status}`;
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

// Les boutons de filtres ( liste undone, liste done, liste all )
const filtersButtons = document.querySelectorAll('.filter-btn');

filtersButtons.forEach(button => {
    button.addEventListener('click', function() {
        taskTable = this.getAttribute('data-status').toString(); // On récupère le data-status et on le transfert à la méthode qui actualise la liste
console.log(taskTable)
        fetchAndDisplayTasks(taskTable);
    });
});

// Boutons delete modale confirmation
const deleteButtons = document.querySelectorAll('.delete-task-button');

deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener('click', function() {
        // On récupère l'id de la tache sur le bouton grâce à this.
        const taskId = this.getAttribute('data-task-id')

        fetch(`/deleteTask/${taskId}`, {
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

// Pour récupérer toutes les tâches
fetchAndDisplayTasks();

module.exports = maFonction;