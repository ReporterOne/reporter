import React from 'react';
import ReactDOM from 'react-dom';
import 'regenerator-runtime/runtime';

import App from './App.jsx';

const renderApp = Component => {
  const container = document.getElementById('root');

  ReactDOM.render(<Component/>, container)
};

renderApp(App);


if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    const app = require('./App.jsx').default;
    renderApp(app);
  })
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration);
        registration.pushManager.subscribe({userVisibleOnly: true});
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }
