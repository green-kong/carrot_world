const { pool } = require('../../model/db/db.js');
const bcrypt = require('bcrypt');
const alertmove = require('../../utils/user/alertmove.js');
const { makeToken } = require('../../utils/user/jwt.js');

exports.sell = async (req, res) => {
  const page = Number(req.body.page);
  const sql = `SELECT s_id, subject, userAlias, 
                FORMAT(price,0) AS price, DATE_FORMAT(date, '%y-%m-%d') AS date,
                likes, c_name, how,isSold
                FROM sell_board
                JOIN user
                ON sell_board.u_id = user.u_id
                JOIN category
                ON sell_board.c_code = category.c_code
                LIMIT ${(page - 1) * 10},10`;
  const countSql = `SELECT COUNT(*) AS total 
                    FROM sell_board`;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(sql);
    const [[countResult]] = await conn.query(countSql);
    res.send({ result, countResult });
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};

exports.auction = async (req, res) => {
  const page = Number(req.body.page);
  const sql = `SELECT au_id, subject, user.userAlias, 
                FORMAT(price,0) AS price, DATE_FORMAT(date, '%y-%m-%d') AS date,
                DATE_FORMAT(startDate, '%y-%m-%d') AS bidStart, u1.userAlias AS bid_mem,
                likes, c_name, how,isSold
                FROM auction
                JOIN user
                ON auction.u_id = user.u_id
                LEFT OUTER JOIN user u1
                ON u1.u_id = bid_mem
                JOIN category
                ON auction.c_code = category.c_code
                LIMIT ${(page - 1) * 10},10`;
  const countSql = `SELECT COUNT(*) AS total 
                    FROM auction`;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(sql);
    const [[countResult]] = await conn.query(countSql);
    res.send({ result, countResult });
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};

exports.login = async (req, res) => {
  const { userEmail, userPW } = req.body;
  const conn = await pool.getConnection();
  const sql = `SELECT * FROM user WHERE userEmail = '${userEmail}'and userPW='${userPW}'`;
  const sql2 = `SELECT * FROM user WHERE userEmail='${userEmail}' and isAdmin=1`;
  try {
    const [result] = await conn.query(sql);
    if (result.length === 0) {
      const [result2] = await conn.query(sql2);
      if (result2.length === 0) {
        res.send(
          alertmove(
            'http://localhost:3000/admin/login',
            '아이디와 비밀번호를 확인하세요.'
          )
        );
      } else {
        const pwResult = await bcrypt.compare(userPW, result2[0].userPW);
        if (pwResult) {
          const payload = {
            u_id: result2[0].u_id,
            useEmail: result2[0].userEmail,
          };
          const token = makeToken(payload);
          res.cookie('Access_token', token, { maxAge: 1000 * 60 * 60 });
          res.send(
            alertmove(
              'http://localhost:3000/admin/statistics',
              '관리자님 환영합니다'
            )
          );
        } else {
          res.send(
            alertmove(
              'http://localhost:3000/admin/login',
              '아이디와 비밀번호를 확인하세요'
            )
          );
        }
      }
    } else {
      const payload = {
        u_id: result[0].u_id,
        useEmail: result[0].userEmail,
      };
      const token = makeToken(payload);
      res.cookie('Access_token', token, { maxAge: 1000 * 60 * 60 });
      res.send(
        alertmove(
          'http://localhost:3000/admin/statistics',
          '관리자님 환영합니다'
        )
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.auth = async (req, res) => {
  const { u_id } = req.body;
  const conn = await pool.getConnection();
  const sql = `SELECT * FROM user WHERE u_id='${u_id}'`;
  try {
    const [[result]] = await conn.query(sql);
    res.send(result);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.user = async (req, res) => {
  const page = Number(req.body.page);
  const sql = `SELECT user.u_id ,
              ANY_VALUE(userAlias) AS userAlias, 
              ANY_VALUE(userEmail) AS userEmail,
              ANY_VALUE(userMobile) AS userMobile,
              SUM(tmp.total) AS totalCount, SUM(tmp.sold) AS soldCount
              FROM
                (
                SELECT u_id,COUNT(*) AS total, COUNT(CASE WHEN isSold=1 THEN 1 END) AS sold FROM auction GROUP BY u_id
                UNION ALL
                SELECT u_id,COUNT(*) AS total, COUNT(CASE WHEN isSold=1 THEN 1 END) AS sold FROM sell_board GROUP BY u_id
                )tmp
              RIGHT JOIN user
              ON tmp.u_id = user.u_id
              GROUP BY u_id
              LIMIT ${(page - 1) * 10},10`;
  const countSql = `SELECT COUNT(*) AS total 
                    FROM sell_board`;
  const conn = await pool.getConnection();
  try {
    const [[countResult]] = await conn.query(countSql);
    const [tmp] = await conn.query(sql);
    const result = tmp.map((v) => {
      const obj = { ...v };
      obj.u_id = v.u_id;
      obj.userAlias = v.userAlias || '없음';
      obj.userMobile = v.userMobile || '없음';
      obj.totalCount = v.totalCount || '없음';
      obj.soldCount = v.soldCount || '없음';
      obj.sellingCount =
        v.totalCount === null ? '없음' : v.totalCount - v.soldCount;
      return obj;
    });
    res.send({ result, countResult });
  } catch (err) {
    console.log(err);
    res.send(500).send('fail');
  } finally {
    conn.release();
  }
};

exports.qa = async (req, res) => {
  const page = Number(req.body.page);
  const sql = `SELECT tmp.replyCount, subject, 
              qa.q_id, DATE_FORMAT(qa.date,'%y-%m-%d') AS date,
              hit, userAlias
              FROM 
                (
                SELECT COUNT(*) AS replyCount, ANY_VALUE(q_id) AS q_id FROM q_reply GROUP BY u_id
                ) tmp
              RIGHT JOIN qa
              ON qa.q_id=tmp.q_id
              JOIN user
              ON qa.u_id=user.u_id
              `;
  const countSql = `SELECT COUNT(*) AS total 
                    FROM qa`;
  const conn = await pool.getConnection();
  try {
    const [tmp] = await conn.query(sql);
    const [[countResult]] = await conn.query(countSql);
    const result = tmp.map((v) => {
      const obj = { ...v };
      obj.replyCount = v.replyCount === null ? 0 : v.replyCount;
      return obj;
    });
    res.send({ result, countResult });
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};

exports.qaDel = async (req, res) => {
  const { idx } = req.body;
  const delSql = `DELETE FROM qa WHERE q_id=${idx}`;
  const conn = await pool.getConnection();
  try {
    await conn.query(delSql);
    res.send('deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};

exports.auDel = async (req, res) => {
  const { idx } = req.body;
  const delSql = `DELETE FROM auction WHERE au_id=${idx}`;
  const conn = await pool.getConnection();
  try {
    await conn.query(delSql);
    res.send('deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};

exports.sellDel = async (req, res) => {
  const { idx } = req.body;
  const delSql = `DELETE FROM sell_board WHERE s_id=${idx}`;
  const conn = await pool.getConnection();
  try {
    await conn.query(delSql);
    res.send('deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};

exports.userDel = async (req, res) => {
  const { idx } = req.body;
  const delSql = `DELETE FROM user WHERE u_id=${idx}`;
  const conn = await pool.getConnection();
  try {
    await conn.query(delSql);
    res.send('deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};
