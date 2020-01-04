import {createStore, combineReducers} from 'redux';
import {generalReducer, usersReducer} from '~/reducers';

export const mainReducer = combineReducers({
  general: generalReducer,
  users: usersReducer,
});

export const store = createStore(mainReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
