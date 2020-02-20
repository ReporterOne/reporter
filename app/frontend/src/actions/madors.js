import MadorsService from "~/services/madors";
import {logoutIfNoPermission} from "~/actions/general";

export const UPDATE_MADORS = 'UPDATE_MADORS';

export const updateMadors = (madors) => ({
  type: UPDATE_MADORS,
  madors,
});


export const fetchMadors = () => async (dispatch) => {
  await logoutIfNoPermission(async() => {
    const madors = await MadorsService.getMadors();
    dispatch(updateMadors(madors));
  }, dispatch);
};
