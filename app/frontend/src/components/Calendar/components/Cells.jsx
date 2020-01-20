import React, { useMemo } from "react";
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
  isBefore,
  isSameDay,
} from "date-fns";
import styled from 'styled-components';
import { Container, theme } from '~/components/common';
import { fetchDateDate } from "~/hooks/date_datas";
import { useSelector } from "react-redux";
import lodash from 'lodash';



const CellsDateFormat = "d";

const Week = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction:row;
  flex-wrap: wrap;
  flex:1;
  width: 100%;
`;
const Day = styled.div`
  display: flex;
  flex:1;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${props => dayColor(props)};
  ${({when}) => dayWhen[when]}
`;
const DateLabel = styled.span`
  line-height: 1;
  font-weight: bold;
  color: ${props => dayLabelIsPased(props) };
  opacity: ${props => props.isSameMonth ? 1 : 0.2};
`;

const dayColor = ({isPast,isSameMonth,status}) => {
  if (!isPast) {
    return isSameMonth ? dayStatus[status] : theme.white
  }
  else {
    return theme.white
  }
}
const dayLabelIsPased = ({isPast,isSameMonth,status}) => {
  if (!isPast) {
    if (isSameMonth) {
      if (status === 'notDecided') {
        return dateLabelStatus.no
      } else {
        return dateLabelStatus.yes
      }
    } else {
      return dateLabelStatus[status]
    }
  }
  return dateLabelStatus[status]
}
const dayWhen = {
  Start: "border-top-left-radius:100px;border-bottom-left-radius:100px;margin: 1px 0px; margin-left: 1px;",
  Mid: "margin: 1px 0px;",
  End: "border-top-right-radius:100px; border-bottom-right-radius:100px; margin: 1px 0px; margin-right: 1px;",
  Single: "border-radius:200px; margin: 0px 1px; margin-bottom: 1px",

};
const dayStatus = {
  here: theme.approved,
  notHere: theme.notApproved,
  notDecided: theme.white
};
const dateLabelStatus = {
  no: theme.grey,
  yes: theme.white,
  here: theme.approved,
  notHere: theme.notApproved,
};

const formatDates = (fetchDates,today) => {
  const dateDict = {};
  let dateObject ,varStatus, varWhen, varDate;
  const datesInMonth = fetchDates.length;
  varDate = today;
  for (let index=today; index<datesInMonth-1; index++) { 
    varStatus = fetchDates[index].status;
    if (fetchDates[index-1].status === varStatus) {
      if (fetchDates[index+1].status === varStatus) {
        varWhen = "Mid";
      } else {
        varWhen = "End";
      }
    } else {
      if (fetchDates[index+1].status === varStatus) {
        varWhen = "Start";
      } else {
        varWhen = "Single";
      }
    }
    dateObject = {status: varStatus, when: varWhen}
    dateDict[index] = (dateObject);
  }
  return dateDict;
}

const DayRender = (dateList, dates, date, monthStart, onDateClick) => {
  
  if (!isSameMonth(date, monthStart)) {
    return (
      <Day status={'notDecided'} isPast={isPast(date)} when={'single'} isSameMonth={false} key={date} onClick={() => onDateClick(date)}>
        <DateLabel status={'no'} isPast={isPast(date)} isSameMonth={false}>
          {format(date, CellsDateFormat)}
        </DateLabel>
      </Day>
    );
  } else {
    if (!isSameDay(date, new Date()) && isPast(date)){
      
      return (
        <Day status={dates[date.getDate()].status} isPast={isPast(date)} when={'single'} isSameMonth={true} key={date} onClick={() => onDateClick(date)}>
          <DateLabel status={dates[date.getDate()].status} isPast={isPast(date)} isSameMonth={true}>
            {format(date, CellsDateFormat)}
          </DateLabel>
        </Day>
        );
    } else {
      return (
        <Day status={dateList[date.getDate()].status} isPast={!isSameDay(date, new Date()) && isPast(date)} when={dateList[date.getDate()].when} isSameMonth={true} key={date} onClick={() => onDateClick(date)}>
          <DateLabel status={dateList[date.getDate()].status} isPast={!isSameDay(date, new Date()) && isPast(date)} isSameMonth={true}>
            {format(date, CellsDateFormat)}
          </DateLabel>
        </Day>
        );
    }
  }
}  
const Cells = ({currentDate, onDateClick, userIdList}) => {
  const {monthStart, monthEnd, startDate, endDate, today} = useMemo(() => {
    const dateMonthStart = startOfMonth(currentDate);
    const dateMonthEnd = endOfMonth(dateMonthStart);
    const dateStartDate = startOfWeek(dateMonthStart);
    const dateEndDate = endOfWeek(addWeeks(dateMonthEnd, 1));
    const dateToday  = new Date().getDate();
    return {monthStart: dateMonthStart,
            monthEnd: dateMonthEnd,
            startDate: dateStartDate,
            endDate: dateEndDate,
            today: dateToday
          };
  })
  const fetchParams = useMemo(() => {
    return (
      {start: getUnixTime(monthStart),
      end: getUnixTime(monthEnd),
      userId: userIdList}
      );
  });
  fetchDateDate(fetchParams);
  var dates = useSelector(state => lodash.get(state.general.dates , "data"));
  dates = [
    {status: ''},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'here'},
    {status: 'here'},
    {status: 'notHere'},
    {status: 'here'},
    {status: 'here'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'here'},
    {status: 'here'},
    {status: 'notHere'},
    {status: 'here'},
    {status: 'here'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: 'here'},
    {status: 'here'},
    {status: 'notHere'},
    {status: 'here'},
    {status: 'here'},
    {status: 'notHere'},
    {status: 'notHere'},
    {status: ''},
  ]
  const dateList = formatDates(dates, today);
  const rows = useMemo(() => {
    return eachWeekOfInterval({
      start: startDate,
      end: endDate
    }).slice(0, 6).map(date => {
      return (
        <Week key={date}>
          {
            eachDayOfInterval({
              start: date,
              end: endOfWeek(date)
            }).map(date => DayRender(dateList,dates , date, monthStart, onDateClick))
          }
        </Week>
      );
    });
  }, [currentDate]);

  return <Container stretched>{rows}</Container>;
};

export default Cells;

