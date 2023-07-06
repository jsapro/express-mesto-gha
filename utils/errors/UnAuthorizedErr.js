const { constants } = require('http2');

class UnAuthorizedErr extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnAuthorizedErr';
    this.statusCode = constants.HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnAuthorizedErr;
