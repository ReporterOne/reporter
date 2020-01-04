import React, {useMemo} from "react";
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
} from "date-fns";
import styled from 'styled-components';
import {Container, theme} from '~/components/common';
import {fetchDateDate} from "~/hooks/date_datas";
import {useSelector} from "react-redux";
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
  color: ${props => dayLabelIsPased(props)};
  opacity: ${props => props.isSameMonth ? 1 : 0.2};
`;

const dayColor = ({isPast, isSameMonth, status}) => {
  if (!isPast) {
    return isSameMonth ? dayStatus[status] : theme.white
  } else {
    return theme.white
  }
}
const dayLabelIsPased = ({isPast, isSameMonth, decided, status}) => {
  if (!isPast) {
    return isSameMonth ? dateLabelStatus[decided] : theme.grey
  } else {
    return dayStatus[status]
  }
}

const dayWhen = {
  Start: "border-top-left-radius:20px;border-bottom-left-radius:20px;",
  Mid: "margin-top: 1px;margin-bottom: 1px;",
  End: "border-top-right-radius:20px;border-bottom-right-radius:20px;",
  Single: "border-radius:100px;margin: 1px;"
};
const dayStatus = {
  here: theme.approved,
  notHere: theme.notApproved,
  notDecided: theme.white
};
const dateLabelStatus = {
  no: theme.grey,
  yes: theme.white
};

const Cells = ({currentDate, onDateClick, userIdList}) => {
  const {monthStart, monthEnd, startDate, endDate} = useMemo(() => {
    const dateMonthStart = startOfMonth(currentDate);
    const dateMonthEnd = endOfMonth(dateMonthStart);
    const dateStartDate = startOfWeek(dateMonthStart);
    const dateEndDate = endOfWeek(addWeeks(dateMonthEnd, 1));
    return {
      monthStart: dateMonthStart,
      monthEnd: dateMonthEnd,
      startDate: dateStartDate,
      endDate: dateEndDate
    };
  })
  const fetchParams = useMemo(() => {
    return (
      {
        start: getUnixTime(monthStart),
        end: getUnixTime(monthEnd),
        userId: userIdList
      }
    );
  });
  fetchDateDate(fetchParams);
  const dates = useSelector(state => lodash.get(state.general.dates, "data"));
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
            }).map(date => {
              return (
                <Day status={'here'} isPast={isPast(date)} when={'Mid'}
                     isSameMonth={isSameMonth(date, monthStart)} key={date}
                     onClick={() => onDateClick(date)}>
                  <DateLabel decided={'yes'} status={'here'}
                             isPast={isPast(date)}
                             isSameMonth={isSameMonth(date, monthStart)}>
                    {format(date, CellsDateFormat)}
                  </DateLabel>
                </Day>
              );
            })
          }
        </Week>
      );
    });
  }, [currentDate]);

  return <Container stretched>{rows}</Container>;
};

export default Cells;
