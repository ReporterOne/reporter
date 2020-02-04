import mockAxios from 'jest-mock-axios';
import {PermissionsError} from "~/services/auth";

class Request {
  constructor(request) {
    this.request = request;
    this._url = '';
    this._method = '';
    this._query = undefined;
    this._body = undefined;
    this._headers = {
      "Authorization": 'Bearer null'
    };
  }
  toReturn(data) {
    mockAxios.mockResponse({
      data,
    });
    expect(this.request).resolves.toBe(data);
    this.toInvoke()
  }
  toPermissionFail() {
    mockAxios.mockError({
      response: {
        status: 401,
        data: {
          details: "permission denied!"
        }
      },
    });
    expect(this.request).rejects.toThrow(PermissionsError);
    this.toInvoke()
  }
  toInvoke() {
    expect(mockAxios.request).toBeCalledWith(
      {
        'method': this._method,
        'url': this._url,
        'params': this._query,
        'data': this._body,
        'headers': this._headers
      }
    )
  }
  withQuery(query) {
    this._query = query;
    return this;
  }
  withHeader(headers) {
    this._headers = headers;
    return this;
  }
  withBody(body) {
    this._body = body;
    return this;
  }
  get(url) {
    this._method = 'get';
    this._url = url;
    return this;
  }
  post(url) {
    this._method = 'post';
    this._url = url;
    return this;
  }
  put(url) {
    this._method = 'put';
    this._url = url;
    return this;
  }
  delete(url) {
    this._method = 'delete';
    this._url = url;
    return this;
  }
  head(url) {
    this._method = 'head';
    this._url = url;
    return this;
  }
  trace(url) {
    this._method = 'trace';
    this._url = url;
    return this;
  }
  patch(url) {
    this._method = 'patch';
    this._url = url;
    return this;
  }
  connect(url) {
    this._method = 'connect';
    this._url = url;
    return this;
  }
}

export const expectHTTP = (request) => {
  return new Request(request);
};

export default expectHTTP;
