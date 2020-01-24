import {UPDATE_DATES} from '~/actions/calendar';


const initialState = {
  dates: [],
  datesLoading:true
};


export const calendarReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_DATES:
      return {
        ...state,
        dates: action.dates,
        datesLoading: false,
      };

    default: return state;
  }
};
