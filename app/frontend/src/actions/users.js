import {logoutIfNoPermission} from '~/actions/general';
import UsersService from '~/services/users';

export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';
export const UPDATE_USERS = 'UPDATE_USERS';
export const UPDATE_SUBJECTS = 'UPDATE_SUBJECTS';


export const updateCurrentUser = (user) => ({
  type: UPDATE_CURRENT_USER,
  user,
});


export const updateUsers = (users) => ({
  type: UPDATE_USERS,
  users,
});


export const updateSubjects = (subjects) => ({
  type: UPDATE_SUBJECTS,
  subjects,
});


export const fetchAllowedUsers = () => async (dispatch) => {
  await logoutIfNoPermission(async () => {
    const users = await UsersService.getAllowedUsers();
    dispatch(updateUsers(users));
  }, dispatch);
};


export const fetchSubjects = () => async (dispatch) => {
  await logoutIfNoPermission(async () => {
    const subjects = await UsersService.getMySubjects();
    dispatch(updateSubjects(subjects));
  }, dispatch);
};
