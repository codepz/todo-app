function AppError(name, description) {
  Error.call(this);
  Error.captureStackTrace(this);
  this.name = name;
  this.description = description;
}

AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

export default AppError;
