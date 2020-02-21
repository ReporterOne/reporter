import DateStatusService from '~/services/date_datas';
import AuthService, {PermissionsError} from '~/services/auth';

export const UPDATE_REASONS = 'UPDATE_REASONS';
export const UPDATE_LOGIN = 'UPDATE_LOGIN';
export const UPDATE_DATES = 'UPDATE_DATES';
export const UPDATE_ONLINE = 'UPDATE_ONLINE';
export const NEW_NOTIFICATION = 'NEW_NOTIFICATION';
export const POP_NOTIFICATION = 'POP_NOTIFICATION';
export const RELOAD = 'RELOAD';


export const updateReasons = (reasons) => ({
  type: UPDATE_REASONS,
  reasons,
});

export const updateLogin = (login) => ({
  type: UPDATE_LOGIN,
  login,
});

export const updateOnline = (state) => ({
  type: UPDATE_ONLINE,
  state: state,
});

export const newNotification = (notification) => ({
  type: NEW_NOTIFICATION,
  notification: notification,
});

export const popNotification = () => ({
  type: POP_NOTIFICATION,
});

export const reload = () => ({
  type: RELOAD
});

export const logout = () => async (dispatch) => {
  await AuthService.logout();
  dispatch(updateLogin(false));
};

export const logoutIfNoPermission = async (callback, dispatch) => {
  try {
    return await callback();
  } catch (e) {
    dispatch(newNotification({message: e?.response?.data?.detail ?? e.message}));
    if (e instanceof PermissionsError) {
      dispatch(logout());
    } else {
      throw e;
    }
  }
};


export const fetchReasons = () => async (dispatch) => {
  await logoutIfNoPermission(async () => {
    const reasons = await DateStatusService.getReasons();
    dispatch(updateReasons(reasons));
  }, dispatch);
};

