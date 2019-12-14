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
    transition: transform ${props => props.theme.drawerSpeed}s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;


export const Drawer = ({children, onDrag = undefined, onDragEnd = undefined, onDragStart = undefined, onToggle = undefined}) => {
  const [drawer, changeDrawer] = useState({
    isOpen: false,
    pose: 'close',
    translateX: closedDrawer,
    drawerWidth: drawerWidth,
    position: { x: 0, y: 0 }
  });

  const toggleDrawer = useCallback(() => {
    const newDrawer = {
      ...drawer,
      isOpen: !drawer.isOpen,
      transformX: !drawer.isOpen ? openDrawer : closedDrawer,
      position: { x: !drawer.isOpen ? drawerWidth : 0, y: 0 }
    };
    changeDrawer(newDrawer);
    if (onToggle) {
      onToggle({drawer: newDrawer});
    }
  }, [drawer, changeDrawer, onToggle]);

  const onStart = useCallback((e, data) => {
    if (onDragStart) {
      onDragStart({event: e, data, drawer});
    }
  }, [onDragStart]);

  const onStop = useCallback((e, data) => {
    const movePercent = Math.round(data.x * 100 / drawerWidth);
    const isOpen = drawer.isOpen ? movePercent > 70 : movePercent > 30;
    const newDrawer = {
      ...drawer, isOpen: isOpen,
      position: { x: isOpen ? drawerWidth : 0, y: 0 }
    };
    if (onDragEnd) {
      onDragEnd({event: e, data, drawer: newDrawer});
    }
    changeDrawer(newDrawer);
  }, [onDragEnd, changeDrawer, drawer]);

  const onDragCallback = useCallback((event, data) => {
    if (onDrag) {
      onDrag({event, data, drawer});
    }
  }, [onDrag]);

  return (
    <DrawerContext.Provider value={{ isOpen: drawer.isOpen, drawerWidth: drawerWidth, toggleDrawer: toggleDrawer }}>
      <Draggable
        axis='x'
        // handle='.overlay'
        disabled={!drawer.isOpen}
        position={drawer.position}
        positionOffset={{ x: closedDrawer, y: 0 }}
        onStop={onStop}
        onStart={onStart}
        onDrag={onDragCallback}
        bounds={{ left: 0, right: drawerWidth }}
      >
        <Body row stretched>
          {children}
        </Body>
      </Draggable>
    </DrawerContext.Provider>

  );
}

export default Drawer;
