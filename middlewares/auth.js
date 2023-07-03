const jwt = require('jsonwebtoken');
const constants = require('http2');

const auth = (req, res, next) => {
  const authorization = req.cookies.jwt;
  if (!authorization) {
    next(new Error('No authorization'));
  } else {
    try {
      const decoded = jwt.verify(authorization, 'key-for-token');
      req.user = { _id: decoded._id };
    } catch (err) {
      next(
        new Error('authorization error', constants.HTTP_STATUS_UNAUTHORIZED)
      );
    }
  }
};

module.exports = auth;
