const { constants } = require('http2');

class ForbiddenErr extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenErr';
    this.statusCode = constants.HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = ForbiddenErr;
