import React from 'react';
import ReactDOM from 'react-dom';
import {Workbox} from 'workbox-window';
import 'regenerator-runtime/runtime';

import App from './App.jsx';

const renderApp = (Component) => {
  const container = document.getElementById('root');

  ReactDOM.render(<Component/>, container);
};

renderApp(App);


if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js');
  // Add an event listener to detect when the registered
  // service worker has installed but is waiting to activate.
  wb.addEventListener('waiting', (event) => {
    // Assuming the user accepted the update, set up a listener
    // that will reload the page as soon as the previously waiting
    // service worker has taken control.
    wb.addEventListener('controlling', (event) => {
      window.location.reload();
    });

    // Send a message telling the service worker to skip waiting.
    // This will trigger the `controlling` event handler above.
    // Note: for this to work, you have to add a message
    // listener in your service worker. See below.
    wb.messageSW({type: 'SKIP_WAITING'});
  });

  wb.register();
}

// window.addEventListener('beforeinstallprompt', (e) => {
//   // Stash the event so it can be triggered later.
//   // Update UI notify the user they can add to home screen
//   showInstallPromotion();
//   console.log('popup shown')
// });

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    const app = require('./App.jsx').default;
    renderApp(app);
  });
}
