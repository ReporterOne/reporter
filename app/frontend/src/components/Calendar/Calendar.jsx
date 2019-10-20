import React, { useState } from "react";
import {

    subMonths,
    addMonths,

} from "date-fns";
import {
    Header,
    Days,
    Cells 
} from './components';
import styled from 'styled-components';
import { Swipeable } from 'react-swipeable';



const Calendar = (props) => {
    const Container = styled.div`
        flex:1;
        background: white;
        display:flex;
        flex-direction:column;
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
        <Swipeable onSwipedRight={prevMonth} onSwipedLeft={nextMonth} nodeName={Container} >
            <Header currentDate={currentDate} selectedDate={selectedDate} />
            <Days currentDate={currentDate} />
            <Cells currentDate={currentDate} onDateClick={onDateClick}/>
        </Swipeable>
        
    );
};
export default Calendar;