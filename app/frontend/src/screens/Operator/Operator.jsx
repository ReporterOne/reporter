import React, { useState } from "react";
import styled from 'styled-components';
import posed, { PoseGroup } from 'react-pose';
import { Textfit } from 'react-textfit';
import { users } from '~/utils';

import { Container } from '~/components/common';
import AvatarDetails from '~/components/Avatar/AvatarDetails.jsx';
import AvatarExpanded from "~/components/Avatar/AvatarExpanded.jsx";

const PageContainer = styled(Container)`
  overflow-y:auto;
`;

const Missing = styled(Container)`
  padding: 15px;  
`;

const TheRest = styled.div`
  padding: 15px;
  /* flex-flow: row wrap;
  justify-content: space-between; */
display: grid; /* 1 */
  grid-template-columns: repeat(auto-fill, 70px); /* 2 */
  justify-content: space-between; /* 4 */
  /* &::after {
    content: "";
    flex: auto;
  } */
`;

const AnimatedReason = posed(Container)({
  enter: {
    delay: ({ index }) => 100 * index,
    opacity: 1
  },
  exit: {
    opacity: 0
  }
});

export const Operator = (props) => {
  let animationIndex = 0;

  return (
    <PageContainer stretched>
      <Missing>
        <PoseGroup animateOnMount={true}>
          {
            users.filter(user => user.status === "not_here").map((user, index) => (
              <AnimatedReason index={animationIndex++} key={index}>
                <AvatarExpanded kind={user.avatar.kind} name={user.name} delay={animationIndex} details={user.reason} status={user.status} />
              </AnimatedReason>
            ))
          }
        </PoseGroup>
      </Missing>
      <TheRest row>
        <PoseGroup animateOnMount={true}>
          {
            users.filter(user => user.status !== "not_here").sort((user1, user2) => {
              if (user1.status === user2.status) return 0;
              if (user1.status === "here" && user2.status === "not_answered") return 1;
              if (user2.status === "here" && user1.status === "not_answered") return -1;
            }).map((user, index) => (
              <AnimatedReason index={animationIndex++} key={index}>
                <AvatarDetails key={index} kind={user.avatar.kind} name={user.name} status={user.status} />
              </AnimatedReason>
            ))
          }
        </PoseGroup>
      </TheRest>
    </PageContainer>
  );
}

export default Operator;