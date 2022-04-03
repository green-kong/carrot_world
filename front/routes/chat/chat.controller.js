exports.chat = async (req, res) => {
  const { userResult, chatResult } = req.user;
  delete userResult.userPW;
  res.render('chat/chat.html', { userResult, chatResult });
};
