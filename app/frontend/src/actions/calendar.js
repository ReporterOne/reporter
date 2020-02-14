import UsersService from '~/services/users';
import {logoutIfNoPermission} from '~/actions/general';
import lodash from 'lodash';
import {formatDate} from '~/components/Calendar/components/utils';
import DateStatusService from '~/services/date_datas';

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
  userId,
});

export const updateToday = (data) => ({
  type: UPDATE_TODAY,
  data: data,
});

export const updateTodayData = (data) => ({
  type: UPDATE_TODAY_DATA,
  data: data,
});


export const fetchMyToday = () => async (dispatch) => {
  await logoutIfNoPermission(async () => {
    const dateData = await UsersService.getMyToday();
    dispatch(updateToday(dateData));
  }, dispatch);
};


export const fetchDatesOf = (usersId, start, end) => async (dispatch) => {
  await logoutIfNoPermission(async () => {
    const data = await DateStatusService.getDateData({start, end, usersId});
    dispatch(updateDates(data));
  }, dispatch);
};

export const fetchMyDates = (start, end) => async (dispatch) => {
  const today = new Date();
  await logoutIfNoPermission(async () => {
    const dateData = await UsersService.getMyCalendar({start, end});
    dispatch(updateDates(dateData));
    const todayData = lodash.find(dateData, {date: formatDate(today)});
    if (todayData) {
      dispatch(updateToday(todayData));
    }
  }, dispatch);
};

export const deleteDateOf = (userId, date) => async (dispatch) => {
  await DateStatusService.deleteDate({userId: userId, date: new Date(date)});
  dispatch(updateDay(date, null, userId));
};

export const setDateStatus = ({userId, status, start, reason=undefined}) => async (dispatch) => {
  const data = await UsersService.setDate({
    userId: userId,
    start: start,
    state: status,
    reason: reason,
  });
  const key = Object.keys(data)[0];
  const value = Object.values(data)[0];
  dispatch(updateDay(key, value, userId));
};
