const axios = require('axios');
const alertmove = require('../../utils/user/alertmove');

exports.write = (req, res) => {
  const { userResult } = req.user;
  delete userResult.userPW;
  res.render('qa/write.html', { user: userResult });
};

exports.view = async (req, res) => {
  const { idx } = req.query;
  const { u_id: loginUser, userAlias, isAdmin } = req.user.userResult;
  const url = `http://localhost:4000/api/qa/view?idx=${idx}`;
  const response = await axios.post(url, {
    withCredentials: true,
  });
  const { qaData, replyData } = response.data;
  if (qaData.u_id === loginUser || isAdmin === 1) {
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
  try {
    const url = `http://localhost:4000/api/qa/list?page=${page}`;
    const response = await axios.post(url);
    if (response.status >= 500 || response.data.err)
      throw new Error('페이지 오류');
    const { result: listData } = response.data;
    const forPager = Math.ceil(page / 5);
    page = Number(page);
    res.render('qa/list.html', { listData, page, forPager });
  } catch (err) {
    console.log(err.message);
    res.send(alertmove('/qa/list?page=1', '존재하지 않는 페이지입니다'));
  }
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
