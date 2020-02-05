import React, {useMemo} from 'react';
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
import {iteratePrevCurrentNext} from '~/utils/utils';


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
  background-color: ${(props) => dayColor(props)};
  ${({type}) => dayTypes[type]}
`;
const DateLabel = styled.span`
  line-height: 1;
  font-weight: bold;
  color: ${({isPast, isSameMonth, status}) => dayLabelIsPased({
    isPast,
    isSameMonth,
    status,
  })};
  opacity: ${({isSameMonth}) => isSameMonth ? 1 : 0.2};
`;

const dayColor = ({isPast, isSameMonth, status}) => {
  if (!isPast) {
    return isSameMonth ? dayStatus[status] : theme.white;
  } else {
    return theme.white;
  }
};
const dayLabelIsPased = ({isPast, isSameMonth, status}) => {
  if (!isPast) {
    if (isSameMonth) {
      if (status === 'notDecided') {
        return dateLabelStatus.no;
      } else {
        return dateLabelStatus.yes;
      }
    } else {
      return dateLabelStatus[status];
    }
  }
  return dateLabelStatus[status];
};
const dayTypes = {
  Start: 'border-top-left-radius:100px;border-bottom-left-radius:100px;margin: 1px 0px; margin-left: 1px;',
  Mid: 'margin: 1px 0px;',
  End: 'border-top-right-radius:100px; border-bottom-right-radius:100px; margin: 1px 0px; margin-right: 1px;',
  Single: 'border-radius:200px; margin: 0px 1px; margin-bottom: 1px',
};

const dayStatus = {
  here: theme.approved,
  notHere: theme.notApproved,
  notDecided: theme.white,
};
const dateLabelStatus = {
  no: theme.grey,
  yes: theme.white,
  here: theme.approved,
  notHere: theme.notApproved,
};

export const datesFormatter = (dates, today, isSameMonth) => {
  const dateList = iteratePrevCurrentNext(dates, ({prev, current, next}, index) => {
    const dateObject = {status: current.status, type: 'Single'};
    if (isSameMonth && index < today.getDate() - 1) return dateObject;

    if ((!prev || prev.status !== current.status) && (next && next.status === current.status)) {
      dateObject.type = 'Start';
    } else if ((prev && prev.status === current.status) && (next && next.status === current.status)) {
      dateObject.type = 'Mid';
    } else if ((prev && prev.status === current.status) && (!next || next.status !== current.status)) {
      dateObject.type = 'End';
    }
    return dateObject;
  });
  return dateList;
};

const Day = React.memo(({date, onDateClick, isRenderedMonth}) => {
  return (
    <StyledDay status={date.status} isPast={date.isPast} type={date.type}
      isSameMonth={isRenderedMonth} key={date}
      onClick={() => onDateClick(date)}>
      <DateLabel status={date.status} isPast={date.isPast}
        isSameMonth={isRenderedMonth}>
        {format(date.date, CellsDateFormat)}
      </DateLabel>
    </StyledDay>
  );
});

Day.displayName = 'Day';


const Cells = React.memo(({onDateClick, today, from, to, dates, renderedMonth}) => {
  const rows = useMemo(() => {
    const dateList = datesFormatter(dates, today, today.getMonth() === renderedMonth);
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
                  date={{
                    ...dateList[date.getDate()],
                    isPast: !isSameDay(date, today) && isPast(date),
                    date: date, // TODO: replace with real data
                  }}
                  isRenderedMonth={date.getMonth() === renderedMonth}
                  onDateClick={onDateClick}
                />)
            }
          </Week>
        ),
    );
  }, [renderedMonth, from, to, today]);

  return <Container stretched>{rows}</Container>;
});

Cells.displayName = 'Cells';

export default Cells;

