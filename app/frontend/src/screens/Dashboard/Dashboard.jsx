import React, {useCallback, useState} from "react";
import styled from 'styled-components';
import { Textfit } from 'react-textfit';

import { Container, RoundedContainer, theme } from '~/components/common';
import Calender from '~/components/Calendar';
import AttendingButton from '~/components/AttendingButton';
import ReasonsDialog from "~/dialogs/Reasons";


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

  return (
    <Container stretched>
      <Container flex={2} style={{ padding: '15px' }}>
        <WelcomeMessage>
          <HeaderWelcome>Welcome,</HeaderWelcome>
          <HeaderName mode="single" max={45}>{name}</HeaderName>
        </WelcomeMessage>
        <AttendingButton missingReason={selectedValue} onChange={handleOnChange}/>
      </Container>
      <RoundedContainer flex={4} shadow={5} background={theme.cards}>
        <Calender />
      </RoundedContainer>
      <ReasonsDialog open={openDialog} selectedValue={selectedValue} onClose={handleClose}/>
    </Container>
  );
});

export default Dashboard;