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
import HorizontalScroll from "~/components/Scroll/HorizontalScroll.jsx";

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
  overflow: hidden;
  display: inline-flex;
  padding: 0 60px;
  height: 100%;
`;

const TeamLeader = styled(Container)`
  position: relative;
  justify-content: center;
  align-items: center;
  height: 56px;
  padding-top: 5px;
`;

const TeamLeaderShrink = styled(Container)`
  transform: scale(0.9);
  z-index: 1;
`;

const Team = styled(Container)`
  display: inline-flex;
  margin: 0 auto;
`;

const MembersWrapper = styled(Container)`
`;


const TeamMembers = styled(Container)`
  align-items: center;
  padding-top: 2px;
  padding-bottom: 60px;
  //overflow: auto;
  //&::-webkit-scrollbar {
  //  display: none;
  //}
`;

const Member = styled(Container)`
  position: relative;
  justify-content: center;
  align-items: center;
  height: 50px;
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
  height: 68px;
  position: absolute;
  bottom: 0;
  //transform: translateY(px);
  background-color: white;
  z-index: 0;
  border-radius: ${({last}) => last ? 2 : 0}px;
`;

const TopNotch = styled.div`
  width: 4px;
  height: ${({index}) => index === 0 ? 618 : 118}px;
  position: absolute;
  top: 0;
  transform: ${({index}) => index === 0 ? "translateY(-600px)" : "translateY(-100px)"};
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
  z-index: 100;
`;

const AppendSubject = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: green;
  bottom: 0;
  border-radius: 50%;
  z-index: 15;
  transform: translateY(50%);
`;

const THRESHOLD = 60;


const Build = ({hierarchy}) => {
  const draggedElement = useRef(null);
  const canvas = useRef(null);
  const teams = useMemo(() => lodash.get(hierarchy, "childs", []), [hierarchy]);
  const leader = useMemo(() => lodash.find(users, {id: hierarchy.leader}), [hierarchy]);
  const scrollX = useMotionValue(0);
  const [scrollXBounds, changeScrollXBounds] = useState(null);


  const [initialPos, changeInitialPos] = useState({
    x: undefined,
    y: undefined
  });
  const [dragging, changeDragging] = useState({element: null, id: undefined});

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
  }, [dragging, draggedElement, initialPos]);


  const onMove = useCallback((e) => {
    setDraggedPos(e);
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;
    if (draggedElement.current) {
      const currentX = scrollX.get();
      if (x < THRESHOLD && currentX < scrollXBounds.right) {
        scrollX.set(currentX + 5);
      } else if (x > initialPos.width - THRESHOLD && currentX > scrollXBounds.left) {
        scrollX.set(currentX - 5);
      }
      const element = document.elementFromPoint(x, y);
      if (element && element.classList.contains(AppendSubject.styledComponentId)) {
        console.log(element, dragging.id);
      }
    }
  }, [dragging, draggedElement, setDraggedPos, scrollXBounds]);

  const onTouchStart = useCallback((e, user) => {
    setDraggedPos(e);
    changeDragging({
      ...dragging,
      id: user.id,
      element: () => <Avatar
        kind={user.avatar.kind}/>
    })
  }, [setDraggedPos, changeDragging, dragging]);

  return (
    <>
      <HierarchyHolder stretched
                       onTouchMove={onMove}
                       onTouchEnd={() => changeDragging({
                         ...dragging,
                         element: null
                       })}>
        <MainManager>
          <ManagerShrink>
            <AvatarExpanded kind={leader.avatar.kind}
                            name={leader.name} rounded
                            onAvatarTouchStart={(e) => onTouchStart(e, leader)}
                            inline/>
          </ManagerShrink>
          <AddNotch/>
          <AppendSubject initial={{opacity: 0}}
                         animate={{opacity: dragging.element && dragging.id !== leader.id ? 1 : 0}}
                         data-id={leader.id}/>
        </MainManager>
        <HierarchyLine/>
        <Container stretched>
          <HorizontalScroll drag={dragging.element ? false : 'x'}
                            contentHeight="100%"
                            updateBounds={changeScrollXBounds}
                            style={{height: "100%", x: scrollX}}>
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
                                      onAvatarTouchStart={(e) => onTouchStart(e, teamLeader)}
                                      inline/>
                    </TeamLeaderShrink>
                    <AppendSubject initial={{opacity: 0}}
                                   animate={{opacity: dragging.element && dragging.id !== teamLeader.id ? 1 : 0}}
                                   data-id={teamLeader.id}/>
                  </TeamLeader>
                  <MembersWrapper stretched>
                    <StyledScroll height="100%"
                                  width="100%"
                                  dragEnabled={dragging.element === null}>
                      <TeamMembers stretched>
                        {members.map((member, index) => {
                          const user = lodash.find(users, {id: member.leader});
                          return (
                            <Member key={user.id}>
                              <TopNotch index={index}/>
                              <MemberShrink>
                                <StyledMotion initial={{opacity: 1}}
                                              animate={{opacity: dragging.element && dragging.id === user.id ? 0 : 1}}>
                                  <AvatarExpanded kind={user.avatar.kind}
                                                  name={user.name}
                                                  onAvatarTouchStart={(e) => onTouchStart(e, user)}
                                                  rounded inline/>
                                </StyledMotion>
                              </MemberShrink>
                              <AddNotch last={members.length === index + 1}/>
                            </Member>
                          )
                        })}
                      </TeamMembers>
                    </StyledScroll>
                  </MembersWrapper>
                </Team>
              })}
            </Teams>
          </HorizontalScroll>
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