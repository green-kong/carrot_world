const { pool } = require('../../model/db/db.js');

exports.write = async (req, res) => {
  const { subject, content, u_id } = req.body;
  const conn = await pool.getConnection();
  try {
    const writeSql = `INSERT INTO qa(u_id, subject, content, date
                      ) VALUES(${u_id}, '${subject}', '${content}', now())`;
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
    const viewSql = `SELECT qa.u_id, qa.q_id, qa.subject, qa.content, 
                      DATE_FORMAT(qa.date, '%y-%m-%d') AS date, qa.hit,
                      user.userAlias
                      FROM qa 
                      JOIN user 
                      ON qa.u_id = user.u_id 
                      WHERE q_id = '${idx}'`;
    const [[qaData]] = await conn.query(viewSql);

    const hitSql = `UPDATE qa SET hit = hit + 1 WHERE q_id = ${idx}`;
    await conn.query(hitSql);

    const replySql = `SELECT qr.qr_id, qr.q_id, qr.content,
                    DATE_FORMAT(qr.date, '%y-%m-%d %H:%i') as date,
                    user.userAlias
                    FROM q_reply qr
                    JOIN user
                    ON qr.u_id = user.u_id
                    WHERE q_id = ${idx}`;
    let [replyData] = await conn.query(replySql);
    if (replyData === undefined) {
      replyData = 'no reply';
    }
    const result = {
      qaData,
      replyData,
    };
    res.send(result);
  } catch (err) {
    console.log('게시글보기 오류:', err.message);
    res.status(400).send('error msg 띄우기');
  } finally {
    conn.release();
  }
};

exports.list = async (req, res) => {
  let response;
  try {
    const { page } = req.query;
    const upperData = page * 10 - 10;
    const countSql = `SELECT count(q_id) as totalQty FROM qa`;
    const [[{ totalQty }]] = await pool.execute(countSql);
    if (upperData < 0) {
      throw new Error('페이지 오류');
    } else if (upperData > totalQty) {
      throw new Error('페이지 오류');
    } else {
      const listSql = `SELECT qa.q_id, qa.subject,
      user.userAlias,
      DATE_FORMAT(qa.date, '%y-%m-%d') AS date
      FROM qa
      JOIN user
      ON qa.u_id = user.u_id
      ORDER BY q_id DESC
      LIMIT ${upperData}, 10`;
      const [result] = await pool.execute(listSql);
      response = {
        result,
        totalQty,
      };
      res.send(response);
    }
  } catch (err) {
    response = {
      err: 'pageError',
    };
    res.status(500).send(response);
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

exports.replyWrite = async (req, res) => {
  const { content, q_id, u_id } = req.body;
  const conn = await pool.getConnection();
  const recordSql = `INSERT INTO q_reply(q_id,content,date,u_id) 
                     VALUES(${q_id},'${content}',now(), ${u_id})`;
  const bringSql = `SELECT qr.qr_id, qr.q_id, qr.content,
                    DATE_FORMAT(qr.date, '%y-%m-%d %H:%i') as date,
                    user.userAlias
                    FROM q_reply qr
                    JOIN user
                    ON qr.u_id = user.u_id
                    WHERE q_id = ${q_id}`;
  try {
    const [isRecorded] = await conn.query(recordSql);
    const [recordedData] = await conn.query(bringSql);
    const response = {
      rows: isRecorded.affectedRows,
      record: recordedData,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err.message);
    res.status(400).send('error');
  } finally {
    conn.release();
  }
};

exports.replyDelete = async (req, res) => {
  const { qr_id } = req.body;
  const deleteSql = `DELETE FROM q_reply WHERE qr_id=${qr_id}`;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(deleteSql);
    const response = {
      isDeleted: result.affectedRows,
    };
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send('댓글 삭제 실패');
  } finally {
    conn.release();
  }
};

exports.replyUpdate = async (req, res) => {
  const { qr_id, changedReply } = req.body;
  const conn = await pool.getConnection();
  const updateSql = `UPDATE q_reply SET content = '${changedReply}', date = now() WHERE qr_id = ${qr_id}`;
  const bringSql = `SELECT content, DATE_FORMAT(date, '%y-%m-%d %H:%i') as date 
                    FROM q_reply WHERE qr_id = ${qr_id}`;
  try {
    const [isUpdated] = await conn.query(updateSql);
    const [[changedData]] = await conn.query(bringSql);
    const response = {
      isUpdated: isUpdated.affectedRows,
      changedData,
    };
    res.status(200).send(response);
  } catch (err) {
    console.log(err.message);
  } finally {
    conn.release();
  }
};
