import React, { useState, useCallback, useRef } from 'react';
import { StylesProvider } from '@material-ui/core/styles';
import posed from 'react-pose';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { MenuHeader, MenuDrawer, Overlay } from '~/components/Menu';
import { GlobalStyle, Container, theme } from '~/components/common';
import { Dashboard } from '~/screens';
import Draggable from 'react-draggable';

const drawerWidth = 80;
const closedDrawer = -drawerWidth;
const openDrawer = 0;

const Body = styled(Container)`
  will-change: transform;
  &:not(.react-draggable-dragging) {
    transition: transform ${props => props.theme.drawerSpeed}s linear;
  }
`;

const PosedBody = posed(Body)({
  draggable: 'x',
  dragBounds: { left: closedDrawer, right: openDrawer },
  open: {
    x: openDrawer,
    transition: {
      ease: 'linear',
    }
  },
  close: {
    x: closedDrawer,
    transition: {
      ease: 'linear',
    }
  },

});


const Content = styled(Container)`
  width: 100vw;
`;


const App = (props) => {
  const [drawer, changeDrawer] = useState({
    isOpen: false,
    pose: 'close',
    translateX: closedDrawer,
    position: { x: 0, y: 0 }
  });

  const toggleDrawer = useCallback(() => {
    changeDrawer({
      isOpen: !drawer.isOpen,
      transformX: !drawer.isOpen ? openDrawer : closedDrawer,
      position: { x: !drawer.isOpen ? drawerWidth : 0, y: 0 }
    })
  });

  const onStop = useCallback((e, data) => {
    const movePercent = Math.round(data.x * 100 / drawerWidth);
    const isOpen = drawer.isOpen ? movePercent > 70 : movePercent > 30;
    changeDrawer({
      ...drawer, isOpen: isOpen,
      position: { x: isOpen ? drawerWidth : 0, y: 0 }
    })
  });

  return (
    <>
      <StylesProvider injectFirst>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <Draggable
            axis='x'
            // handle='.overlay'
            disabled={!drawer.isOpen}
            position={drawer.position}
            positionOffset={{ x: closedDrawer, y: 0 }}
            onStop={onStop}
            bounds={{ left: 0, right: drawerWidth }}
          >
            <Body row stretched>
              <MenuDrawer width={drawerWidth} isOpen={drawer.isOpen}>
              </MenuDrawer>
              <Content stretched background={theme.main} flex="none">
                <Overlay className="overlay" isOpen={drawer.isOpen} onClick={toggleDrawer} />
                <MenuHeader onMenuClick={toggleDrawer} />
                <Router>
                  <Switch>
                    <Route path="/">
                      <Dashboard />
                    </Route>
                  </Switch>
                </Router>
              </Content>
            </Body>
          </Draggable>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}

export default App;
