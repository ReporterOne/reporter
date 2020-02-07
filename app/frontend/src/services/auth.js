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
   * @return {Promise<*>}
   */
  async register(username, password) {
    const response = await axios.post(`${PREFIX}/login`, qs.stringify({
        username, password,
      }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );
    return response;
  }

  /**
   * register using google.
   * @param {string} token
   * @returns {Promise<*>}
   */
  async googleRegister(token) {
    const response = await axios.request(
      {
        url: `${PREFIX}/register/google`,
        method: 'post',
        data: {
          google_token: token
        }
      },
    );
    // localStorage.setItem('token', response.data.access_token);
    return response;
  }

  /**
   * Login using google.
   * @param {string} token
   * @returns {Promise<*>}
   */
  async googleLogin(token) {
    const response = await axios.request(
      {
        url: `${PREFIX}/login/google`,
        method: 'post',
        data: {
          google_token: token
        }
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
