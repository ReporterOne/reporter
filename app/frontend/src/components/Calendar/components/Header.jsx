import React from 'react';
import styled from 'styled-components';
import {format} from 'date-fns';

const MonthFormat = 'MMMM';
const YearFormat = 'yyyy';


const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;
const MonthName = styled.span`
  font-size: 2rem;
  font-weight: normal;
  color: rgb(110, 110, 110);
  text-align: center;
`;
const YearNumber = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: rgb(190, 190, 190);
  /* letter-spacing: 0.1rem; */
`;

const Header = ({currentDate}) => {
  return (
    <Container>
      <MonthName role="monthName"> {format(currentDate, MonthFormat)} </MonthName>
      <YearNumber> {format(currentDate, YearFormat)} </YearNumber>
    </Container>
  );
};


export default Header;


