const { constants } = require('http2');

class ConflictErr extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictErr';
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictErr;
