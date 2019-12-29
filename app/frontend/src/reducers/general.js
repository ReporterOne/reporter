import {UPDATE_LOGIN, UPDATE_REASONS, UPDATE_DATES} from "~/actions/general";
import AuthService from "~/services/auth";


const initialState = {
  reasons: [],
  login: AuthService.is_logged_in(),
  dates: [],
};


export const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_REASONS:
      return {
        ...state,
        reasons: action.reasons
      };
    case UPDATE_LOGIN:
      return {
        ...state,
        login: action.login
      };
    case UPDATE_DATES:
      return {
        ...state,
        dates: action.dates
      };

    default: return state;
  }
};
