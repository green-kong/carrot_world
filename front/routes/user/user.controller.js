exports.profile = (req, res) => {
  console.log(req.user);
  res.render('user/profile.html');
};
