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

        /* flex-basis: calc(100%/7); */
        /* width: calc(100%/7); */
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
        console.log(rows)
        days = [];
    }
    return <Container >{rows}</Container>;
};

export default Cells;

