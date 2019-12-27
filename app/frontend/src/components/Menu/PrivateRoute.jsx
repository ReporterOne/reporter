import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import AuthService from '~/services/auth';

export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        if (!AuthService.is_logged_in()) {
            // not logged in so redirect to login page with the return url
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }

        // authorised so return component
        return <Component {...props} />
    }} />
);

export default PrivateRoute;
