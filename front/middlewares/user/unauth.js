const alertmove = require('../../utils/user/alertmove');

function unauth(req, res, next) {
  const token = req.cookies.Access_token;
  if (token === undefined) {
    next();
  } else {
    res.send(
      alertmove('http://localhost:3000/home', '이미 로그인 되어있습니다')
    );
  }
}

module.exports = unauth;
