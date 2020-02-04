import React from 'react';
import {Router} from 'react-router-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {render, fireEvent} from '@testing-library/react';
import {createMemoryHistory} from 'history'


import {mainReducer} from '~/store';

export function renderWithRedux(ui,
                         {
                           initialState,
                           store = createStore(mainReducer, initialState),
                           history = createMemoryHistory()
                         } = {},
                         renderFn = render) {
  const obj = {
    ...renderFn(<Router history={history}><Provider store={store}>{ui}</Provider></Router>),
    store,
    history
  };
  obj.rerenderWithRedux = (el) => renderWithRedux(el, {history, store}, obj.rerender);
  return obj;
}
