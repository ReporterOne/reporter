import {
  UPDATE_DATES,
  UPDATE_DAY,
  UPDATE_RENDERED_MONTH, UPDATE_TODAY, UPDATE_TODAY_DATA,
} from '~/actions/calendar';
import lodash from 'lodash';
import {deepCopy, iteratePrevCurrentNext} from '~/utils/utils';


const initialState = {
  dates: {},
  loading: true,
  renderedMonth: null,
  today: {},
};

const isEqual = (a, b, fields) => {
  console.log(a, b);
  return fields.every((field) => lodash.get(a, field) === lodash.get(b, field));
};

const isDiff = (a, b, fields) => !isEqual(a, b, fields);


export const datesFormatter = (dates, today, isSameMonth) => {
  const dateList = iteratePrevCurrentNext(dates, ({prev, current, next}, index) => {
    const dateObject = {...current, _range_type: 'Single'};
    if (isSameMonth && index < today.getDate() - 1) return dateObject;

    if ((!prev || isDiff(prev?.data, current?.data, ['state', 'reason.name']) &&
      (next && isEqual(next?.data, current?.data, ['state', 'reason.name'])))) {
      dateObject._range_type = 'Start';
    } else if ((prev && isEqual(prev?.data, current?.data, ['state', 'reason.name'])) &&
      (next && isEqual(next?.data, current?.data, ['state', 'reason.name']))) {
      dateObject._range_type = 'Mid';
    } else if ((prev && isEqual(prev?.data, current?.data, ['state', 'reason.name'])) &&
      (!next || isDiff(next?.data, current?.data, ['state', 'reason.name']))) {
      dateObject._range_type = 'End';
    }
    return dateObject;
  });
  const toRet = dateList.reduce((previousValue, currentValue) => {
    previousValue[currentValue.date] = currentValue;
    return previousValue;
  }, {});
  return toRet;
};

const byDate = (a, b) => {
  if (a.date < b.date) return -1;
  if (a.date > b.date) return 1;
  return 0;
};

const reduceDates = (dates, renderedMonth) => {
  const today = new Date();
  return datesFormatter(dates, today, today.getMonth() === renderedMonth);
};

const reduceDay = (dates, key, value, renderedMonth) => {
  const clone = deepCopy(dates);
  clone[key].data = value;
  const datesList = Object.values(clone).sort(byDate);
  return reduceDates(datesList, renderedMonth);
};

export const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DATES:
      return {
        ...state,
        dates: reduceDates(action.dates, state.renderedMonth),
        loading: false,
      };

    case UPDATE_DAY:
      return {
        ...state,
        dates: reduceDay(state.dates, action.key, action.data,
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
