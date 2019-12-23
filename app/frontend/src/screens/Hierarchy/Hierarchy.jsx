import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled from 'styled-components';
import lodash from 'lodash';

import {Scroll} from "framer";
import {AnimatePresence, motion, useMotionValue} from 'framer-motion';

import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch";

import {users} from '~/utils';
import {Container} from '~/components/common';
import AvatarDetails from '~/components/Avatar/AvatarDetails.jsx';
import AvatarExpanded from "~/components/Avatar/AvatarExpanded.jsx";
import {AutoSizer} from "react-virtualized";
import Avatar from "~/components/Avatar/Avatar.jsx";

const PageContainer = styled(Container)`
  overflow: hidden;
&& .react-transform-component {
  width: 100%;
  height: 100%;
}
`;


const HierarchyHolder = styled(Container)`
`;

const MainManager = styled(Container)`
  align-items: center;
  padding-bottom: 15px;
`;

const ManagerShrink = styled(Container)`
  z-index: 1;
`;

const Teams = styled(Container)`
  //overflow: auto;
`;

const TeamLeader = styled(Container)`
  position: relative;
  justify-content: center;
  align-items: center;
`;

const TeamLeaderShrink = styled(Container)`
  transform: scale(0.9);
  z-index: 1;
`;

const Team = styled(Container)`
  display: inline-flex;
  margin: 0 auto;
`;

const TeamMembers = styled(Container)`
  align-items: center;
  //overflow: auto;
  //&::-webkit-scrollbar {
  //  display: none;
  //}
`;

const Member = styled(Container)`
  position: relative;
  justify-content: center;
  align-items: center;
`;

const MemberShrink = styled(Container)`
  transform: scale(0.7);
  z-index: 1;
`;

const HierarchyLine = styled.div`
  width: 100%;
  height: 4px;
  background-color: white;
`;

const AddNotch = styled.div`
  width: 4px;
  height: 18px;
  position: absolute;
  bottom: 0;
  //transform: translateY(px);
  background-color: white;
  z-index: 0;
`;

const TopNotch = styled.div`
  width: 4px;
  height: ${({index}) => index === 0 ? 618 : 18}px;
  position: absolute;
  top: 0;
  transform: ${({index}) => index === 0 ? "translateY(-600px)" : null};
  background-color: white;
  z-index: 0;
`;

const hierarchy = {
  leader: 1,
  childs: [
    {leader: 2},
    {
      leader: 4,
      childs: [{leader: 6}, {leader: 7}, {leader: 8}, {leader: 9}, {leader: 10}, {leader: 11}, {leader: 12}, {leader: 13}, {leader: 14}, {leader: 16}]
    },
    {
      leader: 3, childs: [{leader: 5}]
    },
  ]
};

const StyledScroll = styled(Scroll)`
  && > div > div {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const StyledMotion = styled(({flexDir, ...props}) => <motion.div {...props}/>)`
  display: inline-flex;
  flex-direction: ${({flexDir = "column"}) => flexDir};
  flex: 1;
`;

const DraggableCanvas = styled(Container)`
  width: 100%;
  height: 100%;
  display: inline-flex;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 10;
`;


const Build = ({hierarchy}) => {
  const draggedElement = useRef(null);
  const canvas = useRef(null);
  const teams = useMemo(() => lodash.get(hierarchy, "childs", []), [hierarchy]);
  const leader = useMemo(() => lodash.find(users, {id: hierarchy.leader}), [hierarchy]);

  const [initialPos, changeInitialPos] = useState({x: 0, y: 0});
  const [dragging, changeDragging] = useState({element: null});

  useEffect(() => {
    const currentPos = canvas.current.getBoundingClientRect();
    if (currentPos.x !== initialPos.x || currentPos.y !== initialPos.y) {
      changeInitialPos(currentPos)
    }
  });

  const setDraggedPos = useCallback((e) => {
    if (draggedElement.current) {
      const x = e.touches[0].pageX - initialPos.x;
      const y = e.touches[0].pageY - initialPos.y;
      draggedElement.current.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%) )`;
    }
  }, [dragging, draggedElement]);
  return (
    <>
      <HierarchyHolder stretched onTouchMove={(e) => setDraggedPos(e)}
                       onTouchEnd={() => changeDragging({
                         ...dragging,
                         element: null
                       })}>
        <MainManager>
          <ManagerShrink>
            <AvatarExpanded kind={leader.avatar.kind}
                            name={leader.name} rounded
                            onAvatarTouchStart={(e) => {
                              setDraggedPos(e);
                              changeDragging({
                                ...dragging,
                                element: () => <Avatar
                                  kind={leader.avatar.kind}/>
                              })
                            }}
                            inline/>
          </ManagerShrink>
          <AddNotch/>
        </MainManager>
        <HierarchyLine/>
        <Container stretched>
          <StyledScroll width="100%" height="100%" contentHeight="100%"
                        direction="horizontal"
                        dragEnabled={dragging.element === null}>
            <Teams stretched row onScroll={(e) => {
              if (dragging.element) e.preventDefault();
            }}>
              {teams.map(team => {
                const members = lodash.get(team, "childs", []);
                const teamLeader = lodash.find(users, {id: team.leader});
                return <Team key={teamLeader.id}>
                  <TeamLeader>
                    <TopNotch/>
                    <TeamLeaderShrink>
                      <AvatarExpanded kind={teamLeader.avatar.kind}
                                      name={teamLeader.name} rounded
                                      onAvatarTouchStart={(e) => {
                                        setDraggedPos(e);
                                        changeDragging({
                                          ...dragging,
                                          element: () => <Avatar
                                            kind={teamLeader.avatar.kind}/>
                                        })
                                      }}
                                      inline/>
                    </TeamLeaderShrink>
                    <AddNotch/>
                  </TeamLeader>
                  <Container stretched>
                    <StyledScroll height="100%"
                                  dragEnabled={dragging.element === null}>
                      <TeamMembers stretched>
                        {members.map((member, index) => {
                          const user = lodash.find(users, {id: member.leader});
                          return (
                            <Member key={user.id}>
                              <TopNotch index={index}/>
                              <MemberShrink>
                                <AvatarExpanded kind={user.avatar.kind}
                                                name={user.name}
                                                onAvatarTouchStart={(e) => {
                                                  setDraggedPos(e);
                                                  changeDragging({
                                                    ...dragging,
                                                    element: () => <Avatar
                                                      kind={user.avatar.kind}/>
                                                  });
                                                }}
                                                rounded inline/>
                              </MemberShrink>
                              <AddNotch/>
                            </Member>
                          )
                        })}
                      </TeamMembers>
                    </StyledScroll>
                  </Container>
                </Team>
              })}
            </Teams>
          </StyledScroll>
        </Container>
      </HierarchyHolder>
      <DraggableCanvas ref={canvas}>
        <div ref={draggedElement}
             style={{
               display: "inline-flex",
               flexDirection: "column",
               alignItems: "center"
             }}>
          <AnimatePresence>
            {
              dragging.element && (
                <StyledMotion initial={{opacity: 0}} animate={{opacity: 1}}
                              exit={{opacity: 0}}>
                  <dragging.element/>
                </StyledMotion>
              )
            }
          </AnimatePresence>
        </div>
      </DraggableCanvas>
    </>
  )
};

export const Hierarchy = (props) => {

  return (
    <PageContainer stretched>
      <Build hierarchy={hierarchy}/>
    </PageContainer>
  );
};

export default Hierarchy;