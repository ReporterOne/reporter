import React from 'react';
import {datesformatter} from '~/components/Calendar/components/Cells';

import {statusList} from '~/utils/statusList'; 


describe('Test daysformatter', () => {
  test('Test basic logic', () => {
    
    const mockedDates = statusList.slice(0,7);
    const today = 1;
    const expectedReturn = {
      1:{status: 'notHere', when: 'Start'},
      2:{status: 'notHere', when: 'Mid'},
      3:{status: 'notHere', when: 'Mid'},
      4:{status: 'notHere', when: 'End'},
      5:{status: 'here', when: 'Start'},
      6:{status: 'here', when: 'End'},
      7:{status: 'notHere', when: 'Single'}
    }

    const returnedAnswer = datesformatter(mockedDates, today);

    expect(returnedAnswer).toEqual(expectedReturn);

  });
});

