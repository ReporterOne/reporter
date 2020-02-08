import React from 'react';
import styled from 'styled-components';
import {
  Container,
  Spacer,
  StyledIconButton,
  SVGIcon
} from '~/components/common';
import iconUrl from './assets/menu_icon.svg';
import alphaIcon from '~/assets/alph_icon.svg';


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

const StyledAlpha = styled(SVGIcon)`
  margin-right: 10px;
  opacity: 0.7;
  fill: white;
`;



export const MenuHeader = React.memo(({titleComponent, onMenuClick}) => {
  return (
    <Container row>
      <StyledIconButton onClick={onMenuClick} style={{zIndex: 1}} id="openMainmenu">
        <SVGIcon src={iconUrl} />
      </StyledIconButton>
      <TitleWrapper>
        <PageTitle>
          {titleComponent()}
        </PageTitle>
      </TitleWrapper>
      <Spacer/>
      <StyledAlpha src={alphaIcon}/>
    </Container>
  );
});

MenuHeader.displayName = 'MenuHeader';

export default MenuHeader;
