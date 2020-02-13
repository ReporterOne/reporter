import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';

import {generalReducer, usersReducer, calendarReducer} from '~/reducers';

export const mainReducer = combineReducers({
  general: generalReducer,
  users: usersReducer,
  calendar: calendarReducer,
});

export const store = createStore(mainReducer,
    compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__(),
    )
);

export default store;
