exports.home = (req, res) => {
  const { userResult, totalCount, slikeResult, aulikeResult } = req.user;
  res.render('home/home.html', {
    userResult,
    totalCount,
    slikeResult,
    aulikeResult,
  });
};

exports.write = (req, res) => {
  res.render('home/write.html');
};

exports.auction = (req, res) => {
  res.render('home/auction.html');
};
