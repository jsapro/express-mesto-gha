const { constants } = require('http2');

class NotFoundErr extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundErr';
    this.statusCode = constants.HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundErr;
