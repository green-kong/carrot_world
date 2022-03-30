exports.home = (req, res) => {
  const { userResult, totalCount } = req.user;
  res.render('home/home.html', { userResult, totalCount });
};

exports.write = (req, res) => {
  res.render('home/write.html');
};
