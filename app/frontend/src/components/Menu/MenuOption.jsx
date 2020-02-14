
import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';
import styled from 'styled-components';

import {DrawerContext} from './BaseDrawer.jsx';
import Button from '@material-ui/core/Button';


const StyledOptionButton = styled(({selected, ...props}) => (
  <Button classes={{containedPrimary: 'primary', label: 'label'}} {...props} />
))`
  border-radius: 50%;
  width: 45px;
  height: 45px;
  margin: 7px auto;
  position: relative;
  padding: 0;
  min-width: unset;
  background-color: ${({theme}) => theme.buttons.normal};
  &&:hover {
    background-color: ${({theme}) => theme.buttons.normal};
  }

  & .label {
    fill: lightgray;
  }

  &&.selected {
    background-color: ${({theme}) => theme.buttons.selected};
  }
`;

const StyledLink = styled(NavLink)`
    text-decoration: none;
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`;

const OptionWrapper = styled.div`
  display: ${({isHidden}) => isHidden? 'none' : 'flex'};
  flex-direction: column;
`;


export const Option = React.memo(({path, hidden, ...props}) => {
  const {isOpen, toggleDrawer} = useContext(DrawerContext);
  return (
    <OptionWrapper isHidden={hidden}>
      <StyledOptionButton color="primary" variant="contained" activeClassName="selected" exact
        component={StyledLink} to={path} onClick={() => {
          if (isOpen) {
            toggleDrawer();
          }
        }} {...props} />
    </OptionWrapper>
  );
});


Option.displayName = 'Option';

export default Option;
