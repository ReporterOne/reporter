import React, {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';

import {Container, RoundedContainer, theme, FadeInContainer} from '~/components/common';
import Calender from '~/components/Calendar';
import AttendingButton from '~/components/AttendingButton';
import AvatarDetails from '~/components/Avatar/AvatarDetails.jsx';
import {users} from '~/utils/users';
import ReasonsDialog from '~/dialogs/Reasons';
import {formatDate} from "~/components/Calendar/components/utils";
import {HERE, NOT_ANSWERED, NOT_HERE} from "~/utils/utils";
import {useDispatch, useSelector} from "react-redux";
import lodash from "lodash";
import {
  deleteDateOf,
  fetchDatesOf,
  fetchMyDates,
  setDateStatus
} from "~/actions/calendar";

const Header = styled(Container)`
  padding: 0 0 30px 0;
  height: 80px;
  flex: unset;
  justify-content: center;
`;

const WelcomeMessage = styled(Container)`
  padding: 0px 50px;
  margin: auto;
`;

const HeaderWelcome = styled.h2`
  margin: 0;
  margin-left: -12%;
  color: white;
  font-weight: 600;
  font-size: 1.4rem;
`;

const HeaderName = styled.h2`
  margin: 0;
  color: white;
  font-weight: 300;
  font-size: 2rem;
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


const useSoldiers = () => {
  const {all: users, subjects} = useSelector(state => state.users);
  return useMemo(() => lodash.compact(subjects.map(subject => lodash.find(users, {id: subject}))), [users, subjects]);
};


export const Commander = React.memo((props) => {
  const dispatch = useDispatch();
  const [selectedSoldier, changeSelectedSoldier] = useState(null);

  const [openDialog, changeOpenDialog] = useState(false);
  const [selectedValue, changeSelectedValue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const changeSelectedDate = useCallback((data) => {
    setSelectedDate(data.date);
  });

  const subjects = useSoldiers();

  const {
    state: todayState = NOT_ANSWERED,
    reason: todayReason = null,
  } = useSelector((state) => lodash.find(state.calendar.dates?.[selectedDate]?.data, {user_id: selectedSoldier?.id}) ?? {});

  const fetchDates = useCallback((start, end) => {
    if (selectedSoldier)
      dispatch(fetchDatesOf(selectedSoldier.id, start, end));
  }, [dispatch, selectedSoldier]);

  const handleClose = useCallback((value) => {
    changeOpenDialog(false);
    dispatch(setDateStatus({
      userId: selectedSoldier.id,
      start: selectedDate,
      status: NOT_HERE,
      reason: value,
    }));
  });

  const handleOnChange = useCallback((state) => {
    const id = selectedSoldier.id;
    if (state === NOT_HERE) {
      changeOpenDialog(true);
    } else if (state === HERE) {
      dispatch(setDateStatus({userId: id, start: selectedDate, status: HERE}));
    } else {
      dispatch(deleteDateOf(id, selectedDate));
    }
  });

  const handleSelectedSoldier = useCallback((value) => {
    changeSelectedValue(null);
    changeSelectedSoldier(value);
    console.log(value);
  });

  return (
    <Container stretched>
      <Header>
        <FadeInContainer poseKey={selectedSoldier === null}>
          {
            selectedSoldier ?(
              <AttendingButton key={`${selectedDate}.${selectedSoldier.id}`} missingReason={todayReason?.name}
                               onChange={handleOnChange} initialState={todayState}
                               isDisabled={selectedDate < formatDate(new Date())}/>)
              :
              <WelcomeMessage>
                <HeaderWelcome>Hello,</HeaderWelcome>
                <HeaderName>Commander.</HeaderName>
              </WelcomeMessage>
          }
        </FadeInContainer>
      </Header>
      <RoundedContainer flex={4} shadow={5} background={theme.cards}>
        <Calender key="static" userId={selectedSoldier?.id} fetchData={fetchDates}
                  selectedDate={selectedDate}
                  setSelectedDate={changeSelectedDate}/>
      </RoundedContainer>
      <SubjectDrawer>
        <AvatarsWrapper>
          <AvatarsContainer>
            {subjects.map((user, index) => (
              <AvatarDetails
                key={index}
                onClick={() => {
                  handleSelectedSoldier( selectedSoldier !== user ? user : null);
                }}
                name={user.english_name}
                isFaded={selectedSoldier && user !== selectedSoldier}
                kind={user.icon_path}
                status={user.status}
                jumping={true}
              />
            ))}
          </AvatarsContainer>
        </AvatarsWrapper>
      </SubjectDrawer>
      <ReasonsDialog open={openDialog} selectedValue={selectedValue} onClose={handleClose}/>
    </Container>
  );
});

Commander.displayName = 'Commander';

export default Commander;
