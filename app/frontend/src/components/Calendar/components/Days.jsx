import React, { useMemo } from "react";
import styled from 'styled-components';

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


const Days = (props) => {
  const days = useMemo(() => {
    const symbols = ['s', 'm', 't', 'w', 't', 'f', 's'];
    return symbols.map((label, index) => <DayChar key={index}>{label}</DayChar>)
  });
  return <Container>{days}</Container>;
};

export default Days;