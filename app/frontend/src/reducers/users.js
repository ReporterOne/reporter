import {UPDATE_CURRENT_USER} from "~/actions/users";


const initialState = {
  me: null
};


export const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CURRENT_USER:
      return {
        ...state,
        me: action.user
      };

    default: return state;
  }
};
