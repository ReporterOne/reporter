import React from 'react';
import mockAxios from 'jest-mock-axios';
import AuthService, {PermissionsError} from '~/services/auth';
import DateDatasService from '~/services/date_datas';

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
    mockAxios.mockResponse({
      data: reasons,
    });
    expect(request).resolves.toBe(reasons);
    expect(mockAxios.get).toBeCalledWith('/api/v1/dates_status/reasons',
      {"headers": {"Authorization": "Bearer null"}});
  });
  test("get reasons permissions error", () => {
    const request = DateDatasService.getReasons();
    mockAxios.mockError({
      response: {
        status: 401,
        data: {
          details: "permission denied!"
        }
      },
    });
    expect(request).rejects.toThrow(PermissionsError);
    expect(mockAxios.get).toBeCalledWith('/api/v1/dates_status/reasons',
      {"headers": {"Authorization": "Bearer null"}});
  });
  test.skip("get date datas", () => {
    const data = "example data";
    const request = DateDatasService.getDateData({
      start: 0, end: 100, userId: 0
    });
    mockAxios.mockResponse({
      data: data,
    });
    expect(request).resolves.toBe(data);
    expect(mockAxios.get).toBeCalledWith('/api/v1/dates_status',
      {
        params: {start: 0, end: 100, user_id: 0},
        headers: {"Authorization": "Bearer null"},
      },
    );
  });
  test.skip("get date datas permissions error", () => {
    const request = DateDatasService.getDateData({
      start: 0, end: 100, userId: 0
    });
    mockAxios.mockError({
      response: {
        status: 401,
        data: {
          details: "permission denied!"
        }
      },
    });
    expect(request).rejects.toThrow(PermissionsError);
    expect(mockAxios.get).toBeCalledWith('/api/v1/dates_status',
      {
        params: {start: 0, end: 100, user_id: 0},
        headers: {"Authorization": "Bearer null"}
      });
  });
})