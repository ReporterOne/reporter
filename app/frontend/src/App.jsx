import React, { useState, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux';
import store from './store';

import { GlobalStyle, Container, theme, SVGIcon } from '~/components/common';
import Dashboard from '@/Dashboard';
import Operator from '@/Operator';
import Commander from '@/Commander';
import Menu from '@/Menu.jsx';
import { StylesProvider } from '@material-ui/core/styles';
import styled, { ThemeProvider } from 'styled-components';
import { DrawerMenu, Drawer, DrawerContent } from '~/components/Menu';
import AppContext from './AppContext.jsx';

const App = (props) => {
  const [avatar, changeAvatar] = useState({ manual: false, appearing: 0 });
  const [pageTitle, changePageTitle] = useState("");
  const avatarRef = useRef(null);

  const onDrawerDrag = useCallback(({ data, drawer }) => {
    const movePercent = data.x * 100 / drawer.drawerWidth;
    if (avatar.manual !== true) changeAvatar({ ...avatar, manual: true, appearing: NaN });
    if (avatarRef.current) {
      avatarRef.current.style.transform = `translateY(${100 - movePercent}%)`;
    }
  }, [avatar, avatarRef]);

  const onDrawerToggle = useCallback(({ drawer }) => {
    changeAvatar({ ...avatar, appearing: drawer.isOpen ? 100 : 0 })
  }, [avatar]);


  const onDrawerDragEnd = useCallback(({ drawer, event }) => {
    changeAvatar({ ...avatar, manual: false, appearing: drawer.isOpen ? 100 : 0 })
  }, [avatar]);

  return (
    <Provider store={store}>
      <StylesProvider injectFirst>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={{}}>
            <Router>
              <Drawer onDrag={onDrawerDrag} onToggle={onDrawerToggle}
                onDragEnd={onDrawerDragEnd}>
                <DrawerMenu>
                  <Menu avatar={avatar} avatarRef={avatarRef} />
                </DrawerMenu>
                <DrawerContent
                  titleComponent={() => (
                    <Switch>
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
                    <Route path="/operator">
                      <Operator />
                    </Route>
                    <Route path="/commander">
                      <Commander />
                    </Route>
                    <Route path="/">
                      <Dashboard />
                    </Route>
                  </Switch>
                </DrawerContent>
              </Drawer>
            </Router>
          </AppContext.Provider>
        </ThemeProvider>
      </StylesProvider>
    </Provider>
  );
}

export default App;
