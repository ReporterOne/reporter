import React from 'react';
import {render, fireEvent, wait} from '@testing-library/react';
import {renderWithRedux} from './utils/helpers';

import Calendar from '~/components/Calendar/Calendar';
import {createTouchEventObject} from "./eventHelpers";
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

describe("Calendar", () => {
  test("move prev month", async () => {
    const date = new Date();
    date.setMonth(date.getMonth()-1);
    const currentMonth = monthNames[date.getMonth()];
    const {container, getAllByRole} = renderWithRedux(<Calendar />);
    //slide left
    fireEvent.touchStart(container.firstChild, createTouchEventObject({x: 100, y: 100, timeStamp: 8077.299999946263}));
    fireEvent.touchMove(container.firstChild, createTouchEventObject({x: 150, y: 100, timeStamp: 8100.99999996600}));
    fireEvent.touchEnd(container.firstChild, createTouchEventObject({}));
    expect(getAllByRole("monthName")[1].textContent).toBe(` ${currentMonth} `)
  })
  test("move next month", async () => {
    const date = new Date();
    date.setMonth(date.getMonth() +1);
    const currentMonth = monthNames[date.getMonth()];
    const {container, getAllByRole} = renderWithRedux(<Calendar />);
    // slide right
    fireEvent.touchStart(container.firstChild, createTouchEventObject({x: 150, y: 100, timeStamp: 8077.299999946263}));
    fireEvent.touchMove(container.firstChild, createTouchEventObject({x: 100, y: 100, timeStamp: 8100.99999996600}));
    fireEvent.touchEnd(container.firstChild, createTouchEventObject({}));
    expect(getAllByRole("monthName")[1].textContent).toBe(` ${currentMonth} `)
  })
});