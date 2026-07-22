import { AccessForbiddenError, NotFoundError } from "~/exceptions";

export class DrivePermissionDenied extends AccessForbiddenError {
  constructor(
    message: string = "You do not have permission to access this drive",
  ) {
    super(message);
    this.name = "DRIVEPERMISSIONDENIED";
  }
}

export class DriveNotFound extends NotFoundError {
  constructor(message: string = "Drive not found") {
    super(message);
    this.name = "DRIVENOTFOUND";
  }
}
