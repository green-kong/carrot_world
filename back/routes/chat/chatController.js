const { pool } = require('../../model/db/db.js');

exports.chat = async (req, res) => {
  const { u_id, chatResult } = req.body;
  const conn = await pool.getConnection();
  const chatList = chatResult.join(',');
  let response;
  try {
    const bringSql = `SELECT chat.c_id, chat.mem1, chat.mem2, 
                      u1.userAlias AS mem1Alias, 
                      u2.userAlias AS mem2Alias,
                      u1.u_img AS mem1Img,
                      u2.u_img AS mem2Img,
                      DATE_FORMAT(chat.lastDate,'%y-%m-%d %H:%i:%s') as lastDate, 
                      chat.lastMsg 
                      FROM chat 
                      JOIN user u1 
                      ON mem1 = u1.u_id 
                      JOIN user u2 
                      ON mem2 = u2.u_id 
                      WHERE chat.c_id IN (${chatList})`;
    if (chatList === undefined) throw new Error('no chat list');
    const [result] = await conn.query(bringSql);
    response = result.map((v) => {
      const obj = {};
      obj.c_id = v.c_id;
      obj.theOther = v.mem1 === u_id ? v.mem2Alias : v.mem1Alias;
      obj.thumbnail = v.mem1 === u_id ? v.mem2Img : v.mem1Img;
      obj.lastDate = v.lastDate;
      obj.lastMsg = v.lastMsg;
      return obj;
    });
    res.send(response);
  } catch (err) {
    console.log(err);
    response = [];
    res.send(response);
  } finally {
    conn.release();
  }
};

exports.renderChat = async (req, res) => {
  const { chat_id } = req.body;
  const renderSql = `SELECT c.c_id, c.u_id, u.u_img, c.dialog, c.date 
                    FROM chat_log c 
                    JOIN user u 
                    ON u.u_id = c.u_id 
                    WHERE c_id = ${chat_id}`;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(renderSql);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};
