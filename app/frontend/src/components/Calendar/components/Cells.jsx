import React, { useState } from "react";
import {
    startOfWeek,
    format,
    addDays,
    startOfMonth,
    endOfMonth,
    endOfWeek,
    isSameMonth,
    isSameDay,
    parse,
    subMonths,
    addMonths,

} from "date-fns";
import styled from 'styled-components';

const CellsDateFormat = "d";

const Cells = (props) => {
    const Container = styled.div`
        flex: 1 ;
        flex-grow:1;
        display: flex;
        flex-wrap: wrap;
    `;
    const Row = styled.div`
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
    `;
    const Column = styled.div`
        position: relative;
        display: flex;
        flex:1;
        flex-basis: calc(100%/7);
        width: calc(100%/7);
        align-items: center;
        justify-content: center;
    `;
    const DateNumber = styled.span`
        font-size: 8px;
        line-height: 1;
        font-weight: 700;
    `;
    const monthStart = startOfMonth(props.currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, CellsDateFormat);
            const cloneDay = day;
            days.push(
                <Column
                key={day}
                onClick={() => props.onDateClick(cloneDay)}
                >
                    <DateNumber>{formattedDate}</DateNumber>
                </Column>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <Row key={day}> {days} </Row>
        );
        days = [];
    }
    return <Container >{rows}</Container>;
};

export default Cells;

