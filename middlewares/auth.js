const jwt = require('jsonwebtoken');
const constants = require('http2');
const UnAuthorizedErr = require('../utils/errors/UnAuthorizedErr');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let decodedPayload;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthorizedErr('Токен недействителен, необходимо получить доступ'));
  }

  try {
    const token = authorization.replace('Bearer ', '');
    decodedPayload = jwt.verify(token, 'key-for-token');
    if (!decodedPayload) {
      return new Error('Неверный токен');
    }
  } catch (err) {
    // res.send(err);
    next(new Error('authorization error', constants.HTTP_STATUS_UNAUTHORIZED));
  }

  req.user = decodedPayload;

  return next();
};

module.exports = auth;
