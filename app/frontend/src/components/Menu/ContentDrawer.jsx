import React, { useContext } from 'react';
import styled from 'styled-components';
import {Container, theme } from '~/components/common';
import MenuHeader from './MenuHeader.jsx';
import Overlay from './Overlay.jsx';
import { DrawerContext } from './BaseDrawer.jsx';


const Content = styled(Container)`
  width: 100vw;
`;

export const DrawerContent = (props) => {
  const { isOpen, toggleDrawer } = useContext(DrawerContext);

  return (
    <Content stretched background={theme.main} flex="none">
      <Overlay isOpen={isOpen} onClick={toggleDrawer} />
      <MenuHeader onMenuClick={toggleDrawer} />
      {props.children}
    </Content>
  );
}

export default DrawerContent;
