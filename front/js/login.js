const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const token = document.getElementById('token').value;

    fetch('/verifyToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('token', data.token);
            window.location.href = '/';
        } else {
            alert('Token invalide. Veuillez réessayer.');
        }
    })
    .catch(error => {
        console.error('Erreur lors de la validation du token :', error);
    });
});
