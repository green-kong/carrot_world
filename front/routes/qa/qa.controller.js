const axios = require('axios');
const alertmove = require('../../utils/user/alertmove');

exports.write = (req, res) => {
  const { userResult } = req.user;
  delete userResult.userPW;
  res.render('qa/write.html', { user: userResult });
};

exports.view = async (req, res) => {
  const { idx } = req.query;
  const url = `http://localhost:4000/api/qa/view?idx=${idx}`;
  const response = await axios.post(url, {
    withCredentials: true,
  });
  const { qaData, replyData } = response.data;
  res.render('qa/view.html', { qaData, replyData });
};

exports.list = async (req, res) => {
  let { page } = req.query;
  if (page === undefined) {
    page = 1;
  }
  const url = `http://localhost:4000/api/qa/list?page=${page}`;
  const response = await axios.post(url, {
    withCredentials: true,
  });
  const { result: listData } = response.data;
  const { totalQty } = response.data;
  const totalPage = Math.ceil(totalQty / 10);
  const totalPager = Math.ceil(totalPage / 5);
  res.render('qa/list.html', { listData });
};

exports.delete = async (req, res) => {
  const { idx } = req.query;
  const url = `http://localhost:4000/api/qa/delete?idx=${idx}`;
  const response = await axios.post(url, {
    withCredentials: true,
  });
  if (response.data.affectedRows === 1) {
    res.send(alertmove('/qa/list', '해당 문의가 삭제되었습니다.'));
  } else {
    res.send(alertmove(`/qa/view/idx=${idx}`, '삭제 실패'));
  }
};

exports.edit = async (req, res) => {
  const { idx } = req.query;
  const url = `http://localhost:4000/api/qa/edit?idx=${idx}`;
  const response = await axios.post(url, {
    withCredentials: true,
  });
  const editData = response.data;
  res.render('qa/edit.html', { editData });
};
