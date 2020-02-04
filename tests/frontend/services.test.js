import React from 'react';
import mockAxios from 'jest-mock-axios';
import mockDate from 'mockdate';
import AuthService from '~/services/auth';
import DateDatasService from '~/services/date_datas';
import expectHTTP from "./utils/expect_http";

describe("test auth service", () => {
  test("login and logout", () => {
    const thenFn = jest.fn().mockImplementation((response) => {
      expect(mockAxios.post).toBeCalledWith('/api/login', "username=elran&password=test",
        {"headers": {"content-type": "application/x-www-form-urlencoded;charset=utf-8"}});
      expect(localStorage.setItem).toBeCalledWith("token", "token");
      expect(localStorage.__STORE__["token"]).toBe("token");
      AuthService.logout();
      expect(localStorage.__STORE__["token"]).toBe(undefined);
    });
    AuthService.login("elran", "test").then(thenFn);
    mockAxios.mockResponse({
      data: {
        access_token: "token"
      },
    });
  });
});

describe("test date_datas service", () => {
  test("get reasons", () => {
    const reasons = ["reason1", "reason2"];
    const request = DateDatasService.getReasons();
    expectHTTP(request).get('/api/v1/dates_status/reasons').toReturn(reasons);
  });
  test("permissions error", () => {
    const request = DateDatasService.getReasons();
    expectHTTP(request).get('/api/v1/dates_status/reasons').toPermissionFail();
  });
  test.skip("get date datas", () => {
    const data = "example data";
    const request = DateDatasService.getDateData({
      start: 0, end: 100, userId: 0
    });
    expectHTTP(request).get('/api/v1/dates_status/').withQuery({
      start: 0, end: 100, user_id: 0
    }).toReturn(data);
  });
  test("delete today", () => {
    mockDate.set("01/01/2020", 0);
    const request = DateDatasService.deleteToday({
      userId: 0
    });
    expectHTTP(request).delete('/api/v1/dates_status/').withBody({
      start_date: 1577836800, user_id: 0
    }).toReturn({});
  });
  test("set today here", () => {
    mockDate.set("01/01/2020", 0);
    const request = DateDatasService.setToday({
      userId: 0,
      state: 'here'
    });
    expectHTTP(request).post('/api/v1/dates_status/').withBody({
      start_date: 1577836800, user_id: 0, state: 'here', reason: null
    }).toReturn({});
  });
  test("set today not here", () => {
    mockDate.set("01/01/2020", 0);
    const request = DateDatasService.setToday({
      userId: 0,
      state: 'not_here',
      reason: 'Sick',
    });
    expectHTTP(request).post('/api/v1/dates_status/').withBody({
      start_date: 1577836800, user_id: 0, state: 'not_here', reason: 'Sick'
    }).toReturn({});
  });
  test("add datedatas here", () => {
    const request = DateDatasService.addDateData({
      userId: 0,
      start: 0,
      end: 100,
      state: 'here'
    });
    expectHTTP(request).post('/api/v1/dates_status/').withBody({
      start_date: 0, end_date: 100, user_id: 0, state: 'here', reason: null
    }).toReturn({});
  });
});
