import {UPDATE_DATES} from '~/actions/calendar';


const initialState = {
  dates: [],
  loading: true,
};


export const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DATES:
      return {
        ...state,
        dates: action.dates,
        loading: false,
      };

    default: return state;
  }
};
