export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';

export const updateCurrentUser = (user) => ({
  type: UPDATE_CURRENT_USER,
  user,
});
