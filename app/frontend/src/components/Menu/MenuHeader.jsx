import React from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom'
import { Container, StyledIconButton, SVGIcon } from '~/components/common';
import iconUrl from './assets/menu_icon.svg';


const TitleWrapper = styled(Container)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const PageTitle = styled.h3`
  color: white;
  font-weight: 600;
`;


export const MenuHeader = React.memo(({titleComponent, onMenuClick}) => {
  return (
    <Container row>
      <StyledIconButton onClick={onMenuClick} style={{ zIndex: 1 }}>
        <SVGIcon src={iconUrl} />
      </StyledIconButton>
      <TitleWrapper>
        <PageTitle>
          {titleComponent()}
        </PageTitle>
      </TitleWrapper>
    </Container>
  );
});

export default MenuHeader;
