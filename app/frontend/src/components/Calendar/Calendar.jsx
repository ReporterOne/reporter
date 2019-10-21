import React, { useState, useCallback } from "react";
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


const StyledSwipeable = styled(Swipeable)`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const Calendar = (props) => {
    const date = new Date()
    const [currentDate, setCurrentDate] = useState(date);
    const [selectedDate, setSelectedDate] = useState(date);

    const nextMonth = useCallback((e) => {
        setCurrentDate(addMonths(currentDate, 1));
    });

    const prevMonth = useCallback((e) => {
        setCurrentDate(subMonths(currentDate, 1));
    });

    const onDateClick = useCallback(day => {
        setSelectedDate(day);
    });

    return (
        <StyledSwipeable onSwipedRight={prevMonth} onSwipedLeft={nextMonth}>
            <Header currentDate={currentDate} selectedDate={selectedDate} />
            <Days currentDate={currentDate} />
            <Cells currentDate={currentDate} onDateClick={onDateClick} />
        </StyledSwipeable>

    );
};
export default Calendar;