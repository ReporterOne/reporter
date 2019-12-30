import {updateLogin} from "~/actions/general";
import AuthService, {PermissionsError} from "~/services/auth";

export const logoutIfNoPermission = async (callback, dispatch) => {
  try {
    await callback();
  } catch (e) {
    if (e instanceof PermissionsError) {
      await AuthService.logout();
      dispatch(updateLogin(false));
    } else {
      throw e;
    }
  }
};
