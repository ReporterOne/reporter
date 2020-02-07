import React, {useState, useCallback, useEffect} from 'react';
import {AutoSizer} from 'react-virtualized';

import styled from 'styled-components';
import Arrows from '~/assets/Arrows.svg';

import {
  SVGIcon,
  innerShaddow,
  theme,
} from '~/components/common';

import posed from 'react-pose';
import {AnimatePresence, motion, useAnimation} from 'framer-motion';
import {ANSWERED, HERE, NOT_ANSWERED, NOT_HERE} from '~/utils/utils';

const ContainerHeight = 60;
const rectangleMargin = 15;
const outlinePadding = 3;
const circleDiameter = ContainerHeight - outlinePadding * 2;


const PosedRRoundedRectangle = posed.div({
  [NOT_HERE]: {
    backgroundColor: theme.notApproved,
  },
  [HERE]: {
    backgroundColor: theme.approved,
  },
  [NOT_ANSWERED]: {
    backgroundColor: theme.main,
  },
});

const PosedArrowsContainer = posed.div({
  [ANSWERED]: {scale: 0},
  [NOT_ANSWERED]: {scale: 1},
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

const DisabledCover = styled(motion.div)`
  align-items: center;
  position: absolute;
  display: flex;
  flex: 1;
  border-radius: ${ContainerHeight / 2}px;
  background-color: rgba(150, 150, 150, 0.5);
  z-index: 1;
  ${innerShaddow[4]}
`;

const InnerContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: ${ContainerHeight / 2}px;
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

export const Circle = styled(motion.div)`
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
const AttendenceValue = styled.div`
  color: white;
  display: flex;
  font-weight: normal;
  font-size: 20px;
  white-space: nowrap;
  text-align: center;
  position:relative;
`;

const AttendenceText = styled(motion.span)`
  position: absolute;
  transform: translate(-50%, -50%);
`;


const attendenceStatus = {
  [HERE]: 'Attending',
  [NOT_HERE]: 'Missing',
  [NOT_ANSWERED]: '',
};
const ANIMATION_TIME = 0.5;
const DEACCELERATION = -1;

const AttendingButton = ({missingReason, onChange, initialState = NOT_ANSWERED, isDisabled = false}) => {
  const [pose, changePose] = useState(initialState);
  const controls = useAnimation();

  useEffect(() => {
    changePose(initialState);
    controls.start(initialState);
  }, [initialState, changePose, controls]);

  const handleChange = useCallback((state) => {
    changePose(state);
    setTimeout(() => {
      onChange(state);
    }, theme.handleSpeed * 1000);
  }, [changePose, onChange]);

  const onDragEnd = useCallback((containerWidth) => (event, info) => {
    const deaccle = info.velocity.x > 0 ? DEACCELERATION : -DEACCELERATION;
    const endPos = info.point.x + info.velocity.x * ANIMATION_TIME + ANIMATION_TIME * ANIMATION_TIME * deaccle * 0.5;

    let state = NOT_ANSWERED;
    if (endPos >= ((containerWidth - circleDiameter) * 0.5) + 70) {
      state = HERE;
    } else if (endPos <= ((containerWidth - circleDiameter) * 0.5) - 70) {
      state = NOT_HERE;
    }
    controls.start(state);
    handleChange(state);
  });

  return (
    <Container>
      <OuterContainer>
        <AutoSizer>
          {({height, width}) => (
            <InnerContainer style={{height, width}}>
              <RoundedRectangle pose={pose} style={{height, width}}>
                <Spacer/>
                <ArrowsContainer
                  pose={pose === NOT_ANSWERED ? NOT_ANSWERED : ANSWERED}>
                  <ArrowsLeft src={Arrows}/>
                </ArrowsContainer>
                <Spacer/>
                <AttendenceValue>
                  <AnimatePresence>
                    <AttendenceText
                      key={`${missingReason}_${pose}`}
                      initial={{opacity: 0}}
                      animate={{opacity: 1}}
                      exit={{opacity: 0}}
                    >
                      {pose === NOT_HERE ? missingReason || attendenceStatus[pose] : attendenceStatus[pose]}
                    </AttendenceText>
                  </AnimatePresence>
                </AttendenceValue>
                <Spacer/>
                <ArrowsContainer
                  pose={pose === NOT_ANSWERED ? NOT_ANSWERED : ANSWERED}>
                  <ArrowsRight src={Arrows}/>
                </ArrowsContainer>
                <Spacer/>
              </RoundedRectangle>
              <Circle key={width}
                      className="AttendingHandle"
                      drag={'x'}
                      dragConstraints={{
                        left: outlinePadding,
                        right: width - circleDiameter - outlinePadding,
                      }}
                      variants={{
                        [NOT_HERE]: {x: outlinePadding},
                        [HERE]: {x: width - circleDiameter - outlinePadding},
                        [NOT_ANSWERED]: {x: ((width - circleDiameter) * 0.5)},
                      }}
                      initial={initialState}
                      dragElastic={false}
                      animate={controls}
                      onDragEnd={onDragEnd(width)}
              />
              <AnimatePresence>
                {isDisabled &&
                <DisabledCover
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  style={{width, height}}/>}
              </AnimatePresence>
            </InnerContainer>
          )
          }
        </AutoSizer>
      </OuterContainer>
    </Container>
  );
};

export default AttendingButton;
