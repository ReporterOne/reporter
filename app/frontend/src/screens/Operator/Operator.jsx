import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import posed, {PoseGroup} from 'react-pose';
import {HERE, NOT_ANSWERED, NOT_HERE} from '~/utils/utils';
import {users} from '~/utils/users';

import {Container} from '~/components/common';
import AvatarDetails from '~/components/Avatar/AvatarDetails';
import AvatarExpanded from '~/components/Avatar/AvatarExpanded';
import Calender from '~/components/Calendar';
import {motion, useAnimation} from 'framer-motion';


const CALENDAR_HEIGHT = 460;
const HANDLE_HEIGHT = 60;
const DRAWER_BOTTOM_PADDING = 200;


const PageContainer = styled(Container)`
`;

const ContentContainer = styled(Container)`
  padding-bottom: ${HANDLE_HEIGHT}px;
`;

const OpeningCalendar = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  background-color: white;
  width: 100%;
  height: ${DRAWER_BOTTOM_PADDING + HANDLE_HEIGHT + CALENDAR_HEIGHT}px;
  bottom: -${DRAWER_BOTTOM_PADDING}px;
  box-sizing: border-box;
  will-change: height;
  transition: 0.3s height;
  padding-bottom: 0;
  padding-top: ${HANDLE_HEIGHT}px;
  ${({theme}) => theme.shadows[4]}
`;

const CalenderContainer = styled(Container)`
  height: ${CALENDAR_HEIGHT}px;
`;

const Missing = styled(Container)`
  padding: 15px;  
`;

const TheRest = styled.div`
  padding: 15px;
  display: grid; 
  grid-template-columns: repeat(auto-fill, 70px); 
  justify-content: space-between; 
`;

const AnimatedReason = posed(Container)({
  enter: {
    delay: ({index}) => 100 * index,
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
});

export const Operator = React.memo((props) => {
  let animationIndex = 0;
  const controls = useAnimation();
  const [drag, changeDrag] = useState('y');

  const disableDrag = useCallback(() => changeDrag(false), [drag]);
  const enableDrag = useCallback(() => changeDrag('y'), [drag]);

  const onDragEnd = useCallback((event, info) => {
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 200);
    if (shouldClose) {
      controls.start('hidden');
    } else {
      controls.start('visible');
    }
  });

  return (
    <PageContainer stretched>
      <ContentContainer scrollable stretched>
        <Missing>
          <PoseGroup animateOnMount={true}>
            {
              users.filter((user) => user.status === NOT_HERE).map((user, index) => (
                <AnimatedReason index={animationIndex++} key={index}>
                  <AvatarExpanded kind={user.avatar.kind} name={user.name}
                    delay={animationIndex} details={user.reason}
                    status={user.status}/>
                </AnimatedReason>
              ))
            }
          </PoseGroup>
        </Missing>
        <TheRest row>
          <PoseGroup animateOnMount={true}>
            {
              users.filter((user) => user.status !== NOT_HERE).sort((user1, user2) => {
                if (user1.status === user2.status) return 0;
                if (user1.status === HERE && user2.status === NOT_ANSWERED) return 1;
                if (user2.status === HERE && user1.status === NOT_ANSWERED) return -1;
              }).map((user, index) => (
                <AnimatedReason index={animationIndex++} key={index}>
                  <AvatarDetails key={index} kind={user.avatar.kind}
                    name={user.name} status={user.status}/>
                </AnimatedReason>
              ))
            }
          </PoseGroup>
        </TheRest>
      </ContentContainer>
      <OpeningCalendar
        drag={drag}
        variants={{
          visible: {y: 0},
          hidden: {y: CALENDAR_HEIGHT},
        }}
        dragConstraints={{
          top: 0,
          bottom: CALENDAR_HEIGHT,
        }}
        initial="hidden"
        animate={controls}
        onDragEnd={onDragEnd}
        dragPropagation={true}
      >
        <CalenderContainer onTouchStart={disableDrag} onTouchEnd={enableDrag}>
          <Calender/>
        </CalenderContainer>
      </OpeningCalendar>
    </PageContainer>
  );
});

Operator.displayName = 'Operator';

export default Operator;
