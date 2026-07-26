import { AccessForbiddenError, AppError, NotFoundError } from "~/exceptions";

export class R2BucketNotBound extends AppError {
  constructor(message: string = "R2 Bucket is not bound") {
    super(message);
    this.name = "R2BUCKETNOTBOUND";
  }
}

export class R2ObjectNotFound extends NotFoundError {
  constructor(message: string = "R2 Object is not found") {
    super(message);
    this.name = "R2OBJECTNOTFOUND";
  }
}

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

export class DriveItemPermissionDenied extends AccessForbiddenError {
  constructor(
    message: string = "You do not have permission to access this drive item",
  ) {
    super(message);
    this.name = "DRIVEITEMPERMISSIONDENIED";
  }
}

export class DriveItemNotFound extends NotFoundError {
  constructor(message: string = "Drive item not found") {
    super(message);
    this.name = "DRIVEITEMNOTFOUND";
  }
}
