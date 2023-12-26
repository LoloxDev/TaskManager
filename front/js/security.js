const registerForm = document.getElementById('registerForm'); // Formulaire d'inscription
//const submitButton = document.getElementById('submitButton'); // ou remplace avec l'ID correct de ton bouton submit
const loginForm = document.getElementById('loginForm');
//const loginForm = document.getElementById('loginButton'); // ou remplace avec l'ID correct de ton bouton submit

//import { stylizeButton } from './script.js';

// Pour le formulaire d'inscription
if (registerForm){
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const postData = {
            firstName: registerForm.elements.firstName.value,
            lastName: registerForm.elements.lastName.value,
            email: registerForm.elements.email.value,
            password: registerForm.elements.password.value
        }

        fetch(`/addUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirigez l'utilisateur vers la page de connexion après une inscription réussie
                window.location.href = '/login';
            }
        })
        .catch(error => {
            console.error('Erreur lors de l\'ajout de l\'utilisateur ou récupération des données :', error);
        });
    });
}

