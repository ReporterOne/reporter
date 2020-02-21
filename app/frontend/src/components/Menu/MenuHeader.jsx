import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {
  Container,
  Spacer,
  StyledIconButton,
  SVGIcon,
} from '~/components/common';
import iconUrl from './assets/menu_icon.svg';
import reloadUrl from './assets/reload.svg';
import {useDispatch} from 'react-redux';
import {reload} from '~/actions/general';


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
  const dispatch = useDispatch();
  const [blocked, setBlocked] = useState(false);

  const reloadPage = useCallback(() => {
    if (!blocked) {
      dispatch(reload());
      setTimeout(() => setBlocked(false), 3000);
      setBlocked(true);
    }
  });

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
      <StyledIconButton onClick={reloadPage}>
        <SVGIcon src={reloadUrl} color={blocked? 'gray' : 'white'}/>
      </StyledIconButton>
    </Container>
  );
});

MenuHeader.displayName = 'MenuHeader';

export default MenuHeader;
