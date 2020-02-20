import {UPDATE_MADORS} from "~/actions/madors";

const initialState = {
  all: [],
};


export const madorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MADORS:
      return {
        ...state,
        all: action.madors
      };

    default: return state;
  }
};
