import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.jsx';
import { Container } from '~/components/common';

const AvatarWrapper = styled(Container)`
  margin: 0 5px;
  display: inline-flex;
  opacity: ${({faded}) => faded? 0.5 : 1};
  will-change: opacity;
  transition: opacity ${({theme}) => theme.animationsSpeed}s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Name = styled(Container)`
  align-items: center;
  justify-content: center;
`;

const NameFragment = styled.span`
  color: white;
  font-weight: 100;  
  font-size: 0.9rem;
  line-height: 105%;
`;


export const AvatarDetails = ({ name, onClick, isFaded = false, ...props }) => {

  return (
    <AvatarWrapper onClick={onClick} faded={isFaded}>
      <Avatar type="big" {...props} />
      <Name>
        {name.split(" ", 1).concat(name.split(" ").slice(1).join(" ")).map((fragment, index) => <NameFragment key={index}>{fragment}</NameFragment>)}
      </Name>
    </AvatarWrapper>
  )
}

export default AvatarDetails;