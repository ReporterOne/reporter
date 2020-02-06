import React, {useCallback, useState} from 'react';
import styled from 'styled-components';
import {Textfit} from 'react-textfit';
import lodash from 'lodash';

import {Container, RoundedContainer, theme} from '~/components/common';
import Calender from '~/components/Calendar';
import AttendingButton from '~/components/AttendingButton';
import ReasonsDialog from '~/dialogs/Reasons';
import {useDispatch, useSelector} from 'react-redux';
import DateStatusService from '~/services/date_datas';
import {
  HERE,
  NOT_ANSWERED,
  NOT_HERE,
} from '~/utils/utils';
import {logoutIfNoPermission} from '~/hooks/utils';
import UsersService from '~/services/users';
import {
  updateDates,
  updateDay,
  updateToday,
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
  const {english_name: englishName = undefined, id = undefined} = useSelector((state) => state.users.me || {});
  const [openDialog, changeOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const {
    state: todayState = NOT_ANSWERED,
    reason: todayReason = null,
  } = useSelector((state) => lodash.find(state.calendar.dates?.[selectedDate]?.data, {user_id: id}) ?? {});

  const changeSelectedDate = useCallback((data) => {
    setSelectedDate(data.date);
  });
  const fetchDates = useCallback(async (start, end, today) => {
    await logoutIfNoPermission(async () => {
      const data = await UsersService.getMyCalendar({start, end});
      dispatch(updateDates(data));
      const todayData = lodash.find(data, {date: formatDate(today)});
      if (todayData) {
        dispatch(updateToday(todayData));
      }
    }, dispatch);
  }, [dispatch]);

  const handleClose = useCallback((value) => {
    changeOpenDialog(false);
    UsersService.setMyCalendar({
      state: NOT_HERE,
      reason: value,
      start: selectedDate,
    }).then((data) => {
      const key = Object.keys(data)[0];
      const value = Object.values(data)[0];
      dispatch(updateDay(key, value));
    });
  });

  const handleOnChange = useCallback((state) => {
    if (state === NOT_HERE) {
      changeOpenDialog(true);
    } else {
      if (state === HERE) {
        UsersService.setMyCalendar({
          start: selectedDate,
          state: HERE,
        }).then((data) => {
          const key = Object.keys(data)[0];
          const value = Object.values(data)[0];
          dispatch(updateDay(key, value));
        });
      } else {
        DateStatusService.deleteToday({userId: id}).then(() => {
          dispatch(updateDay(formatDate(new Date()), null));
        });
      }
    }
  });

  return (
    <Container stretched>
      <Container flex={2} style={{padding: '15px'}}>
        <WelcomeMessage>
          <HeaderWelcome>Welcome,</HeaderWelcome>
          <HeaderName mode="single" max={45}>{lodash.capitalize(englishName)}</HeaderName>
        </WelcomeMessage>
        <AttendingButton missingReason={todayReason?.name} onChange={handleOnChange} initialState={todayState}/>
      </Container>
      <RoundedContainer flex={4} shadow={5} background={theme.cards}>
        <Calender userId={id} fetchData={fetchDates} selectedDate={selectedDate} setSelectedDate={changeSelectedDate}/>
      </RoundedContainer>
      <ReasonsDialog open={openDialog} selectedValue={todayReason?.name} onClose={handleClose}/>
    </Container>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
