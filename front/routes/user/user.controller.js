const alertmove = require('../../utils/user/alertmove.js');
const axios = require('axios');

exports.profile = async (req, res) => {
  const { u_id, userEmail, userAlias, userMobile, u_img } = req.user.userResult;
  const slikeResult = req.user.slikeResult.join(',');
  const aulikeResult = req.user.aulikeResult.join(',');

  const url = 'http://localhost:4000/api/user/profile/check';
  const sellUrl = 'http://localhost:4000/api/user/profile/sell';

  const body = { u_id };

  const response = await axios.post(url, body);
  const {
    data: {
      result: [auData, sellData],
      likeResult: { totalLikes },
    },
  } = response;

  const sellResponse = await axios.post(sellUrl, body);
  const { data: sellResult } = sellResponse;
  res.render('user/profile.html', {
    u_id,
    userEmail,
    userAlias,
    userMobile,
    auData,
    sellData,
    totalLikes,
    sellResult,
    slikeResult,
    aulikeResult,
    u_img,
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
  const { userEmail, userAlias, userMobile, provider, u_id } =
    req.user.userResult;
  res.render('user/edit.html', {
    u_id,
    userEmail,
    userAlias,
    userMobile,
    provider,
  });
};
