import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import styled from 'styled-components';
import lodash from 'lodash';

import {AnimatePresence, motion, useMotionValue} from 'framer-motion';

import {Container} from '~/components/common';
import AvatarDetails from '~/components/Avatar/AvatarDetails.jsx';
import AvatarExpanded from '~/components/Avatar/AvatarExpanded.jsx';
import Avatar from '~/components/Avatar/Avatar.jsx';
import Scroll from '~/components/Scroll/Scroll.jsx';
import InlineSVG from "react-inlinesvg";
import arrowsURL from './arrows.svg';
import AppIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import Fab from "@material-ui/core/Fab";
import SettingsDialog from "@/Hierarchy/SettingsDialog";
import {useMe} from "~/hooks/common";
import UsersService from "~/services/users";
import {useDispatch, useSelector} from "react-redux";
import MadorsService from "~/services/madors";
import {newNotification} from "~/actions/general";

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
  background-color: white;
  z-index: 0;
  border-radius: ${({last}) => last ? 2 : 0}px;
`;

const TopNotch = styled.div`
  width: 4px;
  height: ${({index}) => index === 0 ? 618 : 118}px;
  position: absolute;
  top: 0;
  transform: ${({index}) => index === 0 ? 'translateY(-600px)' : 'translateY(-100px)'};
  background-color: white;
  z-index: 0;
`;


const DragHandle = styled(InlineSVG)`
  fill: white;
  width: 40px;
  height: 40px;
`;

const HandleWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  width: 100%;
  justify-content: center;
  display: flex;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 5px;
  right: 5px;
`;

const hierarchy = {
  leader: null,
  childs: [
    // {leader: 2},
    // {
    //   leader: 4,
    //   childs: [
    //     {leader: 6}, {leader: 7}, {leader: 8}, {leader: 9}, {leader: 10},
    //     {leader: 11}, {leader: 12}, {leader: 13}, {leader: 14}, {leader: 16},
    //   ],
    // },
    // {
    //   leader: 3, childs: [{leader: 5}],
    // },
  ],
};

const StyledMotion = styled(({flexDir, ...props}) => <motion.div {...props}/>)`
  display: inline-flex;
  flex-direction: ${({flexDir = 'column'}) => flexDir};
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
  width: 25px;
  height: 25px;
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

const SetLeader = styled.div`
  width: 58px;
  height: 58px;
  background-color: brown;
  border-radius: 50%; 
`;

const SubjectDrawer = styled(Container)`
  height: 150px;
  flex: unset;
  justify-content: center;
  background-color: ${({theme}) => theme.drawer};
  position: relative;
  overflow: hidden;
`;

const AvatarsWrapper = styled.div`
  z-index: 1;
  display: flex;
  height: 100%;
  padding-bottom: 5px;
  overflow-x: auto;
  overflow-y: hidden;
`;

const AvatarsContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 10px;
  margin-top: auto;
`;

const DroppableDrawer = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: purple;
  z-index: 1;
  opacity: 0.5;
`;

const StyledFab = styled(Fab)`
  margin-top: 5px;
`;


const THRESHOLD = 60;


const Build = ({hierarchy, replaceUser, addUser, setLeader, unsetUser, unsetUsersIds, saveHierarchy, selectedMador, changeSelectedMador}) => {
  const draggedElement = useRef(null);
  const canvas = useRef(null);
  const teams = useMemo(() => lodash.get(hierarchy, 'childs', []));
  const loading = useSelector(state => state.users.loading);
  const users = useSelector(state => state.users.all);
  const leader = useMemo(() => lodash.find(users, {id: hierarchy.leader}));
  const unsetUsers = useMemo(() => unsetUsersIds.map(id => lodash.find(users, {id: id})));
  const scrollX = useMotionValue(0);
  const [settingsOpen, setOpen] = useState(false);
  const [scrollXBounds, changeScrollXBounds] = useState(null);

  const onClose = useCallback((settings) => {
    changeSelectedMador(settings.selectedMador);
    setOpen(false);
  });

  const [initialPos, changeInitialPos] = useState({
    x: undefined,
    y: undefined,
  });
  const [dragging, changeDragging] = useState({element: null, id: undefined});

  useEffect(() => {
    const currentPos = canvas.current.getBoundingClientRect();
    if (currentPos.x !== initialPos.x || currentPos.y !== initialPos.y) {
      changeInitialPos(currentPos);
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
    if (draggedElement.current && dragging.element && scrollXBounds) {
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
        console.log('adding', dragging.id, 'to', element.dataset.id);
        addUser(dragging.id, parseInt(element.dataset.id));
      }
      if (element && element.classList.contains(Replace.styledComponentId)) {
        console.log('replacing', dragging.id, 'with', element.dataset.id);
        replaceUser(dragging.id, parseInt(element.dataset.id));
      }
      if (element && element.classList.contains(SetLeader.styledComponentId)) {
        console.log('Setting mador leader ', dragging.id);
        setLeader(dragging.id);
      }
      if (element && element.classList.contains(DroppableDrawer.styledComponentId)) {
        console.log('unsetting', dragging.id);
        unsetUser(dragging.id);
      }
      changeDragging({
        ...dragging,
        element: null,
      });
    }
  }, [dragging, changeDragging, replaceUser, addUser, setLeader, unsetUser]);

  const onTouchStart = useCallback((e, user, level) => {
    setDraggedPos(e);
    const DraggedElement = () => <Avatar kind={user.icon_path}/>;
    changeDragging({
      ...dragging,
      id: user.id,
      level,
      element: DraggedElement,
    });
  }, [setDraggedPos, changeDragging, dragging]);

  return (
    <>
      <HierarchyHolder stretched
                       onTouchMove={onMove}
                       onTouchEnd={onMoveEnd}>
        <Container stretched>
          {
            !leader ? (
                <>
                  <MainManager>
                    <SetLeader/>
                  </MainManager>
                  <Container stretched/>
                </>
              )
              :
              (
                <>
                  <MainManager>
                    <ManagerShrink>
                      <AvatarExpanded kind={leader.icon_path}
                                      name={leader.english_name} rounded
                                      inline/>
                      <Replace data-id={leader.id} initial={{opacity: 0}}
                               animate={{opacity: dragging.element && dragging.id !== leader.id ? 1 : 0}}
                               onTouchStart={(e) => onTouchStart(e, leader, 0)}/>
                    </ManagerShrink>
                    <AddNotch/>
                    <AppendSubject initial={{opacity: 0}}
                                   animate={{
                                     opacity: dragging.element && dragging.id !== leader.id &&
                                     dragging.level !== 1 // to prevent recursion
                                       ? 1 : 0
                                   }}
                                   data-id={leader.id}/>
                  </MainManager>
                  <HierarchyLine/>
                  <Container stretched>
                    <Scroll drag={dragging.element ? false : 'x'}
                            contentHeight="100%"
                            updateBounds={changeScrollXBounds}
                            style={{height: '100%', x: scrollX}}>
                      <Teams stretched row>
                        {teams.map((team) => {
                          const members = lodash.get(team, 'childs', []);
                          const teamLeader = lodash.find(users, {id: team.leader});
                          return <Team key={teamLeader.id}>
                            <TeamLeader>
                              <TopNotch/>
                              <TeamLeaderShrink>
                                <AvatarExpanded kind={teamLeader.icon_path}
                                                name={teamLeader.english_name}
                                                rounded
                                                inline/>
                                <Replace data-id={teamLeader.id}
                                         initial={{opacity: 0}}
                                         animate={{opacity: dragging.element && dragging.id !== teamLeader.id ? 1 : 0}}
                                         onTouchStart={(e) => onTouchStart(e, teamLeader, 1)}/>
                              </TeamLeaderShrink>
                              <AppendSubject initial={{opacity: 0}}
                                             animate={{
                                               opacity: dragging.element && dragging.id !== teamLeader.id &&
                                               dragging.level !== 1 // to prevent recursion
                                                 ? 1 : 0}}
                                             data-id={teamLeader.id}/>
                            </TeamLeader>
                            <MembersWrapper stretched>
                              <Scroll drag={dragging.element ? false : 'y'}
                                      style={{height: '100%'}}>
                                <TeamMembers stretched>
                                  <AnimatePresence>
                                    {members.map((member, index) => {
                                      const user = lodash.find(users, {id: member.leader});
                                      return (
                                        <StyledMotion key={user.id}
                                                      exit={{opacity: 0}}
                                                      initial={{opacity: 0}}
                                                      animate={{opacity: 1}}
                                                      positionTransition>
                                          <Member key={user.id}>
                                            <TopNotch index={index}/>
                                            <MemberShrink>
                                              <StyledMotion
                                                initial={{opacity: 1}}
                                                animate={{opacity: dragging.element && dragging.id === user.id ? 0 : 1}}>
                                                <AvatarExpanded
                                                  kind={user.icon_path}
                                                  name={user.english_name}
                                                  rounded inline/>
                                                <Replace data-id={user.id}
                                                         initial={{opacity: 0}}
                                                         animate={{opacity: dragging.element && dragging.id !== user.id ? 1 : 0}}
                                                         onTouchStart={(e) => onTouchStart(e, user, 2)}/>
                                              </StyledMotion>
                                            </MemberShrink>
                                            <AddNotch
                                              last={members.length === index + 1}/>
                                          </Member>
                                        </StyledMotion>
                                      );
                                    })}
                                  </AnimatePresence>
                                </TeamMembers>
                              </Scroll>
                            </MembersWrapper>
                          </Team>;
                        })}
                      </Teams>
                    </Scroll>
                  </Container>
                </>
              )
          }
          <Options>
            <StyledFab
              size="medium"
              color="secondary"
              aria-label="save"
              onClick={() => saveHierarchy()}
            >
              <SaveIcon/>
            </StyledFab>
            <StyledFab
              size="medium"
              color="secondary"
              aria-label="settings"
              onClick={() => setOpen(true)}
            >
              <AppIcon/>
            </StyledFab>
          </Options>
        </Container>
        <SettingsDialog open={settingsOpen} selectedMador={selectedMador}
                        onClose={onClose}/>
        <SubjectDrawer>
          <AvatarsWrapper>
            <HandleWrapper>
              <DragHandle src={arrowsURL}/>
            </HandleWrapper>
            {
              !loading && (
                <AvatarsContainer>
                  {unsetUsers.map((user, index) => (
                    <AvatarDetails
                      key={index}
                      name={user.english_name}
                      kind={user.icon_path}
                      onTouchStart={(e) => onTouchStart(e, user)}
                    />
                  ))}
                </AvatarsContainer>
              )
            }
          </AvatarsWrapper>
          {
            dragging.element && <DroppableDrawer/>
          }
        </SubjectDrawer>
      </HierarchyHolder>
      <DraggableCanvas ref={canvas}>
        <div ref={draggedElement}
             style={{
               display: 'inline-flex',
               flexDirection: 'column',
               alignItems: 'center',
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
  );
};

const getTreeOf = (id, tree, prev) => {
  if (tree.leader === id) return [tree, prev];
  const childs = lodash.get(tree, 'childs', []);
  for (const child of childs) {
    const retVal = getTreeOf(id, child, tree);
    if (retVal) return retVal;
  }
};

const useUnassignedUsers = (mador) => {
  const [unassignedUsers, setUnassignedUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const users = await UsersService.getUnassignedUsers();
      setUnassignedUsers(users);
    })();
  }, [mador]);

  return [unassignedUsers, setUnassignedUsers];
};


const useHierarchy = (mador) => {
  const [currentHierarchy, changeCurrentHierarchy] = useState({
    leader: null,
    childs: []
  });
  const [originalHierarchy, changeOriginalHierarchy] = useState(null);
  useEffect(() => {
    (async () => {
      if (mador) {
        const hierarchy = await MadorsService.getHierarchy(mador);
        changeOriginalHierarchy(hierarchy);
        changeCurrentHierarchy(hierarchy);
      }
    })();
  }, [mador]);
  return [currentHierarchy, changeCurrentHierarchy, originalHierarchy];
};

const useMyMador = () => {
  const {mador} = useMe();
  const [selectedMador, changeSelectedMador] = useState(mador?.name);

  useEffect(() => {
    changeSelectedMador(mador?.name);
  }, [mador]);
  return [selectedMador, changeSelectedMador];
};

export const Hierarchy = React.memo((props) => {
  const dispatch = useDispatch();
  const [selectedMador, changeSelectedMador] = useMyMador();
  const [unassignedUsers, setUnassignedUsers] = useUnassignedUsers(selectedMador);
  const [currentHierarchy, changeCurrentHierarchy] = useHierarchy(selectedMador);

  const getAllChilds = useCallback((tree) => {
    if (tree.childs.length === 0) return [tree.leader];
    const lists = tree.childs.map(child => getAllChilds(child)).flat();
    return [tree.leader, ...lists];
  });

  const setLeader = useCallback((leaderId) => {
    changeCurrentHierarchy({
      leader: leaderId,
      childs: []
    });
    setUnassignedUsers(lodash.without(unassignedUsers, leaderId));
  });

  const unsetUser = useCallback((id) => {
    const newHierarchy = lodash.cloneDeep(currentHierarchy);
    const removeTree = getTreeOf(id, newHierarchy, null);

    if (!removeTree) {
      return; // user already not in tree..
    }
    const [fromTree, fromTreeParent] = removeTree;

    // remove from parent
    if (!fromTreeParent) {
      changeCurrentHierarchy({leader: null, childs: []});  // new hierarchy
      return;
    }

    if(fromTree.childs.length > 0) {
      dispatch(newNotification({
        message: "Removing a commander with soldiers is not allowed!"
      }));
      return;
    }

    lodash.pull(fromTreeParent.childs, fromTree);  // remove self from tree
    changeCurrentHierarchy(newHierarchy);

    setUnassignedUsers([...unassignedUsers, id]);
  });

  const replaceUser = useCallback((id1, id2) => {
    const newHierarchy = lodash.cloneDeep(currentHierarchy);
    const replaceFromTree = getTreeOf(id1, newHierarchy, null);
    const replaceToTree = getTreeOf(id2, newHierarchy, null);


    if (!replaceToTree) {
      throw new Error(`Invalid ids given! couldn't find id ${id2} in hierarchy tree`);
    }

    const [toTree] = replaceToTree;
    toTree.leader = id1;

    if (replaceFromTree) {
      const [fromTree] = replaceFromTree;
      fromTree.leader = id2;
    } else {
      // id1 wanst in hierarchy to begin with
      // so delete id2 and remove id1 from unassigned
      const newUnassigned = lodash.without(unassignedUsers, id1);
      newUnassigned.push(id2);
      setUnassignedUsers(newUnassigned);
    }

    changeCurrentHierarchy(newHierarchy);
  });

  const addUser = useCallback((id1, id2) => {
    const newHierarchy = lodash.cloneDeep(currentHierarchy);
    const addFromTree = getTreeOf(id1, newHierarchy, null);
    const addToTree = getTreeOf(id2, newHierarchy, null);


    if (!addToTree) {
      throw new Error(`Invalid ids given! couldn't find id ${id2} in hierarchy tree`);
    }

    const [toTree] = addToTree;
    toTree.childs = lodash.get(toTree, 'childs', []);
    if (addFromTree) {
      const [fromTree, fromTreeParent] = addFromTree;
      // // add all childs of current to parent
      // fromTreeParent.childs.push(...(fromTree.childs || []));
      // // delete childs of current
      // fromTree.childs = [];
      // remove from parent
      lodash.pull(fromTreeParent.childs, fromTree);
      toTree.childs.push(fromTree);
    } else {
      toTree.childs.push({
        leader: id1,
        childs: []
      });
      setUnassignedUsers(lodash.without(unassignedUsers, id1));
    }

    changeCurrentHierarchy(newHierarchy);
  });

  const saveHierarchy = useCallback(() => {
    MadorsService.updateHierarchy(selectedMador, currentHierarchy, unassignedUsers);
  });
  return (
    <PageContainer stretched>
      <Build hierarchy={currentHierarchy}
             replaceUser={replaceUser}
             addUser={addUser}
             setLeader={setLeader}
             unsetUser={unsetUser}
             saveHierarchy={saveHierarchy}
             selectedMador={selectedMador}
             changeSelectedMador={changeSelectedMador}
             unsetUsersIds={unassignedUsers}
      />
    </PageContainer>
  );
});

Hierarchy.displayName = 'Hierarchy';

export default Hierarchy;
