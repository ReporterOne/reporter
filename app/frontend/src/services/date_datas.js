import axios from 'axios';

import AuthService, {PermissionsError} from './auth';

const PREFIX = '/api/v1/dates_status';

/** DateStatus service for requesting date statuses. */
class DateStatusService {
  /**
   * Get all the missing reasons from the server.
   * @return {Promise<T>}
   */
  async getReasons() {
    try {
      const response = await axios.get(`${PREFIX}/reasons`,
          {
            headers: {
              ...AuthService.getAuthHeader(),
            },
          },
      );
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        throw new PermissionsError(error.response.data.details);
      }
      console.warn('couldn\'t get reasons', error.response.status);
      throw error;
    }
  }
  async getDateData({start, end,userId}) {
    try {
      const response = await axios.get(`${PREFIX}`,
      {
        params:{ 
          start: start,
          end: end,
          user_id: userId
        },
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
      console.warn("couldn't dates", error.response.status);
      throw error;
    }
  }
}

export default new DateStatusService();
