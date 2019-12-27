import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import DateStatusService from "~/services/date_datas";
import {updateReasons} from "~/actions/general";
import {logoutIfNoPermission} from "~/hooks/utils";


export const fetchReasons = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.general.login);

  useEffect(() => {
    (async () => {
      if(isLoggedIn) {
        await logoutIfNoPermission(async () => {
          const reasons = await DateStatusService.getReasons();
          dispatch(updateReasons(reasons));
        }, dispatch);
      }
    })()
  }, [isLoggedIn, dispatch]);
};
