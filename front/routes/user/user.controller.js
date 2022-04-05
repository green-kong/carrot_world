const alertmove = require('../../utils/user/alertmove.js');

exports.profile = (req, res) => {
  const { userEmail, userAlias, userMobile } = req.user.userResult;

  res.render('user/profile.html', { userEmail, userAlias, userMobile });
};

exports.join = (req, res) => {
  res.render('user/join.html');
};

exports.logout = (req, res) => {
  res.clearCookie('Access_token');
  res.send(alertmove('http://localhost:3000', '로그아웃 되었습니다.'));
};

exports.profileEdit = (req, res) => {
  const { userEmail, userAlias, userMobile } = req.user.userResult;
  res.render('user/edit.html', { userEmail, userAlias, userMobile });
};
