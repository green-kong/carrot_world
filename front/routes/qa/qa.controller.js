const axios = require('axios');
const alertmove = require('../../utils/user/alertmove');

exports.write = (req, res) => {
  const { userResult } = req.user;
  delete userResult.userPW;
  res.render('qa/write.html', { user: userResult });
};

exports.view = async (req, res) => {
  const { idx } = req.query;
  const { u_id: loginUser, userAlias } = req.user.userResult;
  const url = `http://localhost:4000/api/qa/view?idx=${idx}`;
  const response = await axios.post(url, {
    withCredentials: true,
  });
  const { qaData, replyData } = response.data;
  if (qaData.u_id === loginUser || loginUser === 7) {
    res.render('qa/view.html', { qaData, replyData, userAlias });
  } else {
    res.send(alertmove('/qa/list', '해당 글 작성자만 접근 가능합니다.'));
  }
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
  console.log(totalPager);
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
