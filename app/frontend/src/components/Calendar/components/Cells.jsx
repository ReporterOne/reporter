import React, {useMemo} from 'react';
import {
  startOfWeek,
  format,
  addWeeks,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  eachWeekOfInterval,
  eachDayOfInterval,
  isPast,
  getUnixTime,
  isSameDay,
} from 'date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import {Container, theme} from '~/components/common';
import {fetchDateDate} from '~/hooks/date_datas';
import {useSelector} from 'react-redux';
import lodash from 'lodash';


const CellsDateFormat = 'd';

const SpinerContainer = styled.div`
  align-self: center;
  justify-self: center;
`;
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
const Day = styled.div`
  display: flex;
  flex:1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => dayColor(props)};
  ${({when}) => dayWhen[when]}
`;
const DateLabel = styled.span`
  line-height: 1;
  font-weight: bold;
  color: ${(props) => dayLabelIsPased(props) };
  opacity: ${(props) => props.isSameMonth ? 1 : 0.2};
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
const dayWhen = {
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

export const datesformatter = (dates, today) => {
  const dateList = iteratePrevCurrentNext(dates, today, (prev, current, next) => {
    const dateObject = {status: current.status, when: "Single"};
    if ((!prev || prev.status !== current.status) && (next && next.status === current.status)){
            dateObject.when = "Start";
    } else if ((prev && prev.status === current.status) && (next && next.status === current.status)) {
            dateObject.when = "Mid";
    } else if ((prev && prev.status === current.status) && (!next || next.status !== current.status)) {
            dateObject.when = "End";
    }
    return dateObject;
  });
  return dateList 
};

const dayRender = (dateList, dates, date, monthStart, onDateClick) => {
  const isDatePast = !isSameDay(date, new Date()) && isPast(date);
  if (!isSameMonth(date, monthStart)) {
    return (
      <Day status={'notDecided'} isPast={isDatePast} when={'single'} isSameMonth={false}
        key={date} onClick={() => onDateClick(date)}>
        <DateLabel status={'no'} isPast={isDatePast} isSameMonth={false}>
          {format(date, CellsDateFormat)}
        </DateLabel>
      </Day>
    );
  } else {
    if (isDatePast) {
      const dateStatus = dates[date.getDate()-1].status;
      return (
        <Day status={dateStatus} isPast={isDatePast} when={'single'} isSameMonth={true}
          key={date} onClick={() => onDateClick(date)}>
          <DateLabel status={dateStatus} isPast={isDatePast} isSameMonth={true}>
            {format(date, CellsDateFormat)}
          </DateLabel>
        </Day>
      );
    } else {
      const dateStatus = dateList[date.getDate()].status;
      const dateWhen = dateList[date.getDate()].when;
      return (
        <Day status={dateStatus} isPast={isDatePast} when={dateWhen} isSameMonth={true}
          key={date} onClick={() => onDateClick(date)}>
          <DateLabel status={dateStatus} isPast={isDatePast} isSameMonth={true}>
            {format(date, CellsDateFormat)}
          </DateLabel>
        </Day>
      );
    }
  }
};


const iteratePrevCurrentNext = (iterator, today, callback) => {
  const toRet = {};
  const len = iterator.length;
  for(let i=today-1; i < len; i++){
      if (i === today-1) toRet[i+1] = callback(null, iterator[i], iterator[i + 1]);
      else if (i === len - 1) toRet[i+1] = callback(iterator[i - 1], iterator[i], null);
      else toRet[i+1] = callback(iterator[i - 1], iterator[i], iterator[i + 1]);
  }
  return toRet;
}

const Cells = ({currentDate, onDateClick, userIdList}) => {
  const {monthStart, monthEnd, startDate, endDate, today} = useMemo(() => {
    const dateMonthStart = startOfMonth(currentDate);
    const dateMonthEnd = endOfMonth(dateMonthStart);
    const dateStartDate = startOfWeek(dateMonthStart);
    const dateEndDate = endOfWeek(addWeeks(dateMonthEnd, 1));
    const dateToday = new Date().getDate();
    return {monthStart: dateMonthStart,
      monthEnd: dateMonthEnd,
      startDate: dateStartDate,
      endDate: dateEndDate,
      today: dateToday,
    };
  }, [monthStart, monthEnd, startDate, endDate, today]);
  const fetchParams = useMemo(() => {
    return (
      {
        start: getUnixTime(monthStart),
        end: getUnixTime(monthEnd),
        userId: userIdList
      }
    );
  }, [monthStart, monthEnd, userIdList]);
  fetchDateDate(fetchParams);
  const datesLoading = useSelector((state) => lodash.get(state.calendar, 'loading' ));
  const dates = useSelector((state) => lodash.get(state.calendar, 'dates' ));
  const rows = useMemo(() => {
    if (datesLoading) {
      return (
        <SpinerContainer >
          <CircularProgress />
        </SpinerContainer>
      );
    }
    const dateList = datesformatter(dates, today);
    return eachWeekOfInterval({
      start: startDate,
      end: endDate,
    }).slice(0, 6).map((date) => {
      return (
        <Week key={date}>
          {
            eachDayOfInterval({
              start: date,
              end: endOfWeek(date),
            }).map((date) => dayRender(dateList, dates, date, monthStart, onDateClick))
          }
        </Week>
      );
    });
  }, [currentDate, datesLoading]);

  return <Container stretched>{rows}</Container>;
};
export default Cells;

