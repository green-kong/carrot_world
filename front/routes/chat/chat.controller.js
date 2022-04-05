const axios = require('axios');

exports.chat = async (req, res) => {
  const { u_id } = req.user.userResult;
  const { chatResult } = req.user;
  const body = { u_id, chatResult };
  const url = `http://localhost:4000/api/chat`;
  try {
    const response = await axios.post(url, body);
    console.log(response.data);
    const { data } = response;
    data.forEach((v) => {
      if (v.thumbnail === null) v.thumbnail = `/img/carrotForNull.png`;
      if (v.lastDate === null) {
        v.lastDate = `no date`;
      } else {
        v.lastDate = v.lastDate.split(' ')[0];
      }
      if (v.lastMsg === null) v.lastMsg = `대화 내용 없음`;
    });
    res.render('chat/chat.html', { chatList: data, u_id });
  } catch (err) {
    console.log(err.message);
  }
};
