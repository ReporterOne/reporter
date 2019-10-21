import React, { useState, useCallback } from "react";
import { subMonths, addMonths } from "date-fns";
import { Header, Days, Cells } from './components';
import styled from 'styled-components';
import posed, { PoseGroup } from 'react-pose';
import { Swipeable } from 'react-swipeable';
import { Container } from '~/components/common';

const StyledSwipeable = styled(Swipeable)`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const PosedContainer = posed(Container)({
    enter: { opacity: 1, delay: 100, beforeChildren: true },
    exit: { opacity: 0 }
});

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
            <PoseGroup>
                <PosedContainer stretched key={currentDate}>
                    <Header currentDate={currentDate} selectedDate={selectedDate} />
                    <Days currentDate={currentDate} />
                    <Cells currentDate={currentDate} onDateClick={onDateClick} />
                </PosedContainer>
            </PoseGroup>
        </StyledSwipeable>

    );
};
export default Calendar;