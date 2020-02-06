import axios from 'axios';
import AuthService, {PermissionsError} from '~/services/auth';

/**
 * Raise when axios request is canceled
 */
class CanceledError extends Error {}


/**
 * Base Http service.
 * Every service should inherit from this base class and use request method.
 */
export class HttpService {
  /**
   * Base constructor.
   * @param {string} prefix - the url prefix of the service
   */
  constructor(prefix) {
    this.prefix = prefix;
  }

  /**
   * Make axios request with the given config.
   *
   * to the url prefix will be added automatically.
   *
   * @param {object} config - axios config.
   * @return {Promise<T>}
   */
  async request(config) {
    try {
      const response = await axios.request({
        ...config,
        url: `${this.prefix}${config.url}`,
        headers: {
          ...AuthService.getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw new CanceledError(error.message);
      }
      if (error.response.status === 401) {
        throw new PermissionsError(error.response.data.details);
      }
      console.trace('couldn\'t make request', config, error.response.status);
      throw error;
    }
  }
}
