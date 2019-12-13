import React, { useState, useCallback, useRef } from 'react';
import { StylesProvider } from '@material-ui/core/styles';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { DrawerMenu, Drawer, DrawerContent } from '~/components/Menu';
import { GlobalStyle, theme, Container } from '~/components/common';
import { Dashboard } from '~/screens';
import AppContext from './AppContext.jsx';
import Avatar from './components/Avatar/Avatar.jsx';
import Option from './components/Menu/MenuOption.jsx';

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
    if(avatar.manual !== true) changeAvatar({ ...avatar, manual: true });
    if(avatarRef.current) {
      avatarRef.current.style.transform = `translateY(${100 - movePercent}%)`;
    }
  }, [avatar, avatarRef]);

  const onDrawerToggle = useCallback(({ drawer }) => {
    changeAvatar({ ...avatar, appearing: drawer.isOpen? 100 : 0})
  }, [avatar]);


  const onDrawerDragEnd = useCallback(({drawer, event}) => {
    changeAvatar({ ...avatar, manual: false, appearing: drawer.isOpen? 100 : 0})
  }, [avatar]);

  return (
    <>
      <StylesProvider injectFirst>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <AppContext.Provider value={{}}>
            <Drawer onDrag={onDrawerDrag} onToggle={onDrawerToggle}
              onDragEnd={onDrawerDragEnd}>
              <DrawerMenu>
                <OptionsContainer stretched>
                  <Avatar appearing={avatar.appearing} manual={avatar.manual} innerRef={avatarRef}/>
                  <Separator />
                  <Option selected />
                  <Option />
                  <Option />
                  <Spacer />
                  <Separator />
                  <Container>
                    <Option />
                    <Option />
                  </Container>
                </OptionsContainer>
              </DrawerMenu>
              <DrawerContent>
                <Router>
                  <Switch>
                    <Route path="/">
                      <Dashboard />
                    </Route>
                  </Switch>
                </Router>
              </DrawerContent>
            </Drawer>
          </AppContext.Provider>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}

export default App;
