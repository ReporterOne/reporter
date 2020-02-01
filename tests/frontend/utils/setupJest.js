import fetchMock from 'jest-fetch-mock';
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import 'jest-localstorage-mock';

fetchMock.enableMocks();
jest.useFakeTimers();

Enzyme.configure({ adapter: new Adapter() });