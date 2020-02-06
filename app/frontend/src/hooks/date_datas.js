import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import DateStatusService from '~/services/date_datas';
import UsersService from '~/services/users';
import {updateReasons} from '~/actions/general';
import {updateDates, updateToday} from '~/actions/calendar';
import {logoutIfNoPermission} from '~/hooks/utils';


export const fetchReasons = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.general.login);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await logoutIfNoPermission(async () => {
          const reasons = await DateStatusService.getReasons();
          dispatch(updateReasons(reasons));
        }, dispatch);
      }
    })();
  }, [isLoggedIn, dispatch]);
};

export const fetchDateDate = ({start, end}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.general.login);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await logoutIfNoPermission(async () => {
          const dateData = await UsersService.getMyCalendar({start, end});
          dispatch(updateDates(dateData));
        }, dispatch);
      }
    })();
  }, [isLoggedIn, dispatch, start, end]);
};

export const fetchMyToday = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.general.login);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await logoutIfNoPermission(async () => {
          const dateData = await UsersService.getMyToday();
          dispatch(updateToday(dateData));
        }, dispatch);
      }
    })();
  }, [isLoggedIn, dispatch]);
};
