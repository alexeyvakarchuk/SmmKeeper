class InvalidUserIdError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidUserIdError);
    }

    this.statusCode = 400;
    this.name = "InvalidUserIdError";
    this.message = "User id is invalid";
  }
}

class InvalidTodoIdError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidTodoIdError);
    }

    this.statusCode = 400;
    this.name = "InvalidTodoIdError";
    this.message = "Todo id is invalid";
  }
}

class PaswordIsRequiredError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaswordIsRequiredError);
    }

    this.statusCode = 400;
    this.name = "PaswordIsRequiredError";
    this.message = "Password is required";
  }
}

class PaswordsDoNotMatchError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PaswordsDoNotMatchError);
    }

    this.statusCode = 400;
    this.name = "PaswordsDoNotMatchError";
    this.message = "Passwords do not match";
  }
}

class InvalidInstAccDataError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidInstAccDataError);
    }

    this.statusCode = 400;
    this.name = "InvalidInstAccDataError";
    this.message = "Accound data is invalid";
  }
}

// class UserExistsError extends Error {
//   constructor(...params) {
//     super(...params);

//     if (Error.captureStackTrace) {
//       Error.captureStackTrace(this, InvalidTodoIdError);
//     }

//     this.statusCode = 400;
//     this.name = "UserExistsError";
//     this.message = "User with this email already exists";
//   }
// }
class TaskAlreadyInProgressError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TaskAlreadyInProgressError);
    }

    this.statusCode = 400;
    this.name = "TaskAlreadyInProgressError";
    this.message = "Task is already running";
  }
}

class AccIsAlreadyInUse extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AccIsAlreadyInUse);
    }

    this.statusCode = 400;
    this.name = "AccIsAlreadyInUse";
    this.message = "This acc is already in use";
  }
}

class NoProxyError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoProxyError);
    }

    this.statusCode = 400;
    this.name = "NoProxyError";
    this.message = "All proxies are in use now. Contact support, please.";
  }
}

class CheckpointIsRequiredError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoProxyError);
    }

    const { id, username, checkpointUrl, proxy } = params[0];

    this.statusCode = 400;
    this.name = "CheckpointIsRequiredError";
    this.message = "Checkpoint is required";
    this.data = { id, username, checkpointUrl, proxy };
  }
}

class InvalidVerificationCodeError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoProxyError);
    }

    this.statusCode = 400;
    this.name = "InvalidVerificationCodeError";
    this.message = "Invalid verification code";
  }
}

class RateLimitedError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoProxyError);
    }

    this.statusCode = 400;
    this.name = "RateLimitedError";
    this.message =
      "Your acc was temporary blocked for actions(IG limits were exceeded)";
  }
}

class FollowsLimitExceededError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoProxyError);
    }

    this.statusCode = 400;
    this.name = "FollowsLimitExceededError";
    this.message = "Follows number exceeded for this profile";
  }
}

class PasswordWasChangedError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoProxyError);
    }

    this.statusCode = 400;
    this.name = "PasswordWasChangedError";
    this.message = "Password was chagned by user or dropped";
  }
}

module.exports = {
  InvalidUserIdError,
  InvalidTodoIdError,
  PaswordIsRequiredError,
  PaswordsDoNotMatchError,
  AccIsAlreadyInUse,
  InvalidInstAccDataError,
  TaskAlreadyInProgressError,
  NoProxyError,
  CheckpointIsRequiredError,
  InvalidVerificationCodeError,
  RateLimitedError,
  FollowsLimitExceededError,
  PasswordWasChangedError
};
