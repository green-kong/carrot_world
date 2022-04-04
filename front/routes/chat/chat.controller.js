const axios = require('axios');

exports.chat = async (req, res) => {
  const { u_id, userAlias, u_img } = req.user.userResult;
  const { chatResult } = req.user;
  const body = {
    u_id,
    userAlias,
    u_img,
    chatResult,
  };
  const url = `http://localhost:4000/api/chat`;
  try {
    const response = await axios.post(url, body);
    console.log(response.data);
  } catch (err) {
    console.log(err.message);
  }

  res.render('chat/chat.html');
};
