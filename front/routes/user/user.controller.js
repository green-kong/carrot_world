exports.profile = (req, res) => {
  const { userEmail, userAlias, userMobile } = req.user.userResult;

  res.render('user/profile.html', { userEmail, userAlias, userMobile });
};
