import React from 'react';
import mockAxios from 'jest-mock-axios';
import {render, fireEvent, act} from '@testing-library/react';
import {StyledApp} from '~/App';
import {renderWithRedux} from './utils/helpers';
import ResizeObserver from './__mocks__/ResizeObserver';
import {createStore} from 'redux';

describe('Render all screens', () => {
  test('render main app', () => {
    const {container} = renderWithRedux(<StyledApp/>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('test screen navigation', () => {
    fetch.mockResponse(() => new Promise(() => {
      return '<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />';
    }));
    const {container} = renderWithRedux(<StyledApp/>, {
      store: createStore(() => ({
        general: {login: true, reasons: ["reason1", "reason2"]},
        users: {me: {english_name: "Elran Shefer"}},
      })),
    });
    expect(container.firstChild).toMatchSnapshot();
    const menuButton = container.querySelector("[id='openMainmenu']");
    fireEvent.click(menuButton);
    expect(container.firstChild).toMatchSnapshot();
    const commanderButton = container.querySelector("[id='commanderButton']");
    fireEvent.click(commanderButton);
    expect(container.firstChild).toMatchSnapshot();

    const hierarchyButton = container.querySelector("[id='hierarchyButton']");
    fireEvent.click(hierarchyButton);
    expect(container.firstChild).toMatchSnapshot();

    const operatorButton = container.querySelector("[id='operatorButton']");
    fireEvent.click(operatorButton);
    expect(container.firstChild).toMatchSnapshot();
  });
});
