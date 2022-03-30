exports.write = (req, res) => {
  const { userResult } = req.user;
  delete userResult.userPW;
  res.render('qa/write.html', { user: userResult });
};

exports.list = (req, res) => {
  res.render('qa/list.html');
};

exports.view = (req, res) => {
  res.render('qa/view.html');
};

exports.edit = (req, res) => {
  res.render('qa/edit.html');
};
