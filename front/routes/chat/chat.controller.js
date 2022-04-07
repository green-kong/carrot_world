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
      if (v.thumbnail === null) v.thumbnail = `/img/carrot_profile.jpeg`;
      if (v.lastDate === null) {
        v.lastDate = `no date`;
      } else {
        const latestYear = new Date(v.lastDate).getFullYear();
        const latestDate = new Date(v.lastDate).getDate();
        const latestMonth = new Date(v.lastDate).getMonth();

        let dateForRender;
        if (
          latestYear === new Date().getFullYear() &&
          latestMonth === new Date().getMonth() &&
          latestDate === new Date().getDate()
        ) {
          dateForRender = v.lastDate.split(' ')[1].substr(0, 5);
        } else {
          dateForRender = v.lastDate.split(' ')[0].substr(2, 8);
        }
        v.lastDate = dateForRender;
      }
      if (v.lastMsg === null) v.lastMsg = `대화 내용 없음`;
    });
    res.render('chat/chat.html', { chatList: data, u_id });
  } catch (err) {
    console.log(err.message);
  }
};
