import React, {useCallback, useState} from "react";
import styled from 'styled-components';
import { Textfit } from 'react-textfit';

import { Container, RoundedContainer, theme, FadeInContainer } from '~/components/common';
import Calender from '~/components/Calendar';
import AttendingButton from '~/components/AttendingButton';
import AvatarDetails from '~/components/Avatar/AvatarDetails.jsx';
import {users} from '~/utils';
import ReasonsDialog from "~/dialogs/Reasons";

const Header = styled(Container)`
  padding: 0 0 30px 0;
  height: 80px;
  flex: unset;
  justify-content: center;
`;

const WelcomeMessage = styled(Container)`
  padding: 0px 50px;
  margin: auto;
`;

const HeaderWelcome = styled.h2`
  margin: 0;
  margin-left: -12%;
  color: white;
  font-weight: 600;
  font-size: 1.4rem;
`;

const HeaderName = styled.h2`
  margin: 0;
  color: white;
  font-weight: 300;
  font-size: 2rem;
`;

const SubjectDrawer = styled(Container)`
  height: 120px;
  flex: unset;
  justify-content: center;
  background-color: ${({ theme }) => theme.drawer};
  overflow: hidden;
  position: relative;
`;

const AvatarsWrapper = styled.div`
  z-index: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  height: 100%;
`;

const AvatarsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 10px;
`;


export const Commander = React.memo((props) => {
  const [selectedSoldier, changeSelectedSoldier] = useState(null);

  const [openDialog, changeOpenDialog] = useState(false);
  const [selectedValue, changeSelectedValue] = useState(null);

  const handleClose = useCallback((value) => {
    changeOpenDialog(false);
    changeSelectedValue(value);
  });

  const handleOnChange = useCallback((state) => {
    if(state === "notHere") {
      changeOpenDialog(true);
    } else {
      changeSelectedValue(null);
    }
  });

  const handleSelectedSoldier = useCallback((value) => {
    changeSelectedValue(null);
    changeSelectedSoldier(value);
    console.log(value);
  });

  return (
    <Container stretched>
      <Header>
        <FadeInContainer poseKey={selectedSoldier === null}>
          {
            selectedSoldier ?
              // TODO: change selectedSoldier.name to selectedSoldier.id when hierarchy get pushed!
              <AttendingButton key={selectedSoldier.name} missingReason={selectedValue} onChange={handleOnChange}/>
              :
              <WelcomeMessage>
                <HeaderWelcome>Hello,</HeaderWelcome>
                <HeaderName>Commander.</HeaderName>
              </WelcomeMessage>
          }
        </FadeInContainer>
      </Header>
      <RoundedContainer flex={4} shadow={5} background={theme.cards}>
        <Calender />
      </RoundedContainer>
      <SubjectDrawer>
        <AvatarsWrapper>
          <AvatarsContainer>
            {users.map((user, index) => (
              <AvatarDetails
                key={index}
                onClick={() => { handleSelectedSoldier( selectedSoldier !== user ? user : null) }}
                name={user.name}
                isFaded={selectedSoldier && user !== selectedSoldier}
                kind={user.avatar.kind} 
                status={user.status}
                />
            ))}
          </AvatarsContainer>
        </AvatarsWrapper>
      </SubjectDrawer>
      <ReasonsDialog open={openDialog} selectedValue={selectedValue} onClose={handleClose}/>
    </Container>
  );
});

export default Commander;