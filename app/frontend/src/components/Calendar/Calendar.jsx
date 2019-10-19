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
import {
    Header,
    Days,
    Cells 
} from './components';
import styled from 'styled-components';


const Calendar = (props) => {
    const Container = styled.div`
        ${'' /* width: 90%; */}
        flex:1;
        flex-grow:1;
        background: white;
        height: auto;
        margin:0 auto;
        flex-direction:row;
    `;
    const date = new Date()
    const [currentDate, setCurrentDate] = useState(date);
    const [selectedDate, setSelectedDate] = useState(date);
    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };
    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };
    const onDateClick = day => {
        setSelectedDate(day);
    }
    return (
        <Container >
            <Header currentDate={currentDate} selectedDate={selectedDate} nextMonth={nextMonth} prevMonth={prevMonth}/>
            <Days currentDate={currentDate} />
            <Cells currentDate={currentDate} onDateClick={onDateClick}/>
        </Container>
    );
};
export default Calendar;