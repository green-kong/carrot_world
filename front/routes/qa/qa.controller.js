const axios = require('axios');

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
  console.log(response.data);
  const viewData = response.data;
  res.render('qa/view.html', { viewData });
};

exports.list = (req, res) => {
  res.render('qa/list.html');
};

exports.edit = (req, res) => {
  res.render('qa/edit.html');
};
