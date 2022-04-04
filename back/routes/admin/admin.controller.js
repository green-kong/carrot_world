const { pool } = require('../../model/db/db.js');

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
