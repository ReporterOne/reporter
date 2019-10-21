import React from "react";

import styled from 'styled-components';
// import { Container, RoundedContainer, theme } from '~/components/common';
import Calender from '~/components/Calendar';
// import Arrows from './assets/Arrows.svg';
import {Container, Icon} from '~/components/common';


const Dashboard = (props) => {
  const ContainerHeight = 40;
  const IconSize = 25;
  const Container = styled.div`
    display: flex;
    align-items:center;
    flex:1;
    flex-direction: row;
  `;
  const Circle = styled.div`
    height: ${ContainerHeight - 10}px;
    width: ${ContainerHeight - 10}px;
    background-color: #ffffff;
    border-radius: 50%;
    display: inline-block;
  `;
  const RoundedRectangle = styled.div`
    display: flex;
    flex: 1;
    height: ${ContainerHeight}px;
    margin-left: 25px; 
    margin-right: 25px;
    flex-direction: row;
    background-color: #301e60;
    opacity: 10%;
    align-items: center;
    justify-content:center;
    box-shadow: inset 0 0 5px;
    border-radius: ${window.innerWidth}px;
  `;
  const IconLeft = styled.img`
    transform: scaleX(-1);
    width: ${IconSize}px;
    height: ${IconSize}px;
  `;
  // const IconRight = styled.img`
  //   width: ${IconSize}px;
  //   height: ${IconSize}px;
  //   color: green
  // `;

  return (
    <Container>
      <RoundedRectangle>
        <Circle />
        {/* <Arrows /> */}
      </RoundedRectangle>
    </Container>
        
    
  );
}

export default Dashboard;