import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import DateStatusService from '~/services/date_datas';
import {updateReasons, updateDates} from '~/actions/general';
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

export const fetchDateDate = (params) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.general.login);

  const start = params.start;
  const end = params.end;
  const userId = params.userId;
  useEffect(() => {
    (async () => {
      if (isLoggedIn) {
        await logoutIfNoPermission(async () => {
          // console.log({start,end})
          const dateData = await DateStatusService.getDateData({start, end, userId});
          // const dateData = "aa"
          dispatch(updateDates(dateData));
        }, dispatch);
      }
    })();
  }, [isLoggedIn, dispatch, params]);
};

