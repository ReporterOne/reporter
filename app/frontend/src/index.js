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