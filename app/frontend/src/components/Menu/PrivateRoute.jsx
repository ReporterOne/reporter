import React from 'react';
import {Route, Redirect} from 'react-router-dom';

import {useSelector} from 'react-redux';
import lodash from "lodash";

export const isAllowed = (permissions, allowedPermissions) => {
  return permissions === undefined || allowedPermissions.length === 0 || permissions.some(permission => allowedPermissions.includes(permission.type));
};

export const PrivateRoute = ({component: Component, allowedPermissions = [], ...rest}) => {
  const isLoggedIn = useSelector((state) => state.general.login);
  const {permissions = undefined} = useSelector((state) => lodash.find(state.users.all, {id: state.users.me}) ?? {});

  return (
    <Route {...rest} render={(props) => {
      if (!isLoggedIn) {
        // not logged in so redirect to login page with the return url
        return <Redirect
          to={{pathname: '/entrance', state: {from: props.location}}}/>;
      }

      if(!isAllowed(permissions, allowedPermissions)) {
        return <Redirect
          to={{pathname: '/', state: {from: props.location}}}/>;
      }

      // authorised so return component
      return <Component {...props} />;
    }}/>
  );
};

export default PrivateRoute;
