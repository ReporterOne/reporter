import React, { useState, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { GlobalStyle, Container, theme, SVGIcon } from '~/components/common';
import Dashboard from '@/Dashboard';
import Commander from '@/Commander';
import { StylesProvider } from '@material-ui/core/styles';
import styled, { ThemeProvider } from 'styled-components';
import { DrawerMenu, Drawer, DrawerContent } from '~/components/Menu';
import AppContext from './AppContext.jsx';
import Avatar from '~/components/Avatar/Avatar.jsx';
import Option from '~/components/Menu/MenuOption.jsx';
import dashboardIconUrl from '~/assets/dashboard.svg';
import commanderIconUrl from '~/assets/whistle.svg';

const OptionsContainer = styled(Container)`
  align-items: center;
  padding: 25px 0 10px 0;
`;

const Separator = styled.div`
  height: 2px;
  width: 70%;
  background-color: #888888;
  margin: 15px 0;
`;

const Spacer = styled.div`
  flex: 1;
`;

const App = (props) => {
  const [avatar, changeAvatar] = useState({ manual: false, appearing: 0 });
  const avatarRef = useRef(null);

  const onDrawerDrag = useCallback(({ data, drawer }) => {
    const movePercent = data.x * 100 / drawer.drawerWidth;
    if (avatar.manual !== true) changeAvatar({ ...avatar, manual: true });
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
    <>
      <StylesProvider injectFirst>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={{}}>
            <Router>
              <Drawer onDrag={onDrawerDrag} onToggle={onDrawerToggle}
                onDragEnd={onDrawerDragEnd}>
                <DrawerMenu>
                  <OptionsContainer stretched>
                    <Avatar appearing={avatar.appearing} manual={avatar.manual} innerRef={avatarRef} />
                    <Separator />
                    <Option selected path="/">
                      <SVGIcon src={dashboardIconUrl} size={20} />
                    </Option>
                    <Option path="/commander">
                      <SVGIcon src={commanderIconUrl} size={20} />
                    </Option>
                    <Spacer />
                    <Separator />
                    <Container>
                    </Container>
                  </OptionsContainer>
                </DrawerMenu>
                <DrawerContent>
                  <Switch>
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
    </>
  );
}

export default App;
