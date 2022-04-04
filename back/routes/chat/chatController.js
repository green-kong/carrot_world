const { pool } = require('../../model/db/db.js');

exports.chat = async (req, res) => {
  const { u_id, chatResult } = req.body;
  const conn = await pool.getConnection();
  const chatList = chatResult.join(',');
  try {
    const bringSql = `SELECT chat.c_id, chat.mem1, chat.mem2, 
                      u1.userAlias AS mem1Alias, 
                      u2.userAlias AS mem2Alias,
                      u1.u_img AS mem1Img,
                      u2.u_img AS mem2Img,
                      chat.lastDate, chat.lastMsg 
                      FROM chat 
                      JOIN user u1 
                      ON mem1 = u1.u_id 
                      JOIN user u2 
                      ON mem2 = u2.u_id 
                      WHERE chat.c_id IN (${chatList})`;
    const [result] = await conn.query(bringSql);
    const newResult = result.map((v) => {
      const obj = {};
      obj.c_id = v.c_id;
      obj.theOther = v.mem1 === u_id ? v.mem2Alias : v.mem1Alias;
      obj.thumbnail = v.mem1 === u_id ? v.mem2Img : v.mem1Img;
      obj.lastDate = v.lastDate;
      obj.lastMsg = v.lastMsg;
      return obj;
    });
    res.send(newResult);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};
