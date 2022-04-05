// const { pool } = require('../../../back/model/db/db.js');
// const alertmove = require('../../../back/utils/user/alertmove.js');

exports.profile = (req, res) => {
  const { userEmail, userAlias, userMobile } = req.user.userResult;

  res.render('user/profile.html', { userEmail, userAlias, userMobile });
};
