const alertmove = require('../../utils/user/alertmove.js');
const axios = require('axios');

exports.profile = async (req, res) => {
  const { u_id, userEmail, userAlias, userMobile } = req.user.userResult;
  const url = 'http://localhost:4000/api/user/profile/check';
  const body = { u_id };

  const response = await axios.post(url, body);
  const {
    data: {
      result: [auData, sellData],
      likeResult: { totalLikes },
    },
  } = response;
  res.render('user/profile.html', {
    userEmail,
    userAlias,
    userMobile,
    auData,
    sellData,
    totalLikes,
  });
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
