import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Container } from '~/components/common';
import Draggable from 'react-draggable';


export const DrawerContext = React.createContext(null);
const drawerWidth = 80;
const closedDrawer = -drawerWidth;
const openDrawer = 0;


const Body = styled(Container)`
  will-change: transform;
  &:not(.react-draggable-dragging) {
    transition: transform ${props => props.theme.drawerSpeed}s linear;
  }
`;


export const Drawer = (props) => {
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
    <DrawerContext.Provider value={{ isOpen: drawer.isOpen, drawerWidth: drawerWidth, toggleDrawer: toggleDrawer }}>
      <Draggable
        axis='x'
        // handle='.overlay'
        disabled={!drawer.isOpen}
        position={drawer.position}
        positionOffset={{ x: closedDrawer, y: 0 }}
        onStop={onStop}
      >
        <Body row stretched>
          {props.children}
        </Body>
      </Draggable>
    </DrawerContext.Provider>

  );
}

export default Drawer;
