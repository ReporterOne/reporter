import DateStatusService from "~/services/date_datas";
import AuthService, {PermissionsError} from "~/services/auth";

export const UPDATE_REASONS = 'UPDATE_REASONS';
export const UPDATE_LOGIN = 'UPDATE_LOGIN';
export const UPDATE_DATES = 'UPDATE_DATES';
export const UPDATE_ONLINE = 'UPDATE_ONLINE';

export const updateReasons = (reasons) => ({
  type: UPDATE_REASONS,
  reasons,
});

export const updateLogin = (login) => ({
  type: UPDATE_LOGIN,
  login,
});

export const updateDates = (dates) => ({
  type: UPDATE_DATES,
  dates,
});

export const updateOnline = (state) => ({
  type: UPDATE_ONLINE,
  state: state
});

export const logout = () => async dispatch => {
  await AuthService.logout();
  dispatch(updateLogin(false));
};

export const logoutIfNoPermission = async (callback, dispatch) => {
  try {
    return await callback();
  } catch (e) {
    if (e instanceof PermissionsError) {
      dispatch(logout());
    } else {
      throw e;
    }
  }
};


export const fetchReasons = () => async dispatch => {
  await logoutIfNoPermission(async () => {
    const reasons = await DateStatusService.getReasons();
    dispatch(updateReasons(reasons));
  }, dispatch);
};

