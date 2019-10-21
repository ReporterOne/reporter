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

const CellsDateFormat = "d";

const Container = styled.div`
  flex: 1 ;
  display: flex;
  flex-wrap: wrap;
  flex-direction:column;
`;
const Row = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction:row;
  flex-wrap: wrap;
  flex:1;
  width: 100%;
`;
const Column = styled.div`
  display: flex;
  flex:1;
  flex-wrap: wrap;
  border-color:red;
  border-width:1px;
  align-items: center;
  justify-content: center;
`;

const DateNumber = styled.span`
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
        <Row key={date}>
          {
            eachDayOfInterval({
              start: date,
              end: endOfWeek(date)
            }).map(date => {
              return (
                <Column key={date} onClick={() => props.onDateClick(date)}>
                  <DateNumber isSameMonth={isSameMonth(date, monthStart)}>
                    {format(date, CellsDateFormat)}
                  </DateNumber>
                </Column>);
            })
          }
        </Row>
      );
    });
  }, [props.currentDate]);

  return <Container>{rows}</Container>;
};

export default Cells;

