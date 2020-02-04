import {
  getUnixTime,
} from 'date-fns';

import {HttpService} from '~/services/base_service';

/** DateStatus service for requesting date statuses. */
class DateStatusService extends HttpService {
  /**
   * Get all the missing reasons from the server.
   * @return {Promise<T>}
   */
  async getReasons() {
    return await this.request({
      method: 'get',
      url: '/reasons',
    });
  }

  /**
   * Add new date datas to the server.
   * @param {number} start - start timestamp
   * @param {number} end - end timestamp
   * @param {number} userId - relevant user id.
   * @param {string} state - the date status (here/not_here).
   * @param {string} reason - the reason if not here.
   * @return {Promise<T>}
   */
  async addDateData({userId, state, start, end=undefined, reason=null}) {
    return await this.request({
      method: 'post',
      url: '/',
      data: {
        start_date: start,
        end_date: end,
        user_id: userId,
        state,
        reason,
      },
    });
  }

  /**
   * Set today status.
   * @param {number} userId - relevant user id.
   * @param {string} state - the date status (here/not_here).
   * @param {string} reason - the reason if not here.
   * @return {Promise<T>}
   */
  async setToday({userId, state, reason=null}) {
    const date = new Date();
    return await this.request({
      method: 'post',
      url: '/',
      data: {
        start_date: getUnixTime(date),
        user_id: userId,
        state,
        reason,
      },
    });
  }

  /**
   * Delete today status.
   * @param {number} userId - relevant user id.
   * @return {Promise<T>}
   */
  async deleteToday({userId}) {
    const date = new Date();
    return await this.request({
      method: 'delete',
      url: '/',
      data: {
        start_date: getUnixTime(date),
        user_id: userId,
      },
    });
  }
  /**
   * Get date datas from server.
   * @param {number} start - start timestamp
   * @param {number} end - end timestamp
   * @param {number} userId - relevant user id.
   * @return {Promise<T>}
   */
  async getDateData({start, end, userId}) {
    return await this.request({
      method: 'get',
      url: '/',
      params: {
        start,
        end,
        user_id: userId,
      },
    });
  }
}

export default new DateStatusService('/api/v1/dates_status');
