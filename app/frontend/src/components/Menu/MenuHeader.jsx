import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {Container, Icon} from '~/components/common';
import iconUrl from './assets/menu_icon.svg';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  }
}));



const MenuHeader = (props) => {
  const classes = useStyles();

  return (
    <Container row>
      <IconButton className={classes.button} onClick={props.onMenuClick}>
        <Icon src={iconUrl}/>
      </IconButton>
    </Container>
  );
}

export default MenuHeader;
