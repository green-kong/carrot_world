const axios = require('axios');
const alertmove = require('../../utils/user/alertmove.js');

exports.home = (req, res) => {
  const {
    userResult,
    totalCount: { totalCnt },
    slikeResult,
    aulikeResult,
  } = req.user;
  res.render('home/home.html', {
    userResult,
    totalCnt,
    slikeResult,
    aulikeResult,
  });
};

exports.write = async (req, res) => {
  const { u_id: userIdx } = req.user.userResult;
  const url = 'http://localhost:4000/api/home/category';
  const response = await axios.post(url);
  if (response.status === 200) {
    const { data: result } = response;
    res.render('home/write.html', { result, userIdx });
  } else {
    alertmove('/home', '잠시 후 다시 시도해주세요.');
  }
};
