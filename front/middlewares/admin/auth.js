const axios = require('axios');

const alertmove = require('../../utils/user/alertmove.js');
const { decodePayload } = require('../../../back/utils/user/jwt.js');

async function auth(req, res, next) {
  const token = req.cookies.Access_token;
  if (token === undefined) {
    res.send(
      alertmove('http://localhost:3000/home', '존재하지 않는 페이지 입니다')
    );
  } else {
    try {
      const payload = await decodePayload(token);
      const url = 'http://localhost:4000/api/admin/auth';
      const body = { u_id: payload.u_id };
      const response = await axios.post(url, body);
      const { isAdmin } = response.data;
      if (isAdmin) {
        req.user = { ...response.data };
        next();
      } else {
        res.send(
          alertmove('http://localhost:3000/home', '존재하지 않는 페이지입니다.')
        );
      }
    } catch (err) {
      res.clearCookie('Access_token');
      res.send(
        alertmove('http://localhost:3000/home', '존재하지 않는 페이지입니다.')
      );
    }
  }
}

module.exports = auth;
