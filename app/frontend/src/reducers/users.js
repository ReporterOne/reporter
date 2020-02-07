import {UPDATE_CURRENT_USER, UPDATE_USERS} from '~/actions/users';
import AuthService from "~/services/auth";


const initialState = {
  me: AuthService.getUserId(),
  all: []
};


export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CURRENT_USER:
      return {
        ...state,
        me: action.user,
      };
    case UPDATE_USERS:
      return {
        ...state,
        all: action.users
      };

    default: return state;
  }
};
