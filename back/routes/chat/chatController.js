const pool = require('../../model/db/db.js');

exports.chat = async (req, res) => {
  const { u_id, chatList } = req.body;
  console.log(u_id, chatList);
  const conn = await pool.getConnection();
  // try {
  //   const sql = `SELECT * FROM chat_log WHERE c_id=${chatId}`;
  //   const [chatLog] = conn.query(sql);
  //   res.send(JSON.stringify(chatLog));
  // } catch (err) {
  //   console.log(err.message);
  // } finally {
  //   conn.release();
  // }
};
