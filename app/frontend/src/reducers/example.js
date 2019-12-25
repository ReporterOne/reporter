import { ACTION1, exampleAction } from '~/actions/example';


const initialState = {
  lol: 'hey'
};

export const exampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION1:
      return {
        ...state,
        lol: 'triggered'
      }

    default: return state;
  }
};
