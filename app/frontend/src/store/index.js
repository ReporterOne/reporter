import React from 'react';
import { createStore, combineReducers } from 'redux';
import { exampleReducer } from '~/reducers';

export const store = createStore(
  combineReducers({
    example: exampleReducer
  }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store;