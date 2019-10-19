import React from "react";
import styled from 'styled-components';
import {
    format
} from "date-fns";

const MonthFormat = "MMMM";
const YearFormat = "yyyy";


const Header = (props) => {
    
    const Container = styled.div`
        text-align: center;
        display: flex;
        flex-direction: column;
    `;
    const MonthName = styled.span`
        text-transform: uppercase;
        font-size: 10px;
        font-weight: 600;
    `;
    const YearNumber = styled.span`
        font-size: 8px;
        font-weight: 600;
    `;

    return (
        <Container>
                <MonthName> {format(props.currentDate,MonthFormat)} </MonthName>
                <YearNumber> {format(props.currentDate,YearFormat)} </YearNumber>            
        </Container>
    );
};


export default Header;



