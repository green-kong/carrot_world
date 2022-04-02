require('dotenv').config();

const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const { pool } = require('../../model/db/db.js');
const alertmove = require('../../utils/user/alertmove.js');
const { makeToken } = require('../../utils/user/jwt.js');
const { nextTick } = require('process');

router.post('/login', async (req, res) => {
  const { userEmail, userPW } = req.body;
  console.log(req.body);
  const conn = await pool.getConnection();
  const sql = `SELECT * FROM user WHERE userEmail = '${userEmail}'and userPW='${userPW}'`;
  const sql2 = `SELECT * FROM user WHERE userEmail='${userEmail}' and isAdmin=1`;
  console.log(sql);
  try {
    const [result] = await conn.query(sql);

    if (result.length === 0) {
      res.send(
        alertmove(
          'http://localhost:3000/admin/login',
          '아이디와 비밀번호를 확인하세요.'
        )
      );
    } else {
      const [result2] = await conn.query(sql2);
      console.log(result2);
      if (result2.length === 0) {
        res.send(
          alertmove(
            'http://localhost:3000/admin/login',
            '아이디와 비밀번호를 확인하세요'
          )
        );
      } else {
        const pwCheck = bcrypt.compare(userPW, result2[0].userPW);
        if (pwCheck) {
          const payload = {
            u_id: result[0].u_id,
            userEmail: result[0].userEmail,
          };
          const token = makeToken(payload);
          res.cookie('Access_token', token, { maxAge: 1000 * 60 * 60 });
          res.send(
            alertmove(
              'http://localhost:3000/admin/board',
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
    }
  } catch (err) {
    console.log(err);
    res.send(
      alertmove(
        'http://localhost:3000/admin/login',
        '잠시 후에 다시 시도해주세요.'
      )
    );
  } finally {
    conn.release();
  }
});

router.post('/auth', async (req, res) => {
  const { u_id } = req.body;
  const conn = await pool.getConnection();
  const sql = `SELECT * FROM user WHERE u_id='${u_id}'`;
  const slikeSql = `SELECT * FROM s_likes WHERE u_id='${u_id}'`;
  const aulikeSql = `SELECT * FROM au_likes WHERE u_id='${u_id}'`;
  const chatSql = 'SELECT * FROM chat';
  try {
    const [[userResult]] = await conn.query(sql);
    const [slikeTmp] = await conn.query(slikeSql);
    const slikeResult = slikeTmp.map((v) => v.s_id);
    const [aulikeTmp] = await conn.query(aulikeSql);
    const aulikeResult = aulikeTmp.map((v) => v.au_id);
    const [chatTmp] = await conn.query(chatSql);
    const chatResult = [];
    chatTmp.forEach((v) => {
      v.members.split(',');
      if (v.members.includes(u_id)) {
        chatResult.push(v.c_id);
      }
    });
    const result = { userResult, slikeResult, aulikeResult, chatResult };
    res.send(result);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
});

module.exports = router;
