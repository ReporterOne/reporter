import React, { useState, useCallback } from "react";
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
const rectangleMargin = 15;
const outlinePadding = 3;
const circleDiameter = ContainerHeight - outlinePadding * 2;


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
    x: ({ containerWidth }) => outlinePadding
  },
  here: {
    x: ({ containerWidth }) => containerWidth - circleDiameter - outlinePadding
  },
  notDecided: {
    x: ({ containerWidth }) => containerWidth / 2 - circleDiameter / 2
  },
  // dragEnd: {
  //   transition: ({ from, to, velocity }) =>
  //     spring({ from, to, velocity, stiffness: 750, damping: 50 })
  // },
  dragBounds: ({ containerWidth }) => ({
    right: containerWidth - circleDiameter - outlinePadding,
    left: outlinePadding
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
  position: relative;
  display: flex;
  flex: 1;
  height: ${ContainerHeight}px;
  margin-left: ${rectangleMargin}px; 
  margin-right: ${rectangleMargin}px;
  flex-direction: row;
  border-radius: ${ContainerHeight / 2}px;
  ${innerShaddow[4]}
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InnerComponents = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Circle = styled(PosedCircle)`
  height: ${circleDiameter}px;
  width: ${circleDiameter}px;
  background-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
  z-index: 1;
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
  color: white;
  display: flex;
  font-weight: normal;
  font-size: 20px;
  flex:1;
`;

const AttendingButton = (props) => {
  const [pose, changePose] = useState('notDecided');
  const [position, changePosition] = useState(0);
  const [attendenceStatus, changeAttendenceStatus] = useState('');
  const [decided, changeDecision] = useState('notDecided');

  const onDragEnd = useCallback(width => e => {
    let circlePosition = 0;
    try {
      const positionString = e.path[0].style.transform
      circlePosition = Number(positionString.match(/(-?)(\d+)/)[0]);
    }
    catch (error) { }
    if (circlePosition >= ((width - circleDiameter) * 0.5) + 70) {
      changePose('here');
      changeAttendenceStatus("Attending");
      changeDecision('decided');
    }
    else if (circlePosition <= ((width - circleDiameter) * 0.5) - 70) {
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
  });

  return (
    <Container>
      <RoundedRectangle poseKey={position} pose={pose}>
        <AutoSizer>
          {({ height, width }) => (
            <InnerContainer style={{ height, width }}>
              <InnerComponents style={{ height, width }}>
                <Spacer />
                <ArrowsContainer poseKey={position} pose={decided}>
                  <ArrowsLeft src={Arrows} />
                </ArrowsContainer>
                <Spacer />
                <AttendenceValue>
                  {attendenceStatus}
                </AttendenceValue>
                <Spacer />
                <ArrowsContainer poseKey={position} pose={decided}>
                  <ArrowsRight src={Arrows} />
                </ArrowsContainer>
                <Spacer />
              </InnerComponents>
              <Circle key={width} onDragEnd={onDragEnd(width)} poseKey={position} containerWidth={width} pose={pose} />
            </InnerContainer>
          )}
        </AutoSizer>
      </RoundedRectangle>
    </Container>
  );
}

export default AttendingButton;