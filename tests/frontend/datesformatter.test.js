import React from 'react';
import {datesFormatter} from '~/components/Calendar/components/Cells';

import {statusList} from '~/utils/statusList'; 


describe('Test daysformatter', () => {
  test('Test basic logic', () => {
    
    const mockedDates = statusList.slice(0,7);
    const today = 1;
    const expectedReturn = {
      1:{status: 'notHere', type: 'Start'},
      2:{status: 'notHere', type: 'Mid'},
      3:{status: 'notHere', type: 'Mid'},
      4:{status: 'notHere', type: 'End'},
      5:{status: 'here', type: 'Start'},
      6:{status: 'here', type: 'End'},
      7:{status: 'notHere', type: 'Single'}
    };

    const returnedAnswer = datesFormatter(mockedDates, today);

    expect(returnedAnswer).toEqual(expectedReturn);

  });
});

