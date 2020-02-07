import {UPDATE_LOGIN, UPDATE_REASONS} from '~/actions/general';
import AuthService from '~/services/auth';


const initialState = {
  reasons: [],
  login: AuthService.isLoggedIn(),
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

    default: return state;
  }
};
