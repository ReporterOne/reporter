import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {Textfit} from 'react-textfit';
import lodash from 'lodash';

import {Container, RoundedContainer, theme} from '~/components/common';
import Calender from '~/components/Calendar';
import AttendingButton from '~/components/AttendingButton';
import ReasonsDialog from '~/dialogs/Reasons';
import {useDispatch, useSelector} from 'react-redux';
import {
  HERE,
  NOT_ANSWERED,
  NOT_HERE, titleCase,
} from '~/utils/utils';
import {
  deleteDateOf,
  fetchMyDates, setDateStatus,
} from '~/actions/calendar';
import {formatDate} from '~/components/Calendar/components/utils';


const HeaderWelcome = styled.h2`
  margin: 0;
  /* margin-left: 8%; */
  color: white;
  font-weight: 600;
  font-size: 1.4rem;
`;

const HeaderName = styled(Textfit)`
  color: white;
  font-weight: 300;
  margin-left: 5%;
`;


const WelcomeMessage = styled(Container)`
  padding: 0px 20px;
`;


const Dashboard = React.memo((props) => {
  const dispatch = useDispatch();
  const {
    english_name: englishName = undefined,
    id = undefined,
  } = useSelector((state) => lodash.find(state.users.all, {id: state.users.me}) ?? {});
  const [openDialog, changeOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const {
    state: todayState = NOT_ANSWERED,
    reason: todayReason = null,
  } = useSelector((state) => lodash.find(state.calendar.dates?.[selectedDate]?.data, {user_id: id}) ?? {});

  const changeSelectedDate = useCallback((data) => {
    setSelectedDate(data.date);
  });
  const fetchDates = useCallback((start, end) => {
    dispatch(fetchMyDates(start, end));
  }, [dispatch]);

  const handleClose = useCallback((value) => {
    changeOpenDialog(false);
    dispatch(setDateStatus({
      userId: id,
      start: selectedDate,
      status: NOT_HERE,
      reason: value,
    }));
  });

  const handleOnChange = useCallback((state) => {
    if (state === NOT_HERE) {
      changeOpenDialog(true);
    } else if (state === HERE) {
      dispatch(setDateStatus({userId: id, start: selectedDate, status: HERE}));
    } else {
      dispatch(deleteDateOf(id, selectedDate));
    }
  });

  return (
    <Container stretched>
      <Container flex={2} style={{padding: '15px'}}>
        <WelcomeMessage>
          <HeaderWelcome>Welcome,</HeaderWelcome>
          <HeaderName mode="single"
            max={45}>{titleCase(englishName)}</HeaderName>
        </WelcomeMessage>
        <AttendingButton missingReason={todayReason?.name}
          onChange={handleOnChange} initialState={todayState}
          isDisabled={selectedDate < formatDate(new Date())}/>
      </Container>
      <RoundedContainer flex={4} shadow={5} background={theme.cards}>
        <Calender key="static" userId={id} fetchData={fetchDates}
          selectedDate={selectedDate}
          setSelectedDate={changeSelectedDate}/>
      </RoundedContainer>
      <ReasonsDialog open={openDialog} selectedValue={todayReason?.name}
        onClose={handleClose}/>
    </Container>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
