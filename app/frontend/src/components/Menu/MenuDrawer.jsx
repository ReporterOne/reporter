import React, { useContext } from 'react';
import styled from 'styled-components';
import { Container, shadows } from '~/components/common';
import { DrawerContext } from './BaseDrawer.jsx';



const DrawerContainer = styled(Container)`
  z-index: 1000;
  background-color: ${props => props.theme.drawer};
  ${shadows[3]}
  will-change: box-shadow;
  transition: box-shadow ${props => props.theme.drawerSpeed}s;
`;


export const DrawerMenu = (props) => {
  const { isOpen, drawerWidth } = useContext(DrawerContext);

  return (
    <DrawerContainer
      style={{
        width: drawerWidth,
        boxShadow: isOpen ? undefined : "0 0 0"
      }}
      flex="none" isOpen={isOpen} ref={props.innerRef}>
      {props.children}
    </DrawerContainer>
  );
}

export default DrawerMenu;