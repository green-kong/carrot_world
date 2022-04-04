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
