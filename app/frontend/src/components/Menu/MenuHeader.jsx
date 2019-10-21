import React from 'react';
import {Container, Icon, StyledIconButton } from '~/components/common';
import iconUrl from './assets/menu_icon.svg';


export const MenuHeader = (props) => {
  return (
    <Container row>
      <StyledIconButton onClick={props.onMenuClick}>
        <Icon src={iconUrl}/>
      </StyledIconButton>
    </Container>
  );
}

export default MenuHeader;
