
const PREFIX = "/api/v1/dates_status";

class DateStatusService {
  async getReasons() {
    try {
      const response = await fetch(`${PREFIX}/reasons`);
      return await response.json();

    } catch(e) {
      console.error("couldn't get reasons");
      throw e;
    }
  }
}

export default new DateStatusService();
