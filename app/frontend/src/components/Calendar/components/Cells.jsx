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
  eachDayOfInterval
} from "date-fns";
import styled from 'styled-components';
import { Container } from '~/components/common';

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
  border-color:red;
  border-width:1px;
  align-items: center;
  justify-content: center;
`;

const DateLabel = styled.span`
  font-size: 65%;
  line-height: 1;
  font-weight: 600;
  opacity: ${props => props.isSameMonth ? 1 : 0.2};
`;

const Cells = (props) => {
  const rows = useMemo(() => {
    const monthStart = startOfMonth(props.currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(addWeeks(monthEnd, 1));
    return eachWeekOfInterval({
      start: startDate,
      end: endDate
    }).map(date => {
      return (
        <Week key={date}>
          {
            eachDayOfInterval({
              start: date,
              end: endOfWeek(date)
            }).map(date => {
              return (
                <Day key={date} onClick={() => props.onDateClick(date)}>
                  <DateLabel isSameMonth={isSameMonth(date, monthStart)}>
                    {format(date, CellsDateFormat)}
                  </DateLabel>
                </Day>);
            })
          }
        </Week>
      );
    });
  }, [props.currentDate]);

  return <Container stretched>{rows}</Container>;
};

export default Cells;

