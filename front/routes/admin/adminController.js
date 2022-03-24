exports.login = (req, res) => {
  res.render('admin/login.html');
};

exports.statistics = (req, res) => {
  res.render('admin/statistics.html');
};

exports.board = (req, res) => {
  res.render('admin/board.html');
};

exports.user = (req, res) => {
  res.render('admin/user.html');
};
