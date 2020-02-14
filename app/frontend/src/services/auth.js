import qs from 'qs';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const PREFIX = '/api';

/** Permissions Error in-case the request was Bad.*/
export class PermissionsError extends Error {}

/** Auth service for authentication with the server. */
class AuthService {
  /**
   * Login to the server and save token in local storage.
   * @param {string} username - username to login with
   * @param {string} password - password to login with
   * @return {Promise<*>}
   */
  async login(username, password) {
    const response = await axios.post(`${PREFIX}/login`, qs.stringify({
      username, password,
    }),
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    },
    );
    localStorage.setItem('token', response.data.access_token);
    return response.data.user_id;
  }

  /**
   * Register to the server.
   * @param {string} username - username to login with
   * @param {string} password - password to login with
   * @param {string} email - email to login with
   * @param {string} name - name to login with
   * @param {string} avatar
   * @return {Promise<*>}
   */
  async register(username, password, email, name, avatar) {
    const response = await axios.request({
      url: `${PREFIX}/register`,
      method: 'post',
      data: {
        username, password, email, name, avatar,
      },
    });
    return response;
  }

  /**
   * Check if user free.
   * @param {string} value - value of username to check if free.
   * @param {string} type - 'local' 'facebook' or 'google'
   * @return {Promise<AxiosResponse<T>>}
   */
  async isFree(value, type='local') {
    return await axios.request({
      url: `${PREFIX}/is_free`,
      method: 'post',
      data: {
        value,
        type,
      },
    });
  }

  /**
   * Register with facebook.
   * @param {string} token
   * @param {string} email
   * @param {string} name
   * @param {string} avatar
   * @return {Promise<AxiosResponse<T>>}
   */
  async facebookRegister(token, email, name, avatar) {
    const response = await axios.request(
        {
          url: `${PREFIX}/register/facebook`,
          method: 'post',
          data: {
            facebook_token: token,
            email, name, avatar,
          },
        },
    );
    return response;
  }

  /**
   * Login using google.
   * @param {string} token
   * @return {Promise<*>}
   */
  async facebookLogin(token) {
    const response = await axios.request(
        {
          url: `${PREFIX}/login/facebook`,
          method: 'post',
          data: {
            facebook_token: token,
          },
        },
    );
    localStorage.setItem('token', response.data.access_token);
    return response.data.user_id;
  }

  /**
   * register using google.
   * @param {string} token
   * @param {string} email
   * @param {string} name
   * @param {string} avatar
   * @return {Promise<*>}
   */
  async googleRegister(token, email, name, avatar) {
    const response = await axios.request(
        {
          url: `${PREFIX}/register/google`,
          method: 'post',
          data: {
            google_token: token,
            email, name, avatar,
          },
        },
    );
    return response;
  }

  /**
   * Login using google.
   * @param {string} token
   * @return {Promise<*>}
   */
  async googleLogin(token) {
    const response = await axios.request(
        {
          url: `${PREFIX}/login/google`,
          method: 'post',
          data: {
            google_token: token,
          },
        },
    );
    localStorage.setItem('token', response.data.access_token);
    return response.data.user_id;
  }

  /**
   * Logout from the server and remove token from the localstorage.
   * @return {Promise<void>}
   */
  async logout() {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token');
    }
  }

  /**
   * Check if user is logged in.
   * @return {boolean}
   */
  isLoggedIn() {
    return this.getToken() !== null;
  }

  /**
   * Get user id from token.
   * @return {int} - user id
   */
  getUserId() {
    try {
      const token = this.getToken();
      const decoded = jwt_decode(token);
      return decoded.id;
    } catch (e) {
      return null;
    }
  }

  /**
   * Get token from the local storage.
   * @return {string}
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * get the authorization header needed for requests.
   * @return {{Authorization: string}}
   */
  getAuthHeader() {
    return {Authorization: 'Bearer ' + this.getToken()};
  }
}

export default new AuthService();
