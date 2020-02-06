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
import {useDispatch, useSelector} from 'react-redux';
import {fetchDateDate} from '~/hooks/date_datas';
import {formatDate} from "~/components/Calendar/components/utils";
import {iteratePrevCurrentNext} from "~/utils/utils";
import {updateRenderedMonth} from "~/actions/calendar";


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
  position: absolute;
`;


const Calendar = ({fetchData, selectedDate, setSelectedDate}) => {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(now);
  const [loading, setLoading] = useState(false);
  const [swipedLeft, setSwipedLeft] = useState(true);
  const dispatch = useDispatch();

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

  useEffect(() => {
    (async () => {
      if (fetchData) {
        dispatch(updateRenderedMonth(monthStartDay.getMonth()));
        setLoading(true);
        await fetchData(formatDate(startDate), formatDate(endDate), now);
        setLoading(false);
      }
    })();
  }, [startDate, endDate, fetchData, dispatch]);

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
          initial={{x: slideAmount, opacity: 1}}
          animate={{x: 0, opacity: 1}}
          exit={{x: -slideAmount, opacity: 0}}
        >
          <Header currentDate={currentDate}/>
          <Days currentDate={currentDate}/>
          <Cells onDateClick={onDateClick}
                 selectedDate={selectedDate}
            today={now} renderedMonth={monthStartDay.getMonth()}
            from={startDate} to={endDate}
          />
        </StyledContainer>
      </AnimatePresence>
    </StyledSwipeable>

  );
};
export default Calendar;
