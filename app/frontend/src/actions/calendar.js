export const UPDATE_DATES = 'UPDATE_DATES';
export const UPDATE_DAY = 'UPDATE_DAY';
export const UPDATE_RENDERED_MONTH = 'UPDATE_RENDERED_MONTH';
export const UPDATE_TODAY = 'UPDATE_TODAY';
export const UPDATE_TODAY_DATA = 'UPDATE_TODAY_DATA';


export const updateDates = (dates) => ({
  type: UPDATE_DATES,
  dates,
});

export const updateRenderedMonth = (month) => ({
  type: UPDATE_RENDERED_MONTH,
  month,
});

export const updateDay = (key, data, userId) => ({
  type: UPDATE_DAY,
  key,
  data,
  userId
});

export const updateToday = (data) => ({
  type: UPDATE_TODAY,
  data: data,
});

export const updateTodayData = (data) => ({
  type: UPDATE_TODAY_DATA,
  data: data,
});
