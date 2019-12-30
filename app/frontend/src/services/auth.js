import qs from 'qs';
import axios from 'axios';

const PREFIX = "/api/";

export class PermissionsError extends Error {

}

class AuthService {
  async login(username, password) {
    const response = await axios.post(`${PREFIX}/login`, qs.stringify({
        username, password
      }),
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
      }
    );
    localStorage.setItem("token", response.data.access_token);
    return response.data.user_id;
  }

  async logout() {
    if (localStorage.getItem("token")) {
      localStorage.removeItem("token");
    }
  }

  is_logged_in() {
    return this.getToken() !== null
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getAuthHeader() {
    return {Authorization: 'Bearer ' + this.getToken()};
  }
}

export default new AuthService();
