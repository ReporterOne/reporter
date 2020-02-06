import React from 'react';
import {render, fireEvent, wait} from '@testing-library/react';
import {createStore} from 'redux';
import ResizeObserver from './__mocks__/ResizeObserver';
import {renderWithRedux} from './utils/helpers';

import Calendar from '~/components/Calendar/Calendar';
import {createTouchEventObject} from "./eventHelpers";
import {statusList} from "~/utils/statusList";
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

describe("Calendar", () => {
  test("move prev month", async () => {
    const date = new Date();
    date.setMonth(date.getMonth()-1);
    const currentMonth = monthNames[date.getMonth()];
    const {container, getAllByRole} = renderWithRedux(<Calendar />,
      {
      store: createStore(() => ({
        calendar: {loading: false, dates: statusList},
        general: {login: true, reasons: ["reason1", "reason2"]},
        users: {me: {english_name: "Elran Shefer"}},
      })),
    });
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
    const {container, getAllByRole} = renderWithRedux(<Calendar />,
      {
        store: createStore(() => ({
          calendar: {loading: false, dates: statusList},
          general: {login: true, reasons: ["reason1", "reason2"]},
          users: {me: {english_name: "Elran Shefer"}},
        })),
      });
    // slide right
    fireEvent.touchStart(container.firstChild, createTouchEventObject({x: 150, y: 100, timeStamp: 8077.299999946263}));
    fireEvent.touchMove(container.firstChild, createTouchEventObject({x: 100, y: 100, timeStamp: 8100.99999996600}));
    fireEvent.touchEnd(container.firstChild, createTouchEventObject({}));
    expect(getAllByRole("monthName")[1].textContent).toBe(` ${currentMonth} `)
  })
});