import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import DateStatusService from '~/services/date_datas';
import {updateReasons} from '~/actions/general';
import {updateDates} from '~/actions/calendar';
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

export const fetchDateDate = ({start, end, userId}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.general.login);

  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await logoutIfNoPermission(async () => {
          const dateData = await DateStatusService.getDateData({start, end, userId});
          dispatch(updateDates(dateData));
        }, dispatch);
      }
    })();
  }, [isLoggedIn, dispatch, start, end, userId]);
};

