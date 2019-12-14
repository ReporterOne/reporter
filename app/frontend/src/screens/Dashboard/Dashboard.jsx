import React, { useState } from "react";
import styled from 'styled-components';
import { Textfit } from 'react-textfit';

import { Container, RoundedContainer, theme } from '~/components/common';
import Calender from '~/components/Calendar';
import AttendingButton from '~/components/AttendingButton';


const HeaderWelcome = styled.h2`
  margin: 0;
  /* margin-left: 8%; */
  color: white;
  font-weight: 600;
  font-size: 1.4rem;
`;

const HeaderName = styled(Textfit)`
  color: white;
  font-weight: 300;
  margin-left: 5%;
`;


const WelcomeMessage = styled(Container)`
  padding: 0px 20px;
`;

const names = [
  "Michael Tugendhaft",
  "Elran Shefer",
  "Osher De Paz",
  "Ariel Domb",
  "AReallyReally LongName",
  "Tugy",
  "Adi Tugy"
];

const Dashboard = React.memo((props) => {
  const name = names[4];
  const [status, changeStatus] = useState("notDecided");

  return (
    <Container stretched>
      <Container flex={2} style={{ padding: '15px' }}>
        <WelcomeMessage>
          <HeaderWelcome>Welcome,</HeaderWelcome>
          <HeaderName mode="single" max={45}>{name}</HeaderName>
        </WelcomeMessage>
        <AttendingButton pose={status} changePose={changeStatus} />
      </Container>
      <RoundedContainer flex={4} shadow={5} background={theme.cards}>
        <Calender />
      </RoundedContainer>
    </Container>
  );
});

export default Dashboard;