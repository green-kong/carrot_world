const { pool } = require('../../model/db/db.js');

exports.sell = async (req, res) => {
  const { page } = req.body;
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
