import { MyQuranApiError } from "./exceptions";
import {
  fetchCityResponseSchema,
  fetchTodayPrayerTimesResponseSchema,
} from "./schemas";

export async function fetchPrayerTimeCities(id: "all" | string) {
  try {
    const response = await fetch(
      `https://api.myquran.com/v3/sholat/kabkota/${id}`,
    );

    const responseJson: unknown = await response.json();

    if (!response.ok) {
      throw new MyQuranApiError("Failed to fetch city data", {
        status: response.status,
        statusText: response.statusText,
        data: responseJson,
      });
    }

    const parsedResponseJson = fetchCityResponseSchema.parse(responseJson);

    return parsedResponseJson.data;
  } catch (error) {
    throw new MyQuranApiError("Failed to fetch city data", {
      status: 500,
      statusText: "Server Error",
      cause: error,
    });
  }
}

export async function fetchTodayPrayerTimes(
  cityId: string,
  options?: { tz?: string; utc?: string },
) {
  const optionParams = new URLSearchParams(options);
  try {
    const response = await fetch(
      `https://api.myquran.com/v3/sholat/jadwal/${cityId}/today?${optionParams.toString()}`,
    );
    const responseJson = await response.json();
    if (!response.ok) {
      throw new MyQuranApiError("Failed to fetch city data.", {
        status: response.status,
        statusText: response.statusText,
        data: responseJson,
      });
    }

    const parsedResponseJson =
      fetchTodayPrayerTimesResponseSchema.parse(responseJson);
    return parsedResponseJson.data;
  } catch (error) {
    throw new MyQuranApiError("Failed to fetch city data.", {
      status: 500,
      statusText: "Server Error",
      cause: error,
    });
  }
}
