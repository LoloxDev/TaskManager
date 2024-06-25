function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const successMessage = getQueryParam('success');
if (successMessage === 'true') {
    alert('Compte créé avec succès !');
}