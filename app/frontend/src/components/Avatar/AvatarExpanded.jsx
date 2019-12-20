import React from 'react';
import styled from 'styled-components';
import Avatar from './Avatar.jsx';
import posed from 'react-pose';

import { Container } from '~/components/common';
import AvatarDetails from './AvatarDetails.jsx';

const AvatarWrapper = styled(Container)`
  margin: 0 5px;
  display: flex;
  opacity: ${({ faded }) => faded ? 0.5 : 1};
  will-change: opacity;
  transition: opacity ${({ theme }) => theme.animationsSpeed}s cubic-bezier(0.4, 0, 0.2, 1);
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  margin: auto;
  width: 100%;
`;

const Background = styled(Container)`
  background-color: white;
  height: calc(100% - 11px);
  margin: 9px 0 2px 0;
  /* fitting to big avatar! */
  padding-left: 32px;
  left: 32px;
  top: 0;
  z-index: -1;
  position: absolute;
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
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 26px;
  border-bottom-left-radius: 26px;
  min-width: 25px;
  background-color: white;
  height: 54px;
  margin: 6px 5px 2px 5px;
  padding: 2px 0;
  padding-left: 64px;
  overflow: hidden;
  white-space: nowrap;
`;

const Name = styled(Container)`
  color: gray;
  font-weight: 600;
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
    width: "100%",
    delay: ({ innerDelay }) => innerDelay * 100
  },
  exit: {
    width: "0%",
    delay: ({ innerDelay }) => innerDelay * 100
  }
});


export const AvatarExpanded = ({ name, details, delay = 0, ...props }) => {
  return (
    <AvatarWrapper>
      <PosedWrapper innerDelay={delay}>
        {/* <Background stretched>
      </Background> */}
        <AvatarContainer>
          <Avatar type="big" {...props} />
        </AvatarContainer>
        <Details row>
          <Container stretched>
            <Name>{name}</Name>
            <Reason>{details}</Reason>
          </Container>
        </Details>
      </PosedWrapper>
    </AvatarWrapper>
  );
}

export default AvatarExpanded;