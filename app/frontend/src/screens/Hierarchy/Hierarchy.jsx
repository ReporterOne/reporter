import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled from 'styled-components';
import lodash from 'lodash';

import {AnimatePresence, motion, useMotionValue} from 'framer-motion';

import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch";

import {users} from '~/utils';
import {Container} from '~/components/common';
import AvatarDetails from '~/components/Avatar/AvatarDetails.jsx';
import AvatarExpanded from "~/components/Avatar/AvatarExpanded.jsx";
import {AutoSizer} from "react-virtualized";
import Avatar from "~/components/Avatar/Avatar.jsx";
import Scroll from "~/components/Scroll/Scroll.jsx";

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
  overflow: hidden;
`;


const TeamMembers = styled(Container)`
  align-items: center;
  padding-top: 2px;
  padding-bottom: 60px;
  display: inline-flex;
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


const Replace = styled(motion.div)`
  position: absolute;
  width: 58px;
  height: 58px;
  background-color: orange;
  bottom: 0;
  border-radius: 50%; 
  left: 7px;
`;

const SubjectDrawer = styled(Container)`
  height: 120px;
  flex: unset;
  justify-content: center;
  background-color: ${({theme}) => theme.drawer};
  overflow: hidden;
  position: relative;
`;

const AvatarsWrapper = styled.div`
  z-index: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  align-items: center;
  height: 100%;
`;

const AvatarsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 10px;
`;

const DroppableDrawer = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: purple;
  z-index: 1;
  opacity: 0.5;
`;

const THRESHOLD = 60;


const Build = ({hierarchy, replaceUser, addUser}) => {
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
      const x = e.changedTouches[0].pageX - initialPos.x;
      const y = e.changedTouches[0].pageY - initialPos.y;
      draggedElement.current.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%) )`;
    }
  }, [dragging, draggedElement, initialPos]);


  const onMove = useCallback((e) => {
    setDraggedPos(e);
    const x = e.changedTouches[0].pageX;
    const y = e.changedTouches[0].pageY;
    if (draggedElement.current && dragging.element) {
      const currentX = scrollX.get();
      if (x < THRESHOLD && currentX < scrollXBounds.right) {
        scrollX.set(currentX + 5);
      } else if (x > initialPos.width - THRESHOLD && currentX > scrollXBounds.left) {
        scrollX.set(currentX - 5);
      }
    }
  }, [dragging, draggedElement, setDraggedPos, scrollXBounds]);

  const onMoveEnd = useCallback((e) => {
    if (dragging.element) {
      const x = e.changedTouches[0].pageX;
      const y = e.changedTouches[0].pageY;
      const element = document.elementFromPoint(x, y);
      if (element && element.classList.contains(AppendSubject.styledComponentId)) {
        console.log("adding", dragging.id, "to", element.dataset.id);
        addUser(dragging.id, parseInt(element.dataset.id));
      }
      if (element && element.classList.contains(Replace.styledComponentId)) {
        console.log("replacing", dragging.id, "with", element.dataset.id);
        replaceUser(dragging.id, parseInt(element.dataset.id));
      }
      if (element && element.classList.contains(DroppableDrawer.styledComponentId)) {
        console.log("unsetting", dragging.id);
      }
      changeDragging({
        ...dragging,
        element: null
      });
    }
  }, [dragging, changeDragging, replaceUser, addUser]);

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
                       onTouchEnd={onMoveEnd}>
        <MainManager>
          <ManagerShrink>
            <AvatarExpanded kind={leader.avatar.kind}
                            name={leader.name} rounded
                            inline/>
            <Replace data-id={leader.id} initial={{opacity: 0}}
                     animate={{opacity: dragging.element && dragging.id !== leader.id ? 1 : 0}}
                     onTouchStart={(e) => onTouchStart(e, leader)}/>
          </ManagerShrink>
          <AddNotch/>
          <AppendSubject initial={{opacity: 0}}
                         animate={{opacity: dragging.element && dragging.id !== leader.id ? 1 : 0}}
                         data-id={leader.id}/>
        </MainManager>
        <HierarchyLine/>
        <Container stretched>
          <Scroll drag={dragging.element ? false : 'x'}
                  contentHeight="100%"
                  updateBounds={changeScrollXBounds}
                  style={{height: "100%", x: scrollX}}>
            <Teams stretched row>
              {teams.map(team => {
                const members = lodash.get(team, "childs", []);
                const teamLeader = lodash.find(users, {id: team.leader});
                return <Team key={teamLeader.id}>
                  <TeamLeader>
                    <TopNotch/>
                    <TeamLeaderShrink>
                      <AvatarExpanded kind={teamLeader.avatar.kind}
                                      name={teamLeader.name} rounded
                                      inline/>
                      <Replace data-id={teamLeader.id} initial={{opacity: 0}}
                               animate={{opacity: dragging.element && dragging.id !== teamLeader.id ? 1 : 0}}
                               onTouchStart={(e) => onTouchStart(e, teamLeader)}/>
                    </TeamLeaderShrink>
                    <AppendSubject initial={{opacity: 0}}
                                   animate={{opacity: dragging.element && dragging.id !== teamLeader.id ? 1 : 0}}
                                   data-id={teamLeader.id}/>
                  </TeamLeader>
                  <MembersWrapper stretched>
                    <Scroll drag={dragging.element ? false : 'y'}
                            style={{height: "100%"}}>
                      <TeamMembers stretched>
                        <AnimatePresence>
                          {members.map((member, index) => {
                            const user = lodash.find(users, {id: member.leader});
                            return (
                              <StyledMotion key={user.id} exit={{opacity: 0}}
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            positionTransition>
                                <Member key={user.id}>
                                  <TopNotch index={index}/>
                                  <MemberShrink>
                                    <StyledMotion initial={{opacity: 1}}
                                                  animate={{opacity: dragging.element && dragging.id === user.id ? 0 : 1}}>
                                      <AvatarExpanded kind={user.avatar.kind}
                                                      name={user.name}
                                                      rounded inline/>
                                      <Replace data-id={user.id}
                                               initial={{opacity: 0}}
                                               animate={{opacity: dragging.element && dragging.id !== user.id ? 1 : 0}}
                                               onTouchStart={(e) => onTouchStart(e, user)}/>
                                    </StyledMotion>
                                  </MemberShrink>
                                  <AddNotch
                                    last={members.length === index + 1}/>
                                </Member>
                              </StyledMotion>
                            )
                          })}
                        </AnimatePresence>
                      </TeamMembers>
                    </Scroll>
                  </MembersWrapper>
                </Team>
              })}
            </Teams>
          </Scroll>
        </Container>
        {/*Drawer*/}
        <SubjectDrawer>
          <AvatarsWrapper>
            <AvatarsContainer>
              {users.map((user, index) => (
                <AvatarDetails
                  key={index}
                  name={user.name}
                  kind={user.avatar.kind}
                />
              ))}
            </AvatarsContainer>
          </AvatarsWrapper>
          {
            dragging.element && <DroppableDrawer/>
          }
        </SubjectDrawer>
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

const getTreeOf = (id, tree, prev) => {
  if (tree.leader === id) return [tree, prev];
  const childs = lodash.get(tree, "childs", []);
  for (const child of childs) {
    const retVal = getTreeOf(id, child, tree);
    if (retVal) return retVal;
  }
};

export const Hierarchy = (props) => {
  const [currentHierarchy, changeCurrentHierarchy] = useState(hierarchy);

  const replaceUser = useCallback((id1, id2) => {
    const newHierarchy = lodash.cloneDeep(currentHierarchy);
    const replaceFromTree = getTreeOf(id1, newHierarchy, null);
    const replaceToTree = getTreeOf(id2, newHierarchy, null);

    if (!replaceFromTree)
      throw `Invalid ids given! couldn't find id ${id1} in hierarchy tree`;

    if (!replaceToTree)
      throw `Invalid ids given! couldn't find id ${id2} in hierarchy tree`;

    const [fromTree, fromTreeParent] = replaceFromTree;
    const [toTree, toTreeParent] = replaceToTree;

    fromTree.leader = id2;
    toTree.leader = id1;

    changeCurrentHierarchy(newHierarchy);
    console.log(newHierarchy);
  }, [currentHierarchy, changeCurrentHierarchy]);

  const addUser = useCallback((id1, id2) => {
    const newHierarchy = lodash.cloneDeep(currentHierarchy);
    const addFromTree = getTreeOf(id1, newHierarchy, null);
    const addToTree = getTreeOf(id2, newHierarchy, null);

    if (!addFromTree)
      throw `Invalid ids given! couldn't find id ${id1} in hierarchy tree`;

    if (!addToTree)
      throw `Invalid ids given! couldn't find id ${id2} in hierarchy tree`;

    const [fromTree, fromTreeParent] = addFromTree;
    const [toTree, toTreeParent] = addToTree;

    // add all childs of current to parent
    fromTreeParent.childs.push(...(fromTree.childs || []));
    // delete childs of current
    fromTree.childs = [];
    // remove from parent
    lodash.pull(fromTreeParent.childs, fromTree);

    toTree.childs = lodash.get(toTree, "childs", []);
    toTree.childs.push(fromTree);

    changeCurrentHierarchy(newHierarchy);
    console.log(newHierarchy);
  }, [currentHierarchy, changeCurrentHierarchy]);

  return (
    <PageContainer stretched>
      <Build hierarchy={currentHierarchy} replaceUser={replaceUser}
             addUser={addUser}/>
    </PageContainer>
  );
};

export default Hierarchy;