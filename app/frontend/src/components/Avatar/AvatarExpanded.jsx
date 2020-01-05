import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.jsx';
import posed from 'react-pose';

import {Container} from '~/components/common';

const AvatarWrapper = styled(Container)`
  margin: 0 5px;
  display: inline-flex;
  opacity: ${({faded}) => faded ? 0.5 : 1};
  will-change: opacity;
  transition: opacity ${({theme}) => theme.animationsSpeed}s 
              cubic-bezier(0.4, 0, 0.2, 1);
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  margin: auto;
  width: 100%;
`;

const AvatarContainer = styled.div`
  position: absolute;
  left: 0;
  justify-content: center;
  align-items: center;
  display: flex;
  box-sizing: border-box;
`;

const Details = styled.div`
  /* fitting to big avatar! */
  border-top-right-radius: ${({rounded}) => rounded ? 30 : 5}px;
  border-bottom-right-radius: ${({rounded}) => rounded ? 30 : 5}px;
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
  min-width: 25px;
  background-color: white;
  height: 54px;
  margin: 6px 5px 0px 5px;
  padding: 2px 0;
  padding-left: 64px;
  overflow: hidden;
  white-space: ${({inline}) => inline ? 'pre-wrap' : 'nowrap'};
  width: ${({inline}) => inline ? '100px' : 'auto'};
  display: flex;
  flex-direction: column;
`;

const Content = styled(Container)`
  justify-content: center;
`;


const Name = styled(Container)`
  color: gray;
  font-weight: 600;
  padding-right: 10px;
`;

const Reason = styled.div`
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  line-height: 100%;
  display: flex;
`;

const PosedWrapper = posed(Wrapper)({
  enter: {
    width: '100%',
    delay: ({innerDelay}) => innerDelay * 100,
  },
  exit: {
    width: '0%',
    delay: ({innerDelay}) => innerDelay * 100,
  },
});


export const AvatarExpanded = (
    {
      name, details, onClick, onAvatarTouchStart, delay = 0,
      rounded = false, inline = false, ...props
    },
) => {
  return (
    <AvatarWrapper onClick={onClick}>
      <PosedWrapper innerDelay={delay}>
        <AvatarContainer onTouchStart={onAvatarTouchStart}>
          <Avatar squared type="big" {...props} />
        </AvatarContainer>
        <Details row rounded={rounded} inline={inline}>
          <Content stretched>
            <Name>{name}</Name>
            <Reason>{details}</Reason>
          </Content>
        </Details>
      </PosedWrapper>
    </AvatarWrapper>
  );
};

export default AvatarExpanded;
