import React, {useState, useCallback, useMemo, useEffect} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import {motion, AnimatePresence} from 'framer-motion';
import {
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek, endOfWeek, addWeeks,
} from 'date-fns';
import {Header, Days, Cells} from './components';
import styled from 'styled-components';
import {Swipeable} from 'react-swipeable';
import {useDispatch} from 'react-redux';
import {formatDate} from '~/components/Calendar/components/utils';
import {updateRenderedMonth} from '~/actions/calendar';


const StyledSwipeable = styled(Swipeable)`
    flex: 1;
    position: relative;
    white-space: nowrap;
`;

const SpinerContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StyledContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: inline-flex;
  flex-direction: column;
  //position: absolute;
  min-height: 0;
`;


const Calendar = ({fetchData, selectedDate, setSelectedDate, userId}) => {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(now);
  const [loading, setLoading] = useState(false);
  const [swipedLeft, setSwipedLeft] = useState(true);
  const [cellSize, updateCellSize] = useState({size: 0, gapSize: 0});
  const dispatch = useDispatch();

  const {renderedMonth, startDate, endDate} = useMemo(() => {
    const renderedMonth = currentDate.getMonth();
    const dateMonthStart = startOfMonth(currentDate);
    const dateMonthEnd = endOfMonth(dateMonthStart);
    const dateStartDate = startOfWeek(dateMonthStart);
    const dateEndDate = endOfWeek(addWeeks(dateMonthEnd, 1));
    return {
      renderedMonth: renderedMonth,
      startDate: dateStartDate,
      endDate: dateEndDate,
    };
  }, [currentDate]);

  useEffect(() => {
    (async () => {
      if (fetchData) {
        dispatch(updateRenderedMonth(renderedMonth));
        setLoading(true);
        await fetchData(formatDate(startDate), formatDate(endDate), now);
        setLoading(false);
      }
    })();
  }, [startDate, endDate, fetchData, dispatch, renderedMonth]);

  const nextMonth = useCallback((e) => {
    setSwipedLeft(false);
    setCurrentDate(addMonths(currentDate, 1));
  });

  const prevMonth = useCallback((e) => {
    setSwipedLeft(true);
    setCurrentDate(subMonths(currentDate, 1));
  });

  const onDateClick = useCallback((day) => {
    if (setSelectedDate) setSelectedDate(day);
  });

  const slideAmount = useMemo(() => {
    return swipedLeft ? -300 : 300;
  }, [swipedLeft]);

  if (loading || currentDate === null) {
    return (
      <SpinerContainer>
        <CircularProgress/>
      </SpinerContainer>
    );
  }

  return (
    <StyledSwipeable onSwipedRight={prevMonth} onSwipedLeft={nextMonth}
      trackMouse={true}
      className="CalendarContainer"
    >
      <AnimatePresence>
        <StyledContainer
          key={currentDate}
          initial={{x: slideAmount, opacity: 1}}
          animate={{x: 0, opacity: 1}}
          exit={{x: -slideAmount, opacity: 0}}
        >
          <Header currentDate={currentDate}/>
          <Days currentDate={currentDate} cellSize={cellSize}/>
          <Cells onDateClick={onDateClick}
            userId={userId} updateCellSize={updateCellSize}
            selectedDate={selectedDate}
            today={now} renderedMonth={renderedMonth}
            from={startDate} to={endDate}
          />
        </StyledContainer>
      </AnimatePresence>
    </StyledSwipeable>

  );
};
export default Calendar;
