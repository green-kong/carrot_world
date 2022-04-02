const axios = require('axios');

exports.login = (req, res) => {
  res.render('admin/login.html');
};

exports.statistics = async (req, res) => {
  const url = 'http://localhost:4000/api/statistics/main';

  const response = await axios.post(url);

  const { data: likeResult } = response;

  res.render('admin/statistics.html', { likeResult });
};

exports.board = (req, res) => {
  res.render('admin/board.html');
};

exports.user = (req, res) => {
  res.render('admin/user.html');
};
