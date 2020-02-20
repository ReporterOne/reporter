import {HttpService} from "~/services/base_service";

/** Service for handling users requests */
class MadorsService_ extends HttpService {
  async getMadors() {
    return await this.request({
      method: 'get',
      url: `/`,
    })
  }

  async getHierarchy(mador) {
    return await this.request({
      method: 'get',
      url: `/${mador}/hierarchy`
    })
  }

  async updateHierarchy(mador, hierarchy, unassigned) {
    return await this.request({
      method: 'put',
      url: `/${mador}/hierarchy`,
      data: {
        hierarchy,
        unassigned
      }
    })
  }
}

export const MadorsService = new MadorsService_('/api/v1/madors');
export default MadorsService;
