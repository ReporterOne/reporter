import React from 'react';
import mockAxios from 'jest-mock-axios';
import {render, fireEvent, act} from '@testing-library/react';
import { createMemoryHistory } from "history";
import {StyledApp} from '~/App';
import {renderWithRedux} from './utils/helpers';
import ResizeObserver from './__mocks__/ResizeObserver';
import {createStore} from 'redux';

describe('Render all screens', () => {
  test('render main app', () => {
    const history = createMemoryHistory();
    const {container} = renderWithRedux(<StyledApp/>, {
      history
    });
    expect(history.location.pathname).toBe("/entrance");
  });

  test('test screen navigation', () => {
    fetch.mockResponse(() => new Promise(() => {
      return '<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />';
    }));
    const history = createMemoryHistory();
    const {container} = renderWithRedux(<StyledApp/>, {
      history,
      store: createStore(() => ({
        general: {login: true, reasons: ["reason1", "reason2"]},
        users: {me: {english_name: "Elran Shefer"}},
      })),
    });

    expect(history.location.pathname).toBe("/");
    const menuButton = container.querySelector("[id='openMainmenu']");
    fireEvent.click(menuButton); // test if we still at the same page
    expect(history.location.pathname).toBe("/");

    const commanderButton = container.querySelector("[id='commanderButton']");
    fireEvent.click(commanderButton);
    expect(history.location.pathname).toBe("/commander");


    const hierarchyButton = container.querySelector("[id='hierarchyButton']");
    fireEvent.click(hierarchyButton);
    expect(history.location.pathname).toBe("/hierarchy");

    const operatorButton = container.querySelector("[id='operatorButton']");
    fireEvent.click(operatorButton);
    expect(history.location.pathname).toBe("/operator");
  });
});
