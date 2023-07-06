const { constants } = require('http2');

class BadRequestErr extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestErr';
    this.statusCode = constants.HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestErr;
