import React, {useState, useCallback, useMemo, useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {motion, AnimatePresence} from 'framer-motion';
import {
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek, endOfWeek, addWeeks, getUnixTime,
} from 'date-fns';
import {Header, Days, Cells} from './components';
import styled from 'styled-components';
import {Swipeable} from 'react-swipeable';
import {useSelector} from 'react-redux';
import {fetchDateDate} from '~/hooks/date_datas';


const StyledSwipeable = styled(Swipeable)`
    flex: 1;
    position: relative;
    white-space: nowrap;
`;

const SpinerContainer = styled.div`
  align-self: center;
  justify-self: center;
`;

const StyledContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: inline-flex;
  flex-direction: column;
  position: absolute;
`;

const Calendar = ({userId}) => {
  const [currentDate, setCurrentDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [swipedLeft, setSwipedLeft] = useState(true);
  const [mounted, setMounted] = useState(false);
  const now = new Date();
  useEffect(() => {
    setCurrentDate(now);
    setSelectedDate(now);
    setTimeout(() => {
      // let the calendar settle.
      setMounted(true);
    }, 10);
  }, []);

  const {monthStartDay, monthEndDay, startDate, endDate} = useMemo(() => {
    const dateMonthStart = startOfMonth(currentDate);
    const dateMonthEnd = endOfMonth(dateMonthStart);
    const dateStartDate = startOfWeek(dateMonthStart);
    const dateEndDate = endOfWeek(addWeeks(dateMonthEnd, 1));
    return {
      monthStartDay: dateMonthStart,
      monthEndDay: dateMonthEnd,
      startDate: dateStartDate,
      endDate: dateEndDate,
    };
  }, [currentDate]);

  const {loading, dates} = useSelector((state) => state.calendar);
  fetchDateDate({
    start: getUnixTime(monthStartDay),
    end: getUnixTime(monthEndDay),
    userId: userId,
  });

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

  if (loading || currentDate === null) {
    return (
      <SpinerContainer>
        <CircularProgress/>
      </SpinerContainer>
    );
  }

  return (
    <StyledSwipeable onSwipedRight={prevMonth} onSwipedLeft={nextMonth} trackMouse={true}
      className="CalendarContainer"
    >
      <AnimatePresence>
        <StyledContainer
          key={currentDate}
          initial={{x: mounted? slideAmount : 0, opacity: mounted? 0 : 1}}
          animate={{x: 0, opacity: 1}}
          exit={{x: slideAmount * -1, opacity: 0}}
        >
          <Header currentDate={currentDate} selectedDate={selectedDate}/>
          <Days currentDate={currentDate}/>
          <Cells onDateClick={onDateClick}
            userId={userId} today={now} renderedMonth={monthStartDay.getMonth()}
            dates={dates} from={startDate} to={endDate}

          />
        </StyledContainer>
      </AnimatePresence>
    </StyledSwipeable>

  );
};
export default Calendar;
