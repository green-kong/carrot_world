require('dotenv').config();

const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const { pool } = require('../../model/db/db.js');
const alertmove = require('../../utils/user/alertmove.js');
const { makeToken } = require('../../utils/user/jwt.js');

router.post('/login', async (req, res) => {
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
});
router.post('/auth', async (req, res) => {
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
});

module.exports = router;
