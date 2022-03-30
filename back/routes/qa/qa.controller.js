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

exports.view = async (req, res) => {
  const { idx } = req.query;
  const conn = await pool.getConnection();
  try {
    const viewSql = `SELECT qa.q_id, qa.subject, qa.content, 
                      DATE_FORMAT(qa.date, '%y-%m-%d') AS date, qa.hit,
                      user.userAlias
                      FROM qa 
                      JOIN user 
                      ON qa.u_id = user.u_id 
                      WHERE q_id = '${idx}'`;
    const [[result]] = await conn.query(viewSql);
    const hitSql = `UPDATE qa SET hit = hit + 1 WHERE q_id = ${idx}`;
    await conn.query(hitSql);
    res.send(result);
  } catch (err) {
    console.log('게시글보기 오류:', err.message);
  } finally {
    conn.release();
  }
};

exports.list = (req, res) => {};

exports.edit = (req, res) => {};
exports.delete = (req, res) => {};

exports.replyWrite = (req, res) => {};
exports.replyUpdate = (req, res) => {};
exports.replyDelete = (req, res) => {};
