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
      Error.captureStackTrace(this, InvalidTodoIdError);
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
      Error.captureStackTrace(this, InvalidTodoIdError);
    }

    this.statusCode = 400;
    this.name = "PaswordsDoNotMatchError";
    this.message = "Passwords do not match";
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

module.exports = {
  InvalidUserIdError,
  InvalidTodoIdError,
  PaswordIsRequiredError,
  PaswordsDoNotMatchError
};
