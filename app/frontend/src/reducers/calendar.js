import {
  UPDATE_DATES,
  UPDATE_DAY,
  UPDATE_RENDERED_MONTH, UPDATE_TODAY, UPDATE_TODAY_DATA,
} from '~/actions/calendar';
import lodash from 'lodash';
import {deepCopy} from '~/utils/utils';


const initialState = {
  dates: {},
  loading: true,
  renderedMonth: null,
  today: {},
};

const byDate = (a, b) => {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return 0;
};

const reduceDates = (dates) => {
  return dates.reduce((previousValue, currentValue) => {
    previousValue[currentValue.date] = currentValue;
    return previousValue;
  }, {});
};

const reduceDay = (dates, key, value, userId) => {
  const clone = deepCopy(dates);
  const data = lodash.reject(clone[key].data, {user_id: userId}, []);
  if (value) data.push(value);
  clone[key].data = data;
  const datesList = Object.values(clone).sort(byDate);
  return reduceDates(datesList);
};

const mergeData = (obj, src) => {
  if (!obj) return src;
  const clone = deepCopy(obj);
  clone.data = lodash.unionBy(clone.data ?? [], src.data ?? [], 'user_id');
  return clone;
};

export const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DATES:
      return {
        ...state,
        dates: lodash.mergeWith(state.dates, reduceDates(action.dates), mergeData),
        loading: false,
      };

    case UPDATE_DAY:
      return {
        ...state,
        dates: reduceDay(state.dates, action.key, action.data, action.userId,
            state.renderedMonth),
      };

    case UPDATE_RENDERED_MONTH:
      return {
        ...state,
        renderedMonth: action.month,
      };

    case UPDATE_TODAY:
      return {
        ...state,
        today: action.data,
      };
    case UPDATE_TODAY_DATA:
      return {
        ...state,
        today: {
          ...state.today,
          data: action.data,
        },
      };

    default: return state;
  }
};
