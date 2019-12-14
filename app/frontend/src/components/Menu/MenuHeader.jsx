import React from 'react';
import {Container, StyledIconButton, SVGIcon } from '~/components/common';
import iconUrl from './assets/menu_icon.svg';


export const MenuHeader = React.memo((props) => {
  return (
    <Container row>
      <StyledIconButton onClick={props.onMenuClick}>
        <SVGIcon src={iconUrl}/>
      </StyledIconButton>
    </Container>
  );
});

export default MenuHeader;
