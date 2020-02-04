import {HttpService} from '~/services/base_service';

/** Service for handling users requests */
class UsersService extends HttpService {
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
}

export default new UsersService('/api/v1/users');
