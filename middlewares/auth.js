const jwt = require('jsonwebtoken');
const UnAuthorizedErr = require('../utils/errors/UnAuthorizedErr');

const handleAuthError = () => new UnAuthorizedErr('Токен недействителен, необходимо получить доступ');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let decodedPayload;

  if (!authorization || !authorization.startsWith('Bearer ')) return next(handleAuthError());

  try {
    const token = authorization.replace('Bearer ', '');
    decodedPayload = jwt.verify(token, 'key-for-token');
    if (!decodedPayload) return next(handleAuthError());
  } catch (err) {
    next(handleAuthError());
  }

  req.user = decodedPayload;

  return next();
};

module.exports = auth;
