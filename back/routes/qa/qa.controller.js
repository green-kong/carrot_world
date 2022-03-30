const { pool } = require('../../model/db/db.js');

exports.write = async (req, res) => {
  const { subject, content, author } = req.body;
  const conn = await pool.getConnection();
  try {
    const writeSql = `INSERT INTO qa(u_id, subject, content, date
                      ) VALUES((SELECT u_id FROM user
                        WHERE userAlias = '${author}'),'${subject}', '${content}', now())`;
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

exports.list = async (req, res) => {
  try {
    const { page } = req.query;
    const upperData = page * 10 - 9;
    console.log(upperData);
    const listSql = `SELECT qa.q_id, qa.subject,
                      user.userAlias,
                      DATE_FORMAT(qa.date, '%y-%m-%d') AS date
                      FROM qa
                      JOIN user
                      ON qa.u_id = user.u_id
                      ORDER BY q_id DESC
                      LIMIT ${upperData}, 10`;
    const [result] = await pool.execute(listSql);
    const countSql = `SELECT count(q_id) as totalQty FROM qa`;
    const [[{ totalQty }]] = await pool.execute(countSql);
    const response = {
      result,
      totalQty,
    };
    res.send(response);
  } catch (err) {
    console.log(err.message);
  }
};

exports.delete = async (req, res) => {
  const { idx } = req.query;
  try {
    const sql = `DELETE FROM qa WHERE q_id = ${idx}`;
    const [result] = await pool.execute(sql);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
};

exports.edit = async (req, res) => {
  const { idx } = req.query;
  try {
    const editSql = `SELECT qa.q_id, qa.subject, qa.content, 
                      user.userAlias
                      FROM qa 
                      JOIN user 
                      ON qa.u_id = user.u_id 
                      WHERE q_id = '${idx}'`;
    const [[result]] = await pool.execute(editSql);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
};

exports.editPost = async (req, res) => {
  const { q_id, subject, content } = req.body;
  try {
    const editPostSql = `UPDATE qa SET subject=?, content=?, date=now() WHERE q_id = ${q_id}`;
    const prepare = [subject, content];
    const [result] = await pool.execute(editPostSql, prepare);
    res.send(result);
  } catch (err) {
    console.log(err.message);
  }
};

exports.replyWrite = (req, res) => {};
exports.replyUpdate = (req, res) => {};
exports.replyDelete = (req, res) => {};
