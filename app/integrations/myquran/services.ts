import { MyQuranApiError } from "./exceptions";

class MyQuran {
  async getCity(id: "semua" | string) {
    try {
      const response = await fetch(
        `https://api.myquran.com/v3/sholat/kabkota/${id}`,
      );
      const responseJson = await response.json();
      if (!response.ok) {
        throw new MyQuranApiError("Failed to fetch city data.", {
          status: response.status,
          statusText: response.statusText,
          data: responseJson,
        });
      }
    } catch (error) {
      throw new MyQuranApiError("Failed to fetch city data.", {
        status: 500,
        statusText: "Server Error",
        cause: error,
      });
    }
  }
}
