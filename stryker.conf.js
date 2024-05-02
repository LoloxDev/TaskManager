module.exports = {
    mutate: [
      'server/app/controllers/authController.js',
      'server/app/controllers/taskController.js',
  ],
    testRunner: 'jest',
    reporters: ['progress', 'clear-text', 'html'],
    coverageAnalysis: 'perTest',
  };