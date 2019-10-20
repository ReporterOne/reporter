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



const Days = (props) => {
    const DayChar = styled.span`
        text-transform: uppercase;
        font-weight: 600;
        color: gray;
        font-size: 8px;
        flex:1;
        padding: .75em 0;
        border-bottom: 1px solid lightgray;
    `;
    const Container = styled.div`
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        text-align:center;
    `;
    const days = [];
    const daysArray = { 1: 's', 2: 'm', 3: 't', 4: 'w', 5: 't',6:'f',7:'s' }
    for (var day in daysArray) {
        days.push(
            <DayChar key={day}>
                {daysArray[day]}
            </DayChar>
        );
    }
    return <Container>{days}</Container>;
};

export default Days;