import { NotFoundError } from "~/exceptions";

export class CityNotFoundError extends NotFoundError {
  public code = "city_not_found";
}

export class TodayScheduleNotFoundError extends NotFoundError {
  public code = "today_schedule_not_found";
}
