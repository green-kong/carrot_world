const { pool } = require('../../model/db/db.js');

exports.chat = async (req, res) => {
  const { u_id, userAlias, chatList, profile } = req.body;
  const conn = await pool.getConnection();
  try {
    chatList.forEach((v) => {
      const sql = `SELECT * FROM chat_log WHERE c_id=${v}`;
    });

    // const [chatLog] = conn.query(sql);
    // res.send(JSON.stringify(chatLog));
  } catch (err) {
    console.log(err.message);
  } finally {
    conn.release();
  }
};
