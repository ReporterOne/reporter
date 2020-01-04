import React from 'react';
import {render, fireEvent, act} from '@testing-library/react';

import {Avatar} from '~/components/Avatar/Avatar';
import AvatarDetails from '~/components/Avatar/AvatarDetails';
import AvatarExpanded from '~/components/Avatar/AvatarExpanded';


describe('Test avatar component', () => {
  test('Basic Avatar', () => {
    act(() => {
      const {container, getByRole} = render(<Avatar/>);
      expect(container.firstChild).toMatchSnapshot();
      fireEvent.click(getByRole('img')); // assert it does nothing on click
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  test('Avatar jumping', () => {
    act(() => {
      const {container, getByRole} = render(<Avatar jumping={true}/>);
      fireEvent.click(getByRole('img'));
      jest.runAllTimers();
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('Test Avatar Details component', () => {
  test('Basic Avatar Details', () => {
    act(() => {
      const {container} = render(<AvatarDetails name="User Name"/>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

describe('Test Avatar Expanded component', () => {
  test('Basic Avatar Expanded', () => {
    act(() => {
      const {container} = render(<AvatarExpanded name="User Name"/>);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
