import {
  UPDATE_CURRENT_USER,
  UPDATE_SUBJECTS,
  UPDATE_USERS,
} from '~/actions/users';
import AuthService from '~/services/auth';


const initialState = {
  me: AuthService.getUserId(),
  all: [],
  subjects: [],
  loading: true,
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
        all: action.users,
        loading: false,
      };
    case UPDATE_SUBJECTS:
      return {
        ...state,
        subjects: action.subjects,
      };

    default: return state;
  }
};
