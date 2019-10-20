import React, { useState } from "react";
import {
    startOfWeek,
    format,
    addDays,
    addWeeks,
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
        align-items: center;
        justify-content: center;
    `;
    
    const DateNumberNotMonth = styled.span`
        font-size: 65%;
        line-height: 1;
        font-weight: 600;
        `;
    const DateNumber = styled.span`
        font-size: 65%;
        line-height: 1;
        font-weight: 600;
        opacity: 0.2;

    `;
    const monthStart = startOfMonth(props.currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(addWeeks(monthEnd,1));
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
                    {isSameMonth(day,monthStart) ? 
                    <DateNumberNotMonth>{formattedDate}</DateNumberNotMonth> :
                    <DateNumber>{formattedDate}</DateNumber>}
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

