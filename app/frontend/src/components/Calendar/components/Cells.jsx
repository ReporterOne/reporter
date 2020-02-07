import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  format,
  endOfWeek,
  eachWeekOfInterval,
  eachDayOfInterval,
  isPast,
  isSameDay,
} from 'date-fns';
import lodash from 'lodash';
import styled, {css} from 'styled-components';
import {Container, theme} from '~/components/common';
import {
  ANSWERED,
  HERE,
  NOT_ANSWERED,
  NOT_HERE,
} from '~/utils/utils';
import {formatDate} from '~/components/Calendar/components/utils';
import {useSelector} from 'react-redux';


const CellsDateFormat = 'd';


const Month = styled(Container)`
  justify-content: space-between;
`;
const Week = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction:row;
  justify-content: space-between;
  flex:1;
  width: 100%;
  min-height: 30px;
  overflow: hidden;
`;
const StyledDay = styled.div`
  position: relative;
  display: flex;
  //flex:1;
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  align-items: center;
  justify-content: center;
`;
const Background = styled.div`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({isPast, isSameMonth, status}) => getDateBackgroundColor({
  isPast,
  isSameMonth,
  status,
})};
  margin: ${({margin}) => margin}px;
  ${({type}) => dayTypes[type]};
`;

const Filler = styled.div`
  width: ${({width}) => width}px;
  height: ${({size}) => size}px;
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(${({size}) => size}px);
  background-color: ${({isPast, isSameMonth, status}) => getDateBackgroundColor({
  isPast,
  isSameMonth,
  status,
})};
  padding: 0 ${({margin}) => margin}px;
  margin: ${({margin}) => margin}px;
`;
const DateLabel = styled.div`
  position: relative;
  line-height: 1;
  font-weight: bold;
  z-index: 1;
  background-color: ${({isToday, isSelected}) => getDateLabelBackgroundColor({
  isSelected,
  isToday,
})};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({backgroundSize}) => backgroundSize}px;
  height: ${({backgroundSize}) => backgroundSize}px;
  box-sizing: border-box;
  border: ${({isToday}) => isToday && '1px solid rgba(0, 0, 0, 0.5)'};
  color: ${({isPast, isSameMonth, status, isToday, isSelected}) => getDateLabelColor({
  isPast, isSameMonth, status, isToday, isSelected,
})};
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
  if (isSelected) return 'rgba(255, 255, 255, 0.5)';
  return 'transparent';
};
const getDateLabelColor = ({isPast, isSameMonth, status, isToday, isSelected}) => {
  if (isSelected) return dateLabelColor.selected;
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
const dayTypes = {
  Start: css`
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;
  `,
  Mid: css`
  `,
  End: css`
    border-top-right-radius: 50%; 
    border-bottom-right-radius: 50%;
  `,
  Single: css`
    border-radius: 50%; 
  `,
};

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
  selected: theme.black,
};

const isEqual = (a, b, fields) => {
  return fields.every((field) => lodash.get(a, field) === lodash.get(b, field));
};

const isDiff = (a, b, fields) => !isEqual(a, b, fields);

const getRangeType = (prev, current, next, renderedMonth, userId) => {
  const today = formatDate(new Date());
  const prevDate = prev?.date;
  prev = lodash.find(prev?.data, {user_id: userId});
  current = lodash.find(current?.data, {user_id: userId});
  next = lodash.find(next?.data, {user_id: userId});
  if (!prev && !current && !prev) {
    return 'Single';
  }

  if ((!prev || isDiff(prev, current, [`state`, `reason.name`]) || today > prevDate) &&
    (next && isEqual(next, current, [`state`, `reason.name`]))) {
    return 'Start';
  } else if ((prev && isEqual(prev, current, [`state`, `reason.name`])) &&
    (next && isEqual(next, current, [`state`, `reason.name`]))) {
    return 'Mid';
  } else if ((prev && isEqual(prev, current, [`state`, `reason.name`])) &&
    (!next || isDiff(next, current, [`state`, `reason.name`]))) {
    return 'End';
  }
  return 'Single';
};

const Day = ({date, onDateClick, renderedMonth, today, cell, selectedDate, userId}) => {
  const dayRef = useRef(null);
  const dayLabelRef = useRef(null);
  const size = cell.size;
  const gapSize = cell.gapSize;

  const beforeDay = new Date(date);
  beforeDay.setDate(date.getDate() - 1);
  const afterDay = new Date(date);
  afterDay.setDate(date.getDate() + 1);
  const isRenderedMonth = renderedMonth === date.getMonth();

  const renderPrev = useSelector((state) => state.calendar.dates?.[formatDate(beforeDay)]);
  const renderNext = useSelector((state) => state.calendar.dates?.[formatDate(afterDay)]);
  const render = useSelector((state) => state.calendar.dates?.[formatDate(date)] ?? {
    date: date,
  });
  const rangeType = getRangeType(renderPrev, render, renderNext, isRenderedMonth, userId);

  const data = lodash.find(render.data, {user_id: userId});

  const dateStr = formatDate(date);
  const isToday = isSameDay(date, today);
  const isPast_ = !isToday && isPast(date);
  const status = data?.state ?? NOT_ANSWERED;
  const margin = 2;
  const backgroundSize = size - (margin * 2);
  return (
    <StyledDay status={status} isPast={isPast_}
               isSameMonth={isRenderedMonth} key={dateStr} ref={dayRef}
               onClick={() => onDateClick(render)} size={size}>
      <Background size={backgroundSize} margin={margin} isPast={isPast_}
                  isSameMonth={isRenderedMonth} status={status}
                  type={rangeType}/>
      <DateLabel status={status} isPast={isPast_}
                 isSelected={selectedDate === dateStr}
                 size={size} backgroundSize={backgroundSize}
                 isToday={isToday} isSameMonth={isRenderedMonth}
                 ref={dayLabelRef}>
        <span>{format(date, CellsDateFormat)}</span>
      </DateLabel>
      {
        (rangeType === 'Mid' || rangeType === 'Start') &&
        <Filler size={backgroundSize} isPast={isPast_} width={gapSize}
                isSameMonth={isRenderedMonth} status={status} margin={margin}/>
      }
    </StyledDay>
  );
};

Day.displayName = 'Day';


const Cells = React.memo(({
                            onDateClick, today, from, to, renderedMonth,
                            selectedDate, userId, updateCellSize
                          }) => {
  const cells = useRef(null);
  const [cell, setCell] = useState({size: 0, gapSize: 0});
  useEffect(() => {
    const resizeObserve = new ResizeObserver((entries) => {
      const width = Math.ceil(entries[0].contentRect.width / 7);
      const height = Math.ceil(entries[0].contentRect.height / 6);
      const size = Math.min(width, height);
      const gapSize = Math.ceil((entries[0].contentRect.width - (size * 7)) / 6);
      setCell({size, gapSize});
      updateCellSize({size, gapSize})
    });
    resizeObserve.observe(cells.current);
    return () => {
      resizeObserve.disconnect();
    };
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
                cell={cell}
                date={date}
                today={today}
                userId={userId}
                selectedDate={selectedDate}
                renderedMonth={renderedMonth}
                onDateClick={onDateClick}
              />)
          }
        </Week>
      ),
    );
  });

  return <Month stretched ref={cells}>{rows}</Month>;
});

Cells.displayName = 'Cells';

export default Cells;

