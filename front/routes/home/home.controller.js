exports.home = (req, res) => {
  res.render('home/home.html');
};

exports.write = (req, res) => {
  res.render('home/write.html');
};

exports.auction = (req, res) => {
  res.render('home/auction.html');
};
