import {createStore, combineReducers} from 'redux';
import {generalReducer, usersReducer} from '~/reducers';

export const store = createStore(
    combineReducers({
      general: generalReducer,
      users: usersReducer,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
