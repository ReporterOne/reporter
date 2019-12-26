import React, { useState, useCallback } from "react";
import { AutoSizer } from 'react-virtualized';

import styled from 'styled-components';
import Arrows from '~/assets/Arrows.svg';
import Draggable from 'react-draggable';

import {
  SVGIcon,
  innerShaddow,
  theme,
} from '~/components/common';

import posed from 'react-pose';

const ContainerHeight = 60;
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
  enter: {},
  exit: {},
  notHere: {
    x: ({ containerWidth }) => outlinePadding
  },
  here: {
    x: ({ containerWidth }) => containerWidth - circleDiameter - outlinePadding
  },
  notDecided: {
    x: ({ containerWidth }) => containerWidth / 2 - circleDiameter / 2
  },
  dragBounds: ({ containerWidth }) => {
    console.log("bounds: ", containerWidth)
    return ({
      right: containerWidth - circleDiameter - outlinePadding,
      left: outlinePadding
    })
  }
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
  align-items: center;
  position: absolute;
  display: flex;
  flex: 1;
  border-radius: ${ContainerHeight / 2}px;
  ${innerShaddow[4]}
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
`;

const OuterContainer = styled.div`
  display: flex;
  position: relative;
  flex: 1;
  height: ${ContainerHeight}px;
  margin-left: ${rectangleMargin}px; 
  margin-right: ${rectangleMargin}px;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Circle = styled.div`
  height: ${circleDiameter}px;
  width: ${circleDiameter}px;
  background-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
  z-index: 1;
  will-change: transform;
  &:not(.react-draggable-dragging) {
    transition: transform ${props => props.theme.handleSpeed}s cubic-bezier(0.4, 0, 0.2, 1);
  }
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
  white-space: nowrap;
  text-align: center;
`;

const statePositions = {
  notDecided: (containerWidth) => containerWidth * 0.5 - circleDiameter * 0.5,
  here: (containerWidth) => containerWidth - circleDiameter - outlinePadding,
  notHere: (containerWidth) => outlinePadding
}

const Handle = ({containerWidth, state="notDecided", changeState}) => {
  const [handle, changeHandle] = useState({
    position: { x: statePositions[state](containerWidth), y: 0 },
    state: state
  });

  const onStop = useCallback((e, data) => {
    const circlePosition = data.x;
    let state = "notDecided";
    if (circlePosition >= ((containerWidth - circleDiameter) * 0.5) + 70) {
      state = 'here';
    }
    else if (circlePosition <= ((containerWidth - circleDiameter) * 0.5) - 70) {
      state = 'notHere';
    }
    const newHandle = {
      ...handle, state,
      position: { x: statePositions[state](containerWidth), y: 0 }
    };

    changeHandle(newHandle);
    changeState(state);
  }, [changeHandle, handle, containerWidth]);
  return (
      <Draggable
        axis='x'
        // handle='.overlay'
        position={handle.position}
        onStop={onStop}
        // onStart={onStart}
        // onDrag={onDragCallback}
        bounds={{ left: outlinePadding, right: containerWidth - circleDiameter - outlinePadding }}
      >
        <Circle />
      </Draggable>
  )
}

const attendenceStatus = {
  here: "Attending",
  notHere: "Missing",
  notDecided: ""
}

const AttendingButton = ({missingReason, onChange}) => {
  const [pose, changePose] = useState("notDecided");

  const handleChange = useCallback((state) => {
    changePose(state);
    setTimeout(() => {
      onChange(state);
    }, theme.handleSpeed * 1000);
  }, [changePose, onChange]);

  return (
    <Container>
      <OuterContainer>
        <AutoSizer>
          {({ height, width }) => (
              <InnerContainer style={{ height, width }}>
                <RoundedRectangle pose={pose} style={{ height, width }}>
                  <Spacer />
                  <ArrowsContainer pose={pose === "notDecided" ? "notDecided" : "decided"}>
                    <ArrowsLeft src={Arrows} />
                  </ArrowsContainer>
                  <Spacer />
                  <AttendenceValue>
                    {pose === "notHere" ? missingReason || attendenceStatus[pose] : attendenceStatus[pose]}
                  </AttendenceValue>
                  <Spacer />
                  <ArrowsContainer pose={pose === "notDecided" ? "notDecided" : "decided"}>
                    <ArrowsRight src={Arrows} />
                  </ArrowsContainer>
                  <Spacer />
                </RoundedRectangle>
                {/* <Circle key={width} onDragEnd={e => onDragEnd(e, width)} poseKey={usage} containerWidth={width} pose={pose}/> */}
                <Handle key={width} containerWidth={width} changeState={handleChange} />
              </InnerContainer>
            )
          }
        </AutoSizer>
      </OuterContainer>
    </Container>
  );
}

export default AttendingButton;