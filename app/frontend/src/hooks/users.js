import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import UsersService from '~/services/users';
import {updateUsers} from '~/actions/users';
import {logoutIfNoPermission} from '~/hooks/utils';


export const fetchAllowedUsers = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.general.login);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await logoutIfNoPermission(async () => {
          const users = await UsersService.getAllowedUsers();
          dispatch(updateUsers(users));
        }, dispatch);
      }
    })();
  }, [isLoggedIn, dispatch]);
};
