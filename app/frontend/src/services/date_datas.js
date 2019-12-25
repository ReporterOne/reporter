import axios from 'axios';

import AuthService from './auth';

const PREFIX = "/api/v1/dates_status";

class DateStatusService {
  async getReasons() {
    try {
      const response = await axios.get(`${PREFIX}/reasons`,
        {
          headers: {
            ...AuthService.getAuthHeader()
          }
        }
      );
      return response.data;

    } catch (e) {
      console.error("couldn't get reasons");
      throw e;
    }
  }
}

export default new DateStatusService();
