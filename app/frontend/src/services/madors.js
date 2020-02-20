import {HttpService} from '~/services/base_service';

/** Service for handling madors requests */
class MadorsService_ extends HttpService {
  /**
   * Get all available madors from server.
   * @return {Promise<T>}
   */
  async getMadors() {
    return await this.request({
      method: 'get',
      url: `/`,
    });
  }

  /**
   * get hierarchy of a given mador
   * @param {string} mador - mador name.
   * @return {Promise<T>}
   */
  async getHierarchy(mador) {
    return await this.request({
      method: 'get',
      url: `/${mador}/hierarchy`,
    });
  }

  /**
   * Update an hierarchy of a given mador.
   * @param {string} mador - mador name.
   * @param {object} hierarchy - hierarchy object.
   * @param {[int]} unassigned - unassigned users list.
   * @return {Promise<T>}
   */
  async updateHierarchy(mador, hierarchy, unassigned) {
    return await this.request({
      method: 'put',
      url: `/${mador}/hierarchy`,
      data: {
        hierarchy,
        unassigned,
      },
    });
  }
}

export const MadorsService = new MadorsService_('/api/v1/madors');
export default MadorsService;
