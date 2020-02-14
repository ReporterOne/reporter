import {
  NEW_NOTIFICATION, POP_NOTIFICATION,
  UPDATE_LOGIN,
  UPDATE_ONLINE,
  UPDATE_REASONS,
} from '~/actions/general';
import AuthService from '~/services/auth';


const initialState = {
  reasons: [],
  login: AuthService.isLoggedIn(),
  online: navigator.onLine,
  notifications: [],
};


export const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_REASONS:
      return {
        ...state,
        reasons: action.reasons,
      };
    case UPDATE_LOGIN:
      return {
        ...state,
        login: action.login,
      };
    case UPDATE_ONLINE:
      return {
        ...state,
        online: action.state,
      };
    case NEW_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.notification],
      };
    case POP_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.slice(1),
      };

    default: return state;
  }
};
