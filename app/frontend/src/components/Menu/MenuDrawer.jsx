import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Icon, shadows} from '~/components/common';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  }
}));


const DrawerContainer = styled(Container)`
  z-index: 1000;
  background-color: ${props => props.theme.drawer};
  ${shadows[3]}
  will-change: box-shadow;
  transition: box-shadow ${props => props.theme.drawerSpeed}s;
`;


export const MenuDrawer = (props) => {
  const classes = useStyles();

  return (
    <DrawerContainer
      style={{
        width: props.width,
        boxShadow: props.isOpen ? undefined : "0 0 0"
      }}
      flex="none" isOpen={props.isOpen} ref={props.innerRef}>
      {props.children}
    </DrawerContainer>
  );
}

export default MenuDrawer;