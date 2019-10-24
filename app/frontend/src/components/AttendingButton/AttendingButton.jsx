import React, {useState, useCallback} from "react";

import styled from 'styled-components';
import Arrows from '~/assets/Arrows.svg';

import {
  SVGIcon,
  innerShaddow
} from '~/components/common';

import posed from 'react-pose';
import  {spring} from "popmotion";

const ContainerHeight = 40;
const windowSize = window.innerWidth;

const Container = styled.div`
  display: flex;
  align-items:center;
  flex:1;
  flex-direction: row;
`;
const RoundedRectangle = styled.div`
  display: flex;
  flex: 1;
  height: ${ContainerHeight}px;
  margin-left: 25px; 
  margin-right: 25px;
  flex-direction: row;
  align-items: center;
  justify-content:center;
  border-radius: ${windowSize}px;
  background-color: #301e60;
  ${innerShaddow[4]}
`;
const ArrowsContainer = styled.div`
  flex:1;
  display: flex;
  justify-content: center;
`;
const ArrowsLeft = styled(SVGIcon)`
  transform: scaleX(-1);
  fill: #F15A24;

`;
const ArrowsRight = styled(SVGIcon)`
  fill: #22B573;

`;

const Slidable = posed.div({
  draggable: 'x',
  notHere: {
    x: -(windowSize/2-45)
  },
  here: {
    x: windowSize/2-45
  },
  notDecided: {
    x: 0
  },
  dragEnd: {
    transition: ({ from, to, velocity }) => 
      spring({ from, to, velocity, stiffness: 750, damping: 50 })
  },
  dragBounds: 
  {
    right: windowSize/2-45,
    left: -(windowSize/2-45)
  }
});

const Circle = styled(Slidable)`
  height: ${ContainerHeight - 6}px;
  width: ${ContainerHeight - 6}px;
  background-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
`;

const AttendingButton = (props) => {

  const [pose, changePose] = useState('notDecided');
  const [position, changePosition] = useState(0);
  
  const onDragEnd = useCallback((e) => {
    const positionString = e.path[0].style.transform
    const circlePosition = Number(positionString.match(/(-?)(\d+)/)[0])

    if(circlePosition >= ((windowSize/2-45)*0.5)) {
      changePose('here');
    } 
    else if (circlePosition <= -((windowSize/2-45)*0.5)) {
      changePose('notHere');
    }
    else{
      changePose('notDecided');
    }
    changePosition(circlePosition)
  });

  return (
    <Container>
      <RoundedRectangle>
        <ArrowsContainer>
          <ArrowsLeft src={Arrows}/>
        </ArrowsContainer>
        <Circle onDragEnd={onDragEnd} poseKey={position} pose={pose}/>
        <ArrowsContainer>
          <ArrowsRight src={Arrows}/>
        </ArrowsContainer>
      </RoundedRectangle>
    </Container>
        
    
  );
}

export default AttendingButton;