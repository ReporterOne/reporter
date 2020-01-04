import React from 'react';
import {render, fireEvent, act} from '@testing-library/react';
import {shallow, mount} from 'enzyme';
import AttendingButton, {Circle} from '~/components/AttendingButton/AttendingButton';
import {createBubbledEvent} from './utils/events';


describe('Test Attending Button', () => {
  test('Basic tests', () => {
    const func = jest.fn();
    fetch.mockResponse(() => new Promise(() => {
      return '<circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />';
    }));
    act(() => {
      const {container} =
        render(<AttendingButton missingReason="test" onChange={func}/>);
      expect(container).toMatchSnapshot();
    });
  });
  test('Test missing', () => {
    const func = jest.fn();
    act(() => {
      const {container} =
        render(<AttendingButton missingReason="testing" onChange={func} initialState="notHere"/>);
      expect(container).toMatchSnapshot();
    });
  });
  test('Test here', () => {
    const func = jest.fn();
    act(() => {
      const {container} =
        render(<AttendingButton missingReason="testing" onChange={func} initialState="here"/>);
      expect(container).toMatchSnapshot();
    });
  });
});
