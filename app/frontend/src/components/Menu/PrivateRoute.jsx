import React from 'react';
import {Route, Redirect} from 'react-router-dom';

import AuthService from '~/services/auth';
import {useSelector} from "react-redux";

export const PrivateRoute = ({component: Component, ...rest}) => {
  const isLoggedIn = useSelector(state => state.general.login);

  return (
    <Route {...rest} render={props => {
      if (!isLoggedIn) {
        // not logged in so redirect to login page with the return url
        return <Redirect
          to={{pathname: '/entrance', state: {from: props.location}}}/>
      }

      // authorised so return component
      return <Component {...props} />
    }}/>
  )
};

export default PrivateRoute;
