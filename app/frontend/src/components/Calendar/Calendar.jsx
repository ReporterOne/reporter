import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {subMonths, addMonths} from 'date-fns';
import {Header, Days, Cells} from './components';
import styled from 'styled-components';
import {Swipeable} from 'react-swipeable';


const StyledSwipeable = styled(Swipeable)`
    flex: 1;
    position: relative;
    white-space: nowrap;
`;

const StyledContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
`;

const Calendar = ({userIdList}) => {
  const [currentDate, setCurrentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [swipedLeft, setSwipedLeft] = useState(true);

  useEffect(() => {
    const date = new Date();
    setCurrentDate(date);
    setSelectedDate(date);
  }, []);

  const nextMonth = useCallback((e) => {
    setSwipedLeft(false);
    setCurrentDate(addMonths(currentDate, 1));
  });

  const prevMonth = useCallback((e) => {
    setSwipedLeft(true);
    setCurrentDate(subMonths(currentDate, 1));
  });

  const onDateClick = useCallback((day) => {
    setSelectedDate(day);
  });

  const slideAmount = useMemo(() => {
    return swipedLeft? -300 : 300;
  }, [swipedLeft]);

  if (currentDate === null) {
    return (<div>loading</div>);
  }

  return (
    <StyledSwipeable onSwipedRight={prevMonth} onSwipedLeft={nextMonth} trackMouse={true}>
      <AnimatePresence>
        <StyledContainer
          className="CalendarContainer"
          key={currentDate}
          initial={{x: slideAmount, opacity: 0}}
          animate={{x: 0, opacity: 1}}
          exit={{x: slideAmount * -1, opacity: 0}}
        >
          <Header currentDate={currentDate} selectedDate={selectedDate}/>
          <Days currentDate={currentDate}/>
          <Cells currentDate={currentDate} onDateClick={onDateClick}
            userIdList={userIdList}/>
        </StyledContainer>
      </AnimatePresence>
    </StyledSwipeable>

  );
};
export default Calendar;
