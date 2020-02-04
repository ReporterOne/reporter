import React from 'react';
import mockAxios from 'jest-mock-axios';
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
  test("get reasons permissions error", () => {
    const request = DateDatasService.getReasons();
    expectHTTP(request).get('/api/v1/dates_status/reasons').toPermissionFail();
  });
  test("get date datas", () => {
    const data = "example data";
    const request = DateDatasService.getDateData({
      start: 0, end: 100, userId: 0
    });
    expectHTTP(request).get('/api/v1/dates_status/').withQuery({
      start: 0, end: 100, user_id: 0
    }).toReturn(data);
  });
  test("get date datas permissions error", () => {
    const request = DateDatasService.getDateData({
      start: 0, end: 100, userId: 0
    });
    expectHTTP(request).get('/api/v1/dates_status/').withQuery({
      start: 0, end: 100, user_id: 0
    }).toPermissionFail();
  });
});
