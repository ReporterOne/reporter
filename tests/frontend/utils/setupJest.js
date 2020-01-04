import fetchMock from 'jest-fetch-mock';
import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import 'jest-localstorage-mock';

configure({adapter: new Adapter()});
fetchMock.enableMocks();
jest.useFakeTimers();
