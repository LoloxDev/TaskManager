module.exports = {
    mutate: ['server/app/controllers/authController.js'], // Les fichiers à muter
    testRunner: 'jest', // Utiliser le runner Jest
    reporters: ['progress', 'clear-text', 'html'], // Reporters de résultats
    coverageAnalysis: 'perTest', // Analyse de la couverture
  };