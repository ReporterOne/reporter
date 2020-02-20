import {HttpService} from '~/services/base_service';
import {formatDate} from '~/components/Calendar/components/utils';

/** Service for handling users requests */
class UsersService_ extends HttpService {
  /**
   * Get the current user.
   * @return {Promise<T>}
   */
  async getCurrentUser() {
    return await this.request({
      method: 'get',
      url: '/me',
    });
  }
  /**
   * Get all allowed users.
   * @return {Promise<T>}
   */
  async getAllowedUsers() {
    return await this.request({
      method: 'get',
      url: '/me/allowed_users',
    });
  }

  /**
   * Set calendar of user.
   * @param {number} start - start timestamp
   * @param {number} end - end timestamp
   * @param {number} userId - relevant user id.
   * @param {string} state - the date status (here/not_here).
   * @param {string} reason - the reason if not here.
   * @return {Promise<T>}
   */
  async setDate({userId, start, end=undefined, state, reason=null}) {
    return await this.request({
      method: 'post',
      url: `/${userId}/statuses`,
      data: {
        start: start,
        end: end,
        state,
        reason,
      },
    });
  }

  /**
   * Set calendar of current user.
   * @param {number} start - start timestamp
   * @param {number} end - end timestamp
   * @param {string} state - the date status (here/not_here).
   * @param {string} reason - the reason if not here.
   * @return {Promise<T>}
   */
  async setMyCalendar({start, end=undefined, state, reason=null}) {
    return await this.request({
      method: 'post',
      url: `/me/statuses`,
      data: {
        start,
        end,
        state,
        reason,
      },
    });
  }

  /**
   * Set calendar of current user today.
   * @param {string} state - the date status (here/not_here).
   * @param {string} reason - the reason if not here.
   * @return {Promise<T>}
   */
  async setMyToday({state, reason=null}) {
    const date = new Date();
    return await this.request({
      method: 'post',
      url: `/me/statuses`,
      data: {
        start: formatDate(date),
        state,
        reason,
      },
    });
  }

  /**
   * Get Today status.
   */
  async getMyToday() {
    return (await this.request({
      method: 'get',
      url: '/me/statuses',
      params: {
        start: formatDate(new Date()),
      },
    }))[0];
  }

  /**
   * Get calendar of user.
   * @param {number} start - start timestamp
   * @param {number} end - end timestamp
   */
  async getMyCalendar({start, end}) {
    return await this.request({
      method: 'get',
      url: '/me/statuses',
      params: {
        start: start,
        end: end,
      },
    });
  }

  async getMySubjects() {
    return await this.request({
      method: 'get',
      url: `/me/subjects`,
    })
  }

  async getUnassignedUsers() {
    return await this.request({
      method: 'get',
      url: `/unassigned`
    })
  }
}

export const UsersService = new UsersService_('/api/v1/users');
export default UsersService;
