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
import {motion, useAnimation} from "framer-motion";

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

const Circle = styled(motion.div)`
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
  white-space: nowrap;
  text-align: center;
`;


const attendenceStatus = {
  here: "Attending",
  notHere: "Missing",
  notDecided: ""
};
const ANIMATION_TIME = 0.5;
const DEACCELERATION = 2;

const AttendingButton = ({missingReason, onChange}) => {
  const [pose, changePose] = useState("notDecided");
  const controls = useAnimation();
  const onDragEnd = useCallback((containerWidth) => (event, info) => {
    const endPos = info.point.x + info.velocity.x * ANIMATION_TIME + ANIMATION_TIME*ANIMATION_TIME*DEACCELERATION*0.5;

    let state = "notDecided";
    if (endPos >= ((containerWidth - circleDiameter) * 0.5) + 70) {
      state = 'here';
    }
    else if (endPos <= ((containerWidth - circleDiameter) * 0.5) - 70) {
      state = 'notHere';
    }
    controls.start(state);
    changePose(state);
  });

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
                <Circle key={width}
                        drag={"x"} dragConstraints={{left: outlinePadding, right: width - circleDiameter - outlinePadding }}
                        variants={{
                          notHere: {x: outlinePadding},
                          here: {x: width - circleDiameter - outlinePadding},
                          notDecided: {x: ((width - circleDiameter) * 0.5)}
                        }}
                        initial="notDecided"
                        dragElastic={false}
                        animate={controls}
                        onDragEnd={onDragEnd(width)}
                />
              </InnerContainer>
            )
          }
        </AutoSizer>
      </OuterContainer>
    </Container>
  );
}

export default AttendingButton;