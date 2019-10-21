import React, { useState, useCallback, useRef } from 'react';
import posed from 'react-pose';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { MenuHeader, MenuDrawer, Overlay } from '~/components/Menu';
import { GlobalStyle, Container, theme } from '~/components/common';
import { Dashboard } from '~/screens';

const drawerWidth = 80;
const closedDrawer = -drawerWidth;
const openDrawer = 0;

const Body = styled(Container)`
  transition: transform ${props => props.theme.drawerSpeed}s linear;
  transform: translateX(${closedDrawer}px);
  will-change: transform;
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
    poseKey: 0
  });
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);
  const [delta, changeDelta] = useState({ x: 0, y: 0 });
  let [start, changeStart] = useState({ x: 0, y: 0 });

  const onSwiping = useCallback((e) => {
    if (["Left", "Right"].indexOf(e.dir) !== -1) {
      changeDrawer({
        ...drawer,
        deltaX: e.deltaX
      })
    }
  });

  const toggleDrawer = useCallback(() => {
    changeDrawer({
      isOpen: !drawer.isOpen,
      transformX: !drawer.isOpen ? openDrawer : closedDrawer,
      pose: !drawer.isOpen ? 'open' : 'close'
    })
  });

  const onMove = useCallback((e) => {
    changeDelta({
      x: e.touches[0].pageX - start.x,
      y: e.touches[0].pageY - start.y
    });
    console.log(drawerRef.current == e.target || e.target == overlayRef.current);
    console.log(delta, start);
  });

  const onStart = useCallback((e) => {
    console.log(e.touch)
    changeStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientX
    });
  });

  const onEnd = useCallback((e) => {
    changeDelta({
      x: 0,
      y: 0
    })
  });

  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Body row stretched style={{ transform: `translateX(${drawer.transformX + delta.x}px)` }} onTouchMove={onMove} onTouchStart={onStart} onTouchEnd={onEnd} draggable>
          <MenuDrawer width={drawerWidth} isOpen={drawer.isOpen} innerRef={drawerRef}>
          </MenuDrawer>
          <Content stretched background={theme.main} flex="none">
            <Overlay isOpen={drawer.isOpen} onClick={toggleDrawer} innerRef={overlayRef} />
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
      </ThemeProvider>
    </>
  );
}

export default App;
