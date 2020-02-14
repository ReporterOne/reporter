import React, {useState, useCallback, useRef, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {ThemeProvider} from 'styled-components';
import {ThemeProvider as MUIThemeProvider} from '@material-ui/styles';
import {StylesProvider, createMuiTheme} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import AddToHomescreen from 'react-add-to-homescreen';

import Menu from '@/Menu';
import Entrance from '@/Entrance';
import Operator from '@/Operator';
import Dashboard from '@/Dashboard';
import Hierarchy from '@/Hierarchy';
import Commander from '@/Commander';

import {GlobalStyle, theme} from '~/components/common';
import {DrawerMenu, Drawer, DrawerContent} from '~/components/Menu';
import PrivateRoute from '~/components/Menu/PrivateRoute';

import store from './store';
import {fetchAllowedUsers} from '~/actions/users';
import {fetchMyToday} from '~/actions/calendar';
import {fetchReasons, popNotification, updateOnline} from '~/actions/general';

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;


export const App = (props) => {
  const dispatch = useDispatch();
  const [avatar, changeAvatar] = useState({manual: false, appearing: 0});
  const avatarRef = useRef(null);
  const isLoggedIn = useSelector((state) => state.general.login);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchReasons());
      dispatch(fetchMyToday());
      dispatch(fetchAllowedUsers());
    }
  }, [isLoggedIn, dispatch]);

  const updateOnlineState = useCallback(() => {
    dispatch(updateOnline(navigator.onLine));
  }, [dispatch]);
  useEffect(() => {
    window.addEventListener('online', updateOnlineState);
    window.addEventListener('offline', updateOnlineState);
    return () => {
      window.removeEventListener('online', updateOnlineState);
      window.removeEventListener('offline', updateOnlineState);
    };
  }, [updateOnlineState]);

  const onDrawerDrag = useCallback(({data, drawer}) => {
    const movePercent = data.x * 100 / drawer.drawerWidth;
    if (avatar.manual !== true) {
      changeAvatar({
        ...avatar,
        manual: true,
        appearing: NaN,
      });
    }
    if (avatarRef.current) {
      avatarRef.current.style.transform = `translateY(${100 - movePercent}%)`;
    }
  }, [avatar, avatarRef]);

  const onDrawerToggle = useCallback(({drawer}) => {
    changeAvatar({...avatar, appearing: drawer.isOpen ? 100 : 0});
  }, [avatar]);


  const onDrawerDragEnd = useCallback(({drawer, event}) => {
    changeAvatar({
      ...avatar,
      manual: false,
      appearing: drawer.isOpen ? 100 : 0,
    });
  }, [avatar]);

  return (
    <Switch>
      <Route path="/entrance" component={Entrance}/>
      <Route path="/" render={() => (
        <Drawer onDrag={onDrawerDrag} onToggle={onDrawerToggle}
          onDragEnd={onDrawerDragEnd}>
          <DrawerMenu>
            <Menu avatar={avatar} avatarRef={avatarRef}/>
          </DrawerMenu>
          <DrawerContent
            titleComponent={() => (
              <Switch>
                <Route path="/hierarchy">
                  Hierarchy
                </Route>
                <Route path="/operator">
                  Operator Space
                </Route>
                <Route path="/commander">
                  Commander Space
                </Route>
                <Route path="/">
                </Route>
              </Switch>
            )}>
            <Switch>
              <PrivateRoute path="/hierarchy" component={Hierarchy}
                allowedPermissions={['admin']}/>
              <PrivateRoute path="/operator" component={Operator}
                allowedPermissions={['admin', 'reporter']}/>
              <PrivateRoute path="/commander" component={Commander}
                allowedPermissions={['admin', 'commander']}/>
              <PrivateRoute path="/" component={Dashboard}/>
            </Switch>
          </DrawerContent>
        </Drawer>

      )}/>
    </Switch>
  );
};

const SNACKBAR_TIMEOUT = 6000;

export const StyledApp = (props) => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.general.notifications);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notifications.length === 0) return;
    setNotification(notifications[0]);
  }, [notifications]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setNotification(null);
    dispatch(popNotification());
  };

  return (
    <StylesProvider injectFirst>
      <MUIThemeProvider theme={createMuiTheme(theme)}>
        <GlobalStyle/>
        <ThemeProvider theme={theme}>
          <App/>
          <Snackbar open={notification !== null}
            autoHideDuration={notification?.timeout ?? SNACKBAR_TIMEOUT}
            onClose={handleClose}>
            <Alert onClose={handleClose}
              severity={notification?.severity ?? 'error'}>
              {notification?.message}
            </Alert>
          </Snackbar>
        </ThemeProvider>
      </MUIThemeProvider>
    </StylesProvider>
  );
};

export const ProvidedApp = (props) => {
  return (
    <Provider store={store}>
      <Router>
        <StyledApp/>
        <AddToHomescreen/>
      </Router>
    </Provider>
  );
};

export default ProvidedApp;
