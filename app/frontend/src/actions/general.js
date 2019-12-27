export const UPDATE_REASONS = "UPDATE_REASONS";
export const UPDATE_LOGIN = "UPDATE_LOGIN";

export const updateReasons = (reasons) => ({
  type: UPDATE_REASONS,
  reasons
});

export const updateLogin = (login) => ({
  type: UPDATE_LOGIN,
  login
});
