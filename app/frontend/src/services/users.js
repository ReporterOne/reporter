import axios from 'axios';

import AuthService, {PermissionsError} from './auth';

const PREFIX = "/api/v1/users";

class UsersService {
  async getCurrentUser() {
    try {
      const response = await axios.get(`${PREFIX}/me`,
        {
          headers: {
            ...AuthService.getAuthHeader()
          }
        }
      );
      return response.data;

    } catch (error) {
      if (error.response.status === 401) {
        throw new PermissionsError(error.response.data.details);
      }
      console.warn("couldn't get user details", error.response.status);
      throw error;
    }
  }
}

export default new UsersService();
