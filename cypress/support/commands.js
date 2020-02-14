// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


Cypress.Commands.add("clearServiceWorkerCache", () => {
  return window.caches.keys().then(function (cacheNames) {
    return Promise.all(
      cacheNames.map(function (cacheName) {
        return window.caches.delete(cacheName);
      })
    );
  })
});

Cypress.Commands.add("clearServiceWorker", () => {
  window.navigator.serviceWorker.getRegistrations()
    .then(function (registrations) {
      return Promise.map(registrations, function (registration) {
        return registration.unregister()
      })
    });
});

Cypress.Commands.add("noSWVisit", (url) => {
  cy.visit(url, {
    onBeforeLoad (win) {
      delete win.navigator.__proto__.serviceWorker
    }
  });
});
