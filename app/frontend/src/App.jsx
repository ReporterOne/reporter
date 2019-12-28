import React, {useState, useCallback, useRef, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import {Provider} from 'react-redux';
import {ThemeProvider} from 'styled-components';
import {ThemeProvider as MUIThemeProvider} from '@material-ui/styles';
import {StylesProvider, createMuiTheme} from '@material-ui/core/styles';

import Menu from '@/Menu';
import Entrance from "@/Entrance";
import Operator from '@/Operator';
import Dashboard from '@/Dashboard';
import Hierarchy from "@/Hierarchy";
import Commander from '@/Commander';

import {GlobalStyle, theme} from '~/components/common';
import {DrawerMenu, Drawer, DrawerContent} from '~/components/Menu';
import PrivateRoute from "~/components/Menu/PrivateRoute";

import {fetchReasons} from "~/hooks/date_datas";
import {fetchCurrentUser} from "~/hooks/users";
import store from './store';

const ProvidedApp = (props) => {
  const [avatar, changeAvatar] = useState({manual: false, appearing: 0});
  const avatarRef = useRef(null);

  fetchReasons();
  fetchCurrentUser();

  const onDrawerDrag = useCallback(({data, drawer}) => {
    const movePercent = data.x * 100 / drawer.drawerWidth;
    if (avatar.manual !== true) changeAvatar({
      ...avatar,
      manual: true,
      appearing: NaN
    });
    if (avatarRef.current) {
      avatarRef.current.style.transform = `translateY(${100 - movePercent}%)`;
    }
  }, [avatar, avatarRef]);

  const onDrawerToggle = useCallback(({drawer}) => {
    changeAvatar({...avatar, appearing: drawer.isOpen ? 100 : 0})
  }, [avatar]);


  const onDrawerDragEnd = useCallback(({drawer, event}) => {
    changeAvatar({
      ...avatar,
      manual: false,
      appearing: drawer.isOpen ? 100 : 0
    })
  }, [avatar]);

  return (
    <Router>
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
                <PrivateRoute path="/hierarchy" component={Hierarchy}/>
                <PrivateRoute path="/operator" component={Operator}/>
                <PrivateRoute path="/commander" component={Commander}/>
                <PrivateRoute path="/" component={Dashboard}/>
              </Switch>
            </DrawerContent>
          </Drawer>

        )}/>
      </Switch>
    </Router>
  );
};

const App = (props) => {
  return (
    <Provider store={store}>
      <StylesProvider injectFirst>
        <MUIThemeProvider theme={createMuiTheme(theme)}>
          <GlobalStyle/>
          <ThemeProvider theme={theme}>
            <ProvidedApp/>
          </ThemeProvider>
        </MUIThemeProvider>
      </StylesProvider>
    </Provider>
  )
};

export default App;
