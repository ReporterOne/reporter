import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import UsersService from '~/services/users';
import {updateCurrentUser} from '~/actions/users';
import {logoutIfNoPermission} from '~/hooks/utils';


export const fetchCurrentUser = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.general.login);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await logoutIfNoPermission(async () => {
          const currentUser = await UsersService.getCurrentUser();
          dispatch(updateCurrentUser(currentUser));
        }, dispatch);
      }
    })();
  }, [isLoggedIn, dispatch]);
};
