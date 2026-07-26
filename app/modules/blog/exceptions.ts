import { AccessForbiddenError, AppError, NotFoundError } from "~/exceptions";

export class PostPermissionDenied extends AccessForbiddenError {
  constructor(
    message: string = "You do not have permission to perform this action on post",
  ) {
    super(message);
    this.name = "POSTPERMISSIONDENIED";
  }
}

export class PostNotFound extends NotFoundError {
  constructor(message: string = "Post not found") {
    super(message);
    this.name = "POSTNOTFOUND";
  }
}

export class PostAlreadyExists extends AppError {
  override readonly status: number = 409;
  constructor(message: string = "Post already exists") {
    super(message);
    this.name = "POSTALREADYEXISTS";
  }
}
