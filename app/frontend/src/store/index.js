import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';


import {generalReducer, usersReducer, calendarReducer} from '~/reducers';
import {madorsReducer} from '~/reducers/madors';

export const mainReducer = combineReducers({
  general: generalReducer,
  users: usersReducer,
  calendar: calendarReducer,
  madors: madorsReducer,
});

export const store = createStore(mainReducer,
    composeWithDevTools(
        applyMiddleware(thunk),
    ),
);

export default store;
