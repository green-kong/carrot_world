const jwt = require('jsonwebtoken');

const secreatkey = 'everything';
const option = {
  algorithm: 'HS256',
  expiresIn: '10m',
  issuer: 'server',
};

function makeToken(payload) {
  return jwt.sign(payload, secreatkey, option);
}

function decodePayload(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secreatkey, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
}

module.exports = { makeToken, decodePayload };
