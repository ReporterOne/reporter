import React from "react";
import styled from 'styled-components';
import {
    format
} from "date-fns";

const MonthFormat = "MMMM";
const YearFormat = "yyyy";


const Header = (props) => {
    
<<<<<<< HEAD
    const HeaderCell = styled.div`
        flex:1;
=======
    const Container = styled.div`
>>>>>>> 5c78c0fe2764249e59711c3faffcc03b16a70c4e
        text-align: center;
        display: flex;
        flex-direction: column;
    `;
    const MonthName = styled.span`
        text-transform: uppercase;
<<<<<<< HEAD
        font-size: 10px;
        font-weight: 600;
    `;
    const YearNumber = styled.span`
        font-size: 8px;
=======
        font-size: 75%;
        font-weight: 600;
    `;
    const YearNumber = styled.span`
        font-size: 65%;
>>>>>>> 5c78c0fe2764249e59711c3faffcc03b16a70c4e
        font-weight: 600;
    `;

    return (
<<<<<<< HEAD
        <HeaderCell>
                <MonthName> {format(props.currentDate,MonthFormat)} </MonthName>
                <YearNumber> {format(props.currentDate,YearFormat)} </YearNumber>            
        </HeaderCell>
=======
        <Container>
                <MonthName> {format(props.currentDate,MonthFormat)} </MonthName>
                <YearNumber> {format(props.currentDate,YearFormat)} </YearNumber>            
        </Container>
>>>>>>> 5c78c0fe2764249e59711c3faffcc03b16a70c4e
    );
};


export default Header;



