import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import {Container, Icon, shadows} from '~/components/common';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  }
}));


const DrawerContainer = styled(Container)`
  opacity: ${props => props.isOpen? 1 : 0};
  z-index: 1000;
  background: white; 
  box-shadow: ${shadows[3]};
`;


const MenuDrawer = (props) => {
  const classes = useStyles();

  return (
    <DrawerContainer style={{width: props.width}} 
                     flex="none" isOpen={props.isOpen}>
      {props.children}
    </DrawerContainer>
  );
}

export default MenuDrawer;