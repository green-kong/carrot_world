const { pool } = require('../../model/db/db.js');

exports.write = async (req, res) => {
  const { subject, content, author } = req.body;
  const conn = await pool.getConnection();
  try {
    const writeSql = `INSERT INTO qa(u_id, subject, content, date
      ) VALUES((SELECT u_id FROM user WHERE userAlias = '${author}'),'${subject}', '${content}', now())`;
    const [result] = await conn.query(writeSql);
    const response = {
      result: {
        row: result.affectedRows,
        q_id: result.insertId,
      },
    };
    res.send(response);
  } catch (err) {
    console.log('게시글등록 오류:', err.message);
  } finally {
    conn.release();
  }
};

exports.list = (req, res) => {};

exports.view = (req, res) => {};
exports.edit = (req, res) => {};
exports.delete = (req, res) => {};

exports.replyWrite = (req, res) => {};
exports.replyUpdate = (req, res) => {};
exports.replyDelete = (req, res) => {};
