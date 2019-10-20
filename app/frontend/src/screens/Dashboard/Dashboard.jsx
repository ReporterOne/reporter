import React from "react";

import styled from 'styled-components';
import { Container, RoundedContainer, theme } from '~/components/common';



const Dashboard = (props) => {

  return (
    <Container stretched>
        <Container flex={2} style={{padding: '15px'}}>
          test
        </Container>
        <RoundedContainer flex={4} shadow={5} background={theme.cards}>
          Michael Tugendhaft, 123
        </RoundedContainer>
    </Container>
  );
}

export default Dashboard;