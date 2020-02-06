import React, {useEffect, useMemo, useRef, useState} from 'react';
import lodash from 'lodash';
import {
  format,
  endOfWeek,
  eachWeekOfInterval,
  eachDayOfInterval,
  isPast,
  isSameDay,
} from 'date-fns';
import styled from 'styled-components';
import {Container, theme} from '~/components/common';
import {
  ANSWERED,
  HERE,
  iteratePrevCurrentNext,
  NOT_ANSWERED,
  NOT_HERE
} from '~/utils/utils';
import {formatDate} from "~/components/Calendar/components/utils";
import {useSelector} from "react-redux";


const CellsDateFormat = 'd';

const Week = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction:row;
  flex-wrap: wrap;
  flex:1;
  width: 100%;
  min-height: 30px;
`;
const StyledDay = styled.div`
  display: flex;
  flex:1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${({isPast, isSameMonth, status}) => getDateBackgroundColor({isPast, isSameMonth, status})};
  ${({type, cellWidth, cellHeight}) => dayTypes(Math.max(cellWidth, cellHeight) / 2)[type]}
`;
const DateLabel = styled.div`
  line-height: 1;
  font-weight: bold;
  background-color: ${({isToday, isSelected}) => getDateLabelBackgroundColor({isSelected, isToday})};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({cellHeight, cellWidth}) => Math.min(cellHeight, cellWidth) * 0.7}px;
  height: ${({cellHeight, cellWidth}) => Math.min(cellHeight, cellWidth) * 0.7}px;
  color: ${({isPast, isSameMonth, status, isToday, isSelected}) => getDateLabelColor({
    isPast, isSameMonth, status, isToday, isSelected})};
  opacity: ${({isSameMonth}) => isSameMonth ? 1 : 0.2};
`;

const getDateBackgroundColor = ({isPast, isSameMonth, status}) => {
  if (!isPast) {
    return isSameMonth ? dayStatusBackgroundColor[status] : theme.white;
  } else {
    return theme.white;
  }
};
const getDateLabelBackgroundColor = ({isToday, isSelected}) => {
  if(isSelected) return theme.main;
  if(isToday) return theme.lightgray;
  return 'transparent';
};
const getDateLabelColor = ({isPast, isSameMonth, status, isToday, isSelected}) => {
  if (isSelected) return dateLabelColor.selected;
  if (isToday) return dateLabelColor.today;
  if (!isPast) {
    if (isSameMonth) {
      if (status === NOT_ANSWERED) {
        return dateLabelColor[NOT_ANSWERED];
      } else {
        return dateLabelColor[ANSWERED];
      }
    } else {
      return dateLabelColor[status];
    }
  }
  return dateLabelColor[status];
};
const dayTypes = (cellWidth) => ({
  Start: `border-top-left-radius: ${cellWidth}px;border-bottom-left-radius: ${cellWidth}px;margin: 1px 0px; margin-left: 1px;`,
  Mid: 'margin: 1px 0px;',
  End: `border-top-right-radius: ${cellWidth}px; border-bottom-right-radius: ${cellWidth}px; margin: 1px 0px; margin-right: 1px;`,
  Single: `border-radius: ${cellWidth}px; margin: 0px 1px; margin-bottom: 1px`,
});

const dayStatusBackgroundColor = {
  [HERE]: theme.approved,
  [NOT_HERE]: theme.notApproved,
  [NOT_ANSWERED]: theme.white,
};
const dateLabelColor = {
  [NOT_ANSWERED]: theme.grey,
  [ANSWERED]: theme.white,
  [HERE]: theme.approved,
  [NOT_HERE]: theme.notApproved,
  selected: theme.white,
  today: theme.grey,
};


const Day = ({date, onDateClick, isRenderedMonth, today, cellWidth, cellHeight, selectedDate}) => {
  const dayRef = useRef(null);
  const dayLabelRef = useRef(null);
  const render = useSelector(state => state.calendar.dates?.[formatDate(date)] ?? {
    date: date,
    _range_type: 'Single'
  });

  const dateStr = formatDate(date);
  const isToday = isSameDay(date, today);
  const isPast_ = !isToday && isPast(date);
  return (
    <StyledDay status={render.data?.state ?? NOT_ANSWERED} isPast={isPast_} type={render._range_type}
      isSameMonth={isRenderedMonth} key={dateStr} ref={dayRef}
      onClick={() => onDateClick(render)} cellWidth={cellWidth} cellHeight={cellHeight}>
      <DateLabel status={render.data?.state ?? NOT_ANSWERED} isPast={isPast_}
                 isSelected={selectedDate === dateStr} cellHeight={cellHeight} cellWidth={cellWidth}
                 isToday={isToday} isSameMonth={isRenderedMonth} ref={dayLabelRef}>
        <span>{format(date, CellsDateFormat)}</span>
      </DateLabel>
    </StyledDay>
  );
};

Day.displayName = 'Day';


const Cells = React.memo(({onDateClick, today, from, to, renderedMonth, selectedDate}) => {
  const cells = useRef(null);
  const [cell, setCell] = useState({width: 0, height: 0});
  useEffect(() => {
    const resizeObserve = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width / 7;
      const height = entries[0].contentRect.height / 6;
      setCell({width, height});
    });
    resizeObserve.observe(cells.current);
    return () => {
      resizeObserve.disconnect();
    }
  }, []);

  const rows = useMemo(() => {
    return eachWeekOfInterval({
      start: from,
      end: to,
    }).slice(0, 6).map(
        (date) => (
          <Week key={date}>
            {
              eachDayOfInterval({
                start: date,
                end: endOfWeek(date),
              }).map((date) =>
                <Day
                  key={date}
                  cellWidth={cell.width}
                  cellHeight={cell.height}
                  date={date}
                  today={today}
                  selectedDate={selectedDate}
                  isRenderedMonth={date.getMonth() === renderedMonth}
                  onDateClick={onDateClick}
                />)
            }
          </Week>
        ),
    );
  });

  return <Container stretched ref={cells}>{rows}</Container>;
});

Cells.displayName = 'Cells';

export default Cells;

