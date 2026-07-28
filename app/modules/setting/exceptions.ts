import { AccessForbiddenError, AppError, NotFoundError } from "~/exceptions";
export class SettingPermissionDenied extends AccessForbiddenError {
  constructor(
    message: string = "You do not have permission to perform this action on setting",
  ) {
    super(message);
    this.name = "SETTINGPERMISSIONDENIED";
  }
}
export class SettingNotFound extends NotFoundError {
  constructor(message: string = "Setting not found") {
    super(message);
    this.name = "SETTINGNOTFOUND";
  }
}
export class SettingAlreadyExists extends AppError {
  override readonly status: number = 409;
  constructor(message: string = "Setting already exists") {
    super(message);
    this.name = "SETTINGALREADYEXISTS";
  }
}
