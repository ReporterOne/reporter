import React, { useState } from "react";
import styled from 'styled-components';
import { Textfit } from 'react-textfit';

import { Container, RoundedContainer, theme } from '~/components/common';
import Calender from '~/components/Calendar';
import AttendingButton from '~/components/AttendingButton';
import Avatar from '~/components/Avatar/Avatar.jsx';

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
  height: 100px;
  flex: unset;
  justify-content: center;
  background-color: ${({theme}) => theme.drawer};
`;

export const Commander = (props) => {
  const [selectedSoldier, changeSelectedSoldier] = useState(null);

  return (
    <Container stretched>
      <Header>
        {
          selectedSoldier ?
            <AttendingButton />
            :
            <WelcomeMessage>
              <HeaderWelcome>Hello,</HeaderWelcome>
              <HeaderName>Commander.</HeaderName>
            </WelcomeMessage>
        }
      </Header>
      <RoundedContainer flex={4} shadow={5} background={theme.cards}>
        <Calender />
      </RoundedContainer>
      <SubjectDrawer>
        <Container row>
          <Avatar kind={9} type="big" />
          <Avatar kind={10} type="big" />
          <Avatar kind={12} type="big" />
        </Container>
      </SubjectDrawer>
    </Container>
  );
}

export default Commander;