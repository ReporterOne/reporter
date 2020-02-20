import React from 'react';
import {useSelector} from "react-redux";
import _ from "lodash";



export const useMe = () => {
  return useSelector((state) => _.find(state.users.all, {id: state.users.me}) ?? {});
};

