import React, {useCallback, useEffect, useMemo, useState} from 'react';
import styled from 'styled-components';
import posed, {PoseGroup} from 'react-pose';
import lodash from 'lodash';
import {NOT_ANSWERED, NOT_HERE} from '~/utils/utils';

import {Container} from '~/components/common';
import AvatarDetails from '~/components/Avatar/AvatarDetails';
import AvatarExpanded from '~/components/Avatar/AvatarExpanded';
import Calender from '~/components/Calendar';
import {motion, useAnimation} from 'framer-motion';
import {formatDate} from '~/components/Calendar/components/utils';
import {fetchDatesOf} from '~/actions/calendar';
import {useDispatch, useSelector} from 'react-redux';


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
  ${({theme}) => theme.outerShadows[4]}
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

const useUsersAsDict = (users) => {
  return useMemo(() => {
    return users.reduce((prev, curr) => {
      prev[curr.id] = curr;
      return prev;
    }, {});
  }, [users]);
};

const useUsersStatuses = (selectedDate) => {
  const statuses = useSelector((state) => state.calendar.dates?.[selectedDate]?.data ?? []);
  return useMemo(() => {
    return lodash.partition(statuses, {'state': NOT_HERE});
  }, [statuses]);
};

const useMadorMapping = (statuses, users) => {
  return useMemo(() => {
    return statuses.reduce((prev, current) => {
      const mador = users[current.user_id].mador.name;
      if (!(mador in prev)) prev[mador] = [];
      prev[mador].push(current);
      return prev;
    }, {});
  }, [statuses]);
};

const useFillNotAnsweredUsers = (statuses, notHereStatuses, users) => {
  return useMemo(() => {
    const usersIds = Object.keys(users).map((id) => parseInt(id));
    const toDrop = statuses.map((status) => status.user_id);
    const toDropNotHere = notHereStatuses.map((status) => status.user_id);
    const toFill = lodash.difference(usersIds, toDrop, toDropNotHere);
    const toRet = [
      ...statuses,
      ...toFill.map((id) => ({
        user_id: id,
        state: NOT_ANSWERED,
      })),
    ];

    return lodash.orderBy(toRet, ['state'], ['desc']);
  }, [statuses, users]);
};

const useMadorStatuses = (selectedDate, users, selectedMador) => {
  const [notHereStatuses, restStatuses] = useUsersStatuses(selectedDate);
  const toRetNotHereStatuses = useMadorMapping(notHereStatuses, users);
  const filledRestStatuses = useFillNotAnsweredUsers(restStatuses, notHereStatuses, users);
  const toRetRestStatuses = useMadorMapping(filledRestStatuses, users);
  return useMemo(() => {
    return [toRetNotHereStatuses[selectedMador] ?? [], toRetRestStatuses[selectedMador] ?? []];
  }, [toRetNotHereStatuses, toRetRestStatuses, selectedMador]);
};

export const Operator = React.memo((props) => {
  let animationIndex = 0;
  const dispatch = useDispatch();
  const controls = useAnimation();
  const [drag, changeDrag] = useState('y');
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const users = useSelector((state) => state.users.all);
  const usersDict = useUsersAsDict(users);
  const usersId = useMemo(() => {
    return users.map((user) => user.id);
  }, [users]);

  const [selectedMador] = useState('Unity');

  const [notHereStatuses, restStatuses] = useMadorStatuses(selectedDate, usersDict, selectedMador);


  const changeSelectedDate = useCallback((data) => {
    setSelectedDate(data.date);
  });

  const fetchDates = useCallback((start, end) => {
    dispatch(fetchDatesOf(usersId, start, end));
  }, [dispatch, usersId]);

  const disableDrag = useCallback(() => changeDrag(false), []);
  const enableDrag = useCallback(() => changeDrag('y'), []);

  useEffect(() => {
    document.addEventListener('pointerup', enableDrag);
    return () => {
      document.removeEventListener('pointerup', enableDrag);
    };
  }, []);

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
              notHereStatuses.map((status, index) => {
                const user = usersDict[status.user_id];
                return (
                  <AnimatedReason index={animationIndex++}
                    key={`${index}${selectedDate}${selectedMador}`}>
                    <AvatarExpanded kind={user?.icon_path}
                      name={user.english_name}
                      delay={animationIndex}
                      details={status.reason.name}
                      status={status.state}/>
                  </AnimatedReason>
                );
              })
            }
          </PoseGroup>
        </Missing>
        <TheRest row>
          <PoseGroup animateOnMount={true}>
            {
              restStatuses.map((status, index) => {
                const user = usersDict[status.user_id];
                return (
                  <AnimatedReason index={animationIndex++}
                    key={`${index}${selectedDate}${selectedMador}`}>
                    <AvatarDetails key={index} kind={user?.icon_path}
                      name={user.english_name}
                      status={status.state}/>
                  </AnimatedReason>
                );
              })
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
        <CalenderContainer onPointerDown={disableDrag}>
          <Calender selectedDate={selectedDate}
            setSelectedDate={changeSelectedDate}
            fetchData={fetchDates}/>
        </CalenderContainer>
      </OpeningCalendar>
    </PageContainer>
  );
});

Operator.displayName = 'Operator';

export default Operator;
