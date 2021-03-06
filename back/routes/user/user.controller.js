const bcrypt = require('bcrypt');
const { pool } = require('../../model/db/db.js');
const alertmove = require('../../utils/user/alertmove.js');
const { makeToken } = require('../../utils/user/jwt.js');

exports.login = async (req, res) => {
  const { userEmail, userPW } = req.body;
  const conn = await pool.getConnection();
  const sql = `SELECT * FROM user WHERE userEmail = '${userEmail}'`;

  try {
    const [result] = await conn.query(sql);

    if (result.length === 0) {
      res.send(
        alertmove('http://localhost:3000', '아이디와 비밀번호를 확인하세요.')
      );
    } else {
      const encodedPassword = result[0].userPW;
      const passwordCheck = await bcrypt.compare(userPW, encodedPassword);
      if (passwordCheck) {
        const payload = {
          u_id: result[0].u_id,
          userEmail: result[0].userEmail,
        };
        const token = makeToken(payload);
        res.cookie('Access_token', token, { maxAge: 1000 * 60 * 60 });
        res.send(
          alertmove('http://localhost:3000/home', '로그인에 성공하였습니다.')
        );
      } else {
        res.send(
          alertmove('http://localhost:3000', '아이디와 비밀번호를 확인하세요.')
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.send(
      alertmove('http://localhost:3000/home', '잠시 후에 다시 시도해주세요.')
    );
  } finally {
    conn.release();
  }
};

exports.auth = async (req, res) => {
  const { u_id } = req.body;
  const conn = await pool.getConnection();
  const sql = `SELECT * FROM user WHERE u_id='${u_id}'`;
  const slikeSql = `SELECT * FROM s_likes WHERE u_id='${u_id}'`;
  const aulikeSql = `SELECT * FROM au_likes WHERE u_id='${u_id}'`;
  const chatSql = `SELECT c_id, mem1, mem2 FROM chat WHERE mem1 =${u_id} OR mem2=${u_id}`;
  const countSql = `SELECT SUM(tmp.cnt) AS totalCnt
                    FROM (
                      SELECT COUNT(*) AS cnt
                      FROM sell_board
                      WHERE u_id=${u_id}
                      UNION ALL
                      SELECT COUNT(*) AS cnt
                      FROM auction
                      WHERE u_id=${u_id}
                      )tmp`;
  try {
    const [[userResult]] = await conn.query(sql);
    const [slikeTmp] = await conn.query(slikeSql);
    const slikeResult = slikeTmp.map((v) => v.s_id);
    const [aulikeTmp] = await conn.query(aulikeSql);
    const aulikeResult = aulikeTmp.map((v) => v.au_id);
    const [chatTmp] = await conn.query(chatSql);
    const [[totalCount]] = await conn.query(countSql);
    const chatResult = [];
    chatTmp.forEach((v) => {
      chatResult.push(v.c_id);
    });
    if (userResult.u_img === null) {
      userResult.u_img = 'http://localhost:3000/img/carrot_profile.jpeg';
    }
    const result = {
      userResult,
      slikeResult,
      aulikeResult,
      chatResult,
      totalCount,
    };
    res.send(result);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.quit = async (req, res) => {
  const { idx } = req.body;
  const conn = await pool.getConnection();
  const sql = `DELETE FROM user
                  WHERE u_id='${idx}'`;
  try {
    await conn.query(sql);
    res.send('Success');
  } catch (err) {
    console.log(err);
    res.status(500).send('Fail');
  } finally {
    conn.release();
  }
};

exports.join = async (req, res) => {
  const { userEmail, userPW, userAlias, userMobile } = req.body;
  const conn = await pool.getConnection();
  const encryptedPW = await bcrypt.hash(userPW, 10);
  let sql;
  if (req.file === undefined) {
    sql = `INSERT INTO user (userEmail, userPW, userAlias, userMobile, u_img) 
     VALUES ('${userEmail}', '${encryptedPW}', '${userAlias}', '${userMobile}', 'http://localhost:4000/upload/carrot_profile_1649238408026.jpeg')`;
  } else {
    const { filename } = req.file;
    sql = `INSERT INTO user (userEmail, userPW, userAlias, userMobile, u_img) 
  VALUES ('${userEmail}', '${encryptedPW}', '${userAlias}', '${userMobile}', 'http://localhost:4000/upload/${filename}')`;
  }
  try {
    const [result] = await conn.query(sql);
    const response = {
      rows: result.affectedRows,
    };
    res.send(response);
  } catch (err) {
    res.status(500).send('Join error');
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.profileEdit = async (req, res) => {
  const { userEmail, userAlias, userMobile, u_id } = req.body;
  let sql = `UPDATE user
               SET userEmail='${userEmail}', userAlias='${userAlias}', userMobile='${userMobile}'
               WHERE u_id='${u_id}'`;
  if (req.file) {
    const { filename } = req.file;
    sql = `UPDATE user
               SET u_img='http://localhost:4000/upload/${filename}',userEmail='${userEmail}', userAlias='${userAlias}', userMobile='${userMobile}'
               WHERE u_id='${u_id}'`;
  }
  const conn = await pool.getConnection();

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
};

exports.profile = async (req, res) => {
  const { u_id } = req.body;
  const sql = `SELECT 'au'as 'table',u_id, 
                COUNT(CASE WHEN isSold='0' THEN '1' END) AS Cnt,
                COUNT(CASE WHEN isSold='1' THEN '1' END) AS SoldCnt
                FROM auction
                WHERE u_id=${u_id}
                UNION ALL
                SELECT 'sell'as 'table',u_id, 
                COUNT(CASE WHEN isSold='0' THEN '1' END) AS Cnt,
                COUNT(CASE WHEN isSold='1' THEN '1' END) AS SoldCnt
                FROM sell_board
                WHERE u_id=${u_id}
                `;
  const likeSql = `SELECT SUM(tmp.likes)AS totalLikes
                  FROM(
                    SELECT SUM(likes) AS likes
                    FROM sell_board
                    WHERE u_id=${u_id}
                    UNION ALL
                    SELECT SUM(likes) AS likes
                    FROM auction
                    WHERE u_id=${u_id}
                  )tmp`;
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(sql);
    const [[likeResult]] = await conn.query(likeSql);
    res.send({ result, likeResult });
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.sell = async (req, res) => {
  const { u_id } = req.body;
  const sql = `SELECT s_id, subject, FORMAT(price,0) AS price, 
              DATE_FORMAT(date,'%y-%m-%d')AS date, isSold
              FROM sell_board
              WHERE u_id=${u_id}`;
  const conn = await pool.getConnection();
  try {
    const [sellResult] = await conn.query(sql);
    res.send(sellResult);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.auction = async (req, res) => {
  const { u_id } = req.body;
  const sql = `SELECT au_id, subject, FORMAT(price,0) AS price,
              DATE_FORMAT(date,'%y-%m-%d')AS date, isSold,
              DATE_FORMAT(startDate, '%y-%m-%d')AS startDate
              FROM auction
              WHERE u_id=${u_id}`;
  const conn = await pool.getConnection();
  try {
    const [auResult] = await conn.query(sql);
    res.send(auResult);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.likes = async (req, res) => {
  const slike = !req.body.slike.length || req.body.slike;
  const aulike = !req.body.aulike.length || req.body.aulike;

  const sql = `SELECT '중고거래' AS category,
              'sell_board' AS 'table',
              subject, FORMAT(price,0)AS price,
              s_id AS idx, DATE_FORMAT(date,'%y-%m-%d') AS date,
              isSold
              FROM sell_board
              WHERE s_id IN (${slike})
              UNION ALL
              SELECT '경매' AS category,
              'auction' AS 'table',
              subject, FORMAT(price,0)AS price,
              au_id AS idx, DATE_FORMAT(date,'%y-%m-%d') AS date,
              isSold
              FROM auction
              WHERE au_id IN (${aulike})
              `;

  const conn = await pool.getConnection();
  try {
    const [likeResult] = await conn.query(sql);
    res.send(likeResult);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.qa = async (req, res) => {
  const { u_id } = req.body;
  const sql = `SELECT subject, q_id,
              DATE_FORMAT(date,'%y-%m-%d') AS date,
              hit
              FROM qa
              WHERE u_id= ${u_id} `;
  const conn = await pool.getConnection();
  try {
    const [qaList] = await conn.query(sql);
    res.send(qaList);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.idCheck = async (req, res) => {
  const { userEmail } = req.body;
  const conn = await pool.getConnection();

  const sql = `SELECT userEmail FROM user WHERE userEmail = '${userEmail}'`;
  let response;
  try {
    const [result] = await conn.query(sql);
    if (result.length === 0) {
      response = {
        isJoined: 0,
        checkedEmail: userEmail,
      };
    } else {
      response = {
        isJoined: 1,
      };
    }
    res.send(response);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};
