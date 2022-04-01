const express = require('express');

const router = express.Router();

const { pool } = require('../../model/db/db.js');
const alertmove = require('../../utils/user/alertmove.js');
const { makeToken } = require('../../utils/user/jwt.js');
const auth = require('../../../front/middlewares/user/auth.js');

router.post('/login', async (req, res) => {
  const { userEmail, userPW } = req.body;
  const conn = await pool.getConnection();
  const sql = `SELECT * FROM user WHERE userEmail = '${userEmail}' and userPW='${userPW}'`;

  try {
    const [result] = await conn.query(sql);

    if (result.length === 0) {
      res.send(
        alertmove(
          'http://localhost:3000/user/login',
          '아이디와 비밀번호를 확인하세요.'
        )
      );
    } else {
      const payload = {
        u_id: result[0].u_id,
        userEmail: result[0].userEmail,
      };
      const token = makeToken(payload);
      res.cookie('Access_token', token, { maxAge: 1000 * 60 * 60 });
      res.send(
        alertmove('http://localhost:3000/home', '로그인에 성공하였습니다.')
      );
    }
  } catch (err) {
    console.log(err);
    res.send(
      alertmove('http://localhost:3000/home', '잠시 후에 다시 시도해주세요.')
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

router.post('/quit', async (req, res) => {
  const { userEmail } = req.body;
  console.log(req.body);
  const conn = await pool.getConnection();
  const sql = `DELETE FROM user
                  WHERE userEmail='${userEmail}'`;
  try {
    const result = await conn.query(sql);
    console.log(result);
    res.send(
      alertmove(
        'http://localhost:3000/user/logout',
        '회원탈퇴가 완료되었습니다'
      )
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send(
        alertmove(
          'http://localhost:3000/user/profile/edit',
          '잠시 후에 다시 시도해주세요'
        )
      );
  } finally {
    conn.release();
  }
});

router.post('/profile/edit', async (req, res) => {
  const { userEmail, userAlias, userMobile } = req.body;
  const conn = await pool.getConnection();
  const sql = `UPDATE user 
               SET userEmail='${userEmail}', userAlias='${userAlias}', userMobile='${userMobile}'
               WHERE userEmail='${userEmail}'`;
  try {
    await conn.query(sql);
    res.send(
      alertmove(
        'http://localhost:3000/user/profile',
        '회원정보 수정이 완료되었습니다.'
      )
    );
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
});

module.exports = router;
