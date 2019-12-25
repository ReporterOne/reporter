import {UPDATE_REASONS} from "~/actions/general";


const initialState = {
  reasons: []
};


export const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_REASONS:
      return {
        ...state,
        reasons: action.reasons
      };

    default: return state;
  }
};
