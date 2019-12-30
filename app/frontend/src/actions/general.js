export const UPDATE_REASONS = "UPDATE_REASONS";
export const UPDATE_LOGIN = "UPDATE_LOGIN";
export const UPDATE_DATES = "UPDATE_DATES";

export const updateReasons = (reasons) => ({
  type: UPDATE_REASONS,
  reasons
});

export const updateLogin = (login) => ({
  type: UPDATE_LOGIN,
  login
});

export const updateDates = (dates) => ({
  type: UPDATE_DATES,
  dates
});
