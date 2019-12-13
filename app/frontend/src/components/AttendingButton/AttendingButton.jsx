import React, { useState, useCallback, useRef } from "react";
import { AutoSizer } from 'react-virtualized';

import styled from 'styled-components';
import Arrows from '~/assets/Arrows.svg';

import {
  SVGIcon,
  innerShaddow,
  theme,
} from '~/components/common';

import posed from 'react-pose';
import { spring } from "popmotion";

const ContainerHeight = 50;
const windowSize = window.innerWidth;
const circleDiameter = ContainerHeight - 6;
const rectangleMargin = 25;

const PosedRRoundedRectangle = posed.div({
  notHere: {
    backgroundColor: theme.notApproved
  },
  here: {
    backgroundColor: theme.approved
  },
  notDecided: {
    backgroundColor: theme.main
  },
});

const PosedCircle = posed.div({
  draggable: 'x',
  notHere: {
    x: ({ containerWidth }) => {
      console.log(containerWidth);
      return -(containerWidth / 2 - (circleDiameter / 2) - 3)
    }
  },
  here: {
    x: ({ containerWidth }) => {
      console.log(containerWidth);
      return containerWidth / 2 - (circleDiameter / 2) - 3
    }
  },
  notDecided: {
    x: 0
  },
  dragEnd: {
    transition: ({ from, to, velocity }) =>
      spring({ from, to, velocity, stiffness: 750, damping: 50 })
  },
  dragBounds: ({ containerWidth }) => ({
    right: containerWidth / 2,
    left: -containerWidth / 2
  })
});

const PosedArrowsContainer = posed.div({
  decided: { scale: 0 },
  notDecided: { scale: 1 }
});

const Container = styled.div`
  display: flex;
  align-items:center;
  flex:1;
  flex-direction: row;
`;

const RoundedRectangle = styled(PosedRRoundedRectangle)`
  display: flex;
  flex: 1;
  height: ${ContainerHeight}px;
  margin-left: ${rectangleMargin}px; 
  margin-right: ${rectangleMargin}px;
  flex-direction: row;
  align-items: center;
  border-radius: ${windowSize}px;
  ${innerShaddow[4]}
`;

const InnerContainer = styled.div`
  display: flex;
  flex: d
`;

const Circle = styled(PosedCircle)`
  height: ${circleDiameter}px;
  width: ${circleDiameter}px;
  background-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
`;

const ArrowsContainer = styled(PosedArrowsContainer)`
  flex:1;
  height: ${ContainerHeight}px;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const ArrowsLeft = styled(SVGIcon)`
  flex:1;
  height: 60%;
  transform: scaleX(-1);
  fill: #F15A24;

`;

const ArrowsRight = styled(SVGIcon)`
  flex:1;
  fill: #22B573;
  height: 60%;

`;
const AttendenceValue = styled.span`
  position: absolute;
  color: white;
  display: flex;
  font-weight: normal;
  font-size: 20px;
  flex:1;
`;

const AttendingButton = (props) => {

  const ref = useRef(null);
  const [pose, changePose] = useState('notDecided');
  const [position, changePosition] = useState(0);
  const [attendenceStatus, changeAttendenceStatus] = useState('');
  const [decided, changeDecision] = useState('notDecided');

  const onDragEnd = useCallback((e) => {
    const positionString = e.path[0].style.transform
    if (positionString != 'none') {
      const circlePosition = Number(positionString.match(/(-?)(\d+)/)[0])
      if (circlePosition >= ((windowSize / 2 - rectangleMargin - (circleDiameter / 2)) * 0.5)) {
        changePose('here');
        changeAttendenceStatus("Attending");
        changeDecision('decided');
      }
      else if (circlePosition <= -((windowSize / 2 - rectangleMargin - (circleDiameter / 2)) * 0.5)) {
        changePose('notHere');
        changeAttendenceStatus("Missing");
        changeDecision('decided');
      }
      else {
        changePose('notDecided');
        changeAttendenceStatus('');
        changeDecision('notDecided');
      }
      changePosition(circlePosition)
    }
  });

  return (
    <Container>
      <RoundedRectangle ref={ref} poseKey={position} pose={pose}>
        <AutoSizer>
          {({ height, width }) => (
            <div style={{ height, width, display: 'flex' }} className="testME">
              <ArrowsContainer poseKey={position} pose={decided}>
                <ArrowsLeft src={Arrows} />
              </ArrowsContainer>

              <Circle onDragEnd={onDragEnd} poseKey={position} containerWidth={width} pose={pose} />

              <AttendenceValue>
                {attendenceStatus}
              </AttendenceValue>

              <ArrowsContainer poseKey={position} pose={decided}>
                <ArrowsRight src={Arrows} />
              </ArrowsContainer>
            </div>
          )}
        </AutoSizer>
      </RoundedRectangle>


    </Container>


  );
}

export default AttendingButton;