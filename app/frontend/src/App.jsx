import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { MenuHeader, MenuDrawer } from '~/components/Menu';
import { GlobalStyle, Container, theme } from '~/components/common';
import { Dashboard } from '~/screens';

const drawerWidth = 100;

const Body = styled(Container)`
  transition: transform 0.3s;
  transform: translateX(${-drawerWidth}px);
  will-change: transform;
`;

const Content = styled(Container)`
  width: 100vw;
`;

const Overlay = styled(Container)`
  position: absolute;
  width: 100vw;
  height: 100vh;
  visibility: ${props => props.isOpen? 'visible' : 'hidden' };
  opacity: ${props => props.isOpen? 0.5 : 0};
  transition: visibility 0.3s, opacity 0.3s;
  will-change: opacity, visibility;
  z-index: 100;
  background: white;
`;

const App = (props) => {
  const [drawerOpen, changeDrawerOpen] = useState(false);

  return (
    <>
      <GlobalStyle />
      <Body row stretched style={{transform: drawerOpen? "translateX(0)" : undefined}}>
        <MenuDrawer width={drawerWidth} isOpen={drawerOpen}>

        </MenuDrawer>
        <Content stretched background={theme.main} flex="none">
          <Overlay isOpen={drawerOpen} onClick={() => changeDrawerOpen(false)}/>
          <MenuHeader onMenuClick={() => changeDrawerOpen(!drawerOpen)}/>
          <Router>
            <Switch>
              <Route path="/">
                <Dashboard />
              </Route>
            </Switch>
          </Router>
        </Content>
      </Body>
    </>
  );
}

export default App;
