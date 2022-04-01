const axios = require('axios');

const alertmove = require('../../utils/user/alertmove.js');
const { decodePayload } = require('../../../back/utils/user/jwt.js');

async function auth(req, res, next) {
  const token = req.cookies.Access_token;
  if (token === undefined) {
    res.send(
      alertmove('http://localhost:3000/user/login', '로그인이 필요합니다')
    );
  } else {
    try {
      const payload = await decodePayload(token);
      const url = 'http://localhost:4000/api/user/auth';
      const body = { u_id: payload.u_id };
      const response = await axios.post(url, body);
      req.user = { ...response.data };
      next();
    } catch (err) {
      res.clearCookie('Access_token');
      res.send(
        alertmove('http://localhost:3000/user/login', '로그인을 다시 해주세요')
      );
    }
  }
}

module.exports = auth;
