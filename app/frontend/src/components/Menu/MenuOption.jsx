
import React, { useContext } from 'react';
import styled from 'styled-components';

import Button from '@material-ui/core/Button';


const StyledOptionButton = styled(({ selected, ...props }) => (
  <Button classes={{ containedPrimary: "primary" }} {...props} />
))`
  border-radius: 50%;
  width: 45px;
  height: 45px;
  margin: 7px auto;
  position: relative;
  padding: 0;
  min-width: unset;
  background-color: ${({ selected, theme }) => selected? theme.buttons.selected : theme.buttons.normal};
  &&:hover {
    background-color: ${({ selected, theme }) => selected? theme.buttons.selected : theme.buttons.normal};
  }
`;

const OptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;


export const Option = ({selected=false}) => {
  return (
    <OptionWrapper>
      <StyledOptionButton color="primary" variant="contained" selected={selected}>
      </StyledOptionButton>
    </OptionWrapper>
  );
}

export default Option;