import React from 'react';
import { Router } from 'react-router-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history'


import {mainReducer} from '~/store';

export function renderWithRedux(ui, {initialState, store = createStore(mainReducer, initialState)} = {}, history = createMemoryHistory()) {
  return {
    ...render(<Router history={history}><Provider store={store}>{ui}</Provider></Router>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
};
