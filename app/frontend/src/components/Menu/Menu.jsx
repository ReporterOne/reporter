import React from 'react';
import {Container, Icon} from '~/components/common';
import iconUrl from './assets/menu_icon.svg';


const Menu = (props) => {
  return (
    <Container style={{padding: "15px"}}>
      <Icon src={iconUrl}/>
    </Container>
  );
}

export default Menu;
