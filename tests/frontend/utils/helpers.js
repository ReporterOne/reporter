import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import { render, fireEvent } from '@testing-library/react';


import {mainReducer} from '~/store';

export function renderWithRedux(ui, {initialState, store = createStore(mainReducer, initialState)} = {}) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    // adding `store` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    store,
  };
};
