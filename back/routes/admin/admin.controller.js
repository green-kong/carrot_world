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

exports.userProfile = async (req, res) => {
  const { idx } = req.body;
  const sql = `SELECT * FROM user
              WHERE u_id='${idx}'`;
  const conn = await pool.getConnection();
  try {
    const [[result]] = await conn.query(sql);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('실패했습니다.');
  } finally {
    conn.release();
  }
};

exports.createCat = async (req, res) => {
  const { code, name } = req.body;

  const sql = `INSERT INTO category (c_code,c_name) VALUES ('${code}','${name}')`;
  const codeCheckSql = `SELECT * FROM category WHERE c_code='${code}'`;
  const nameCheckSql = `SELECT * FROM category WHERE c_name='${name}'`;
  const conn = await pool.getConnection();
  try {
    const [codeResult] = await conn.query(codeCheckSql);
    const [nameResult] = await conn.query(nameCheckSql);
    if (codeResult.length > 0) {
      throw new Error('이미존재하는 카테고리 코드 입니다.');
    }
    if (nameResult.length > 0) {
      throw new Error('이미존재하는 카테고리 이름 입니다.');
    }
    await conn.query(sql);
    res.send('success');
  } catch (err) {
    res.status(202).send(err.message);
    console.log(err);
  } finally {
    conn.release();
  }
};

exports.delCat = async (req, res) => {
  const { code } = req.body;
  const checkSql = `SELECT SUM(count) AS total 
                    FROM
                      (
                      SELECT COUNT(*) AS count FROM auction WHERE c_code='${code}'
                      UNION
                      SELECT COUNT(*) AS count FROM sell_board WHERE c_code='${code}'
                      ) cnt`;
  const delSql = `DELETE FROM category WHERE c_code='${code}'`;
  const conn = await pool.getConnection();
  try {
    const [[{ total }]] = await conn.query(checkSql);
    if (total > 0) {
      throw new Error('해당 카테고리의 글을 모두 옮긴 후 가능합니다.');
    }

    await conn.query(delSql);
    res.send('success');
  } catch (err) {
    console.log(err);
    res.status(202).send(err.message);
  } finally {
    conn.release();
  }
};

exports.editCat = async (req, res) => {
  const { code, name } = req.body;

  const updateSql = `UPDATE category SET c_name ='${name}' WHERE c_code='${code}'`;

  const conn = await pool.getConnection();
  try {
    await conn.query(updateSql);
    res.send('success');
  } catch (err) {
    console.log(err);
    res.status(202).send(err.message);
  } finally {
    conn.release();
  }
};

exports.changeCat = async (req, res) => {
  const { prevCode, newCode } = req.body;
  const auctionChange = `UPDATE auction SET c_code='${newCode}' WHERE c_code='${prevCode}'`;
  const sellChange = `UPDATE sell_board SET c_code='${newCode}' WHERE c_code='${prevCode}'`;

  const conn = await pool.getConnection();
  try {
    await conn.query(auctionChange);
    await conn.query(sellChange);
    res.send('success');
  } catch (err) {
    console.log(err);
    res.status(202).send('fail');
  } finally {
    conn.release();
  }
};
