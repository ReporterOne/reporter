import React, { useState } from "react";
import styled from 'styled-components';
import { Textfit } from 'react-textfit';

import { Container, RoundedContainer, theme, FadeInContainer } from '~/components/common';
import Calender from '~/components/Calendar';
import AttendingButton from '~/components/AttendingButton';
import AvatarDetails from '~/components/Avatar/AvatarDetails.jsx';

const Header = styled(Container)`
  padding: 0 0 15px 0;
  height: 60px;
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
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  height: 100%;
`;

const AvatarsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const users = [
  {
    name: "Ariel Domb",
    avatar: {
      kind: 12
    }
  },
  {
    name: "Elran Shefer",
    avatar: {
      kind: 13
    }
  },
  {
    name: "Michael Tugendhaft",
    avatar: {
      kind: 14
    }
  },
  {
    name: "Osher De Paz",
    avatar: {
      kind: 15
    }
  },
  {
    name: "Nimrod Erez",
    avatar: {
      kind: 17
    }
  },
  {
    name: "Ido Azulay",
    avatar: {
      kind: 18
    }
  },
]

export const Commander = (props) => {
  const [selectedSoldier, changeSelectedSoldier] = useState(null);

  return (
    <Container stretched>
      <Header>
        <FadeInContainer poseKey={selectedSoldier === null}>
          {
            selectedSoldier ?
              <AttendingButton />
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
                onClick={() => { changeSelectedSoldier( selectedSoldier !== user ? user : null) }}
                name={user.name}
                isFaded={selectedSoldier && user !== selectedSoldier}
                kind={user.avatar.kind} />
            ))}
          </AvatarsContainer>
        </AvatarsWrapper>
      </SubjectDrawer>
    </Container>
  );
}

export default Commander;