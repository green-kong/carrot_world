const { pool } = require('../../model/db/db.js');

exports.graph = async (req, res) => {
  const conn = await pool.getConnection();
  const categorySql = 'SELECT * FROM category';
  const select = `ROUND(
                    COUNT(
                      CASE WHEN c_code = '{c_code}' AND isSold='1' THEN 1 END)/
                    COUNT(
                      CASE WHEN c_code = '{c_code}' THEN 1 END)
                    *100)
                    AS '{table}/{c_name}'`;
  try {
    const [categoryList] = await conn.query(categorySql);
    const auction = categoryList.reduce((acc, cur, i, t) => {
      let returnVal = `${acc}${select
        .replace(/{c_code}/g, cur.c_code)
        .replace('{c_name}', cur.c_name)
        .replace('{table}', '경매')}`;
      if (i !== t.length - 1) {
        returnVal = `${returnVal},`;
      }
      return returnVal;
    }, '');

    const sell = categoryList.reduce((acc, cur, i, t) => {
      let returnVal = `${acc}${select
        .replace(/{c_code}/g, cur.c_code)
        .replace('{c_name}', cur.c_name)
        .replace('{table}', '중고거래')}`;
      if (i !== t.length - 1) {
        returnVal = `${returnVal},`;
      }
      return returnVal;
    }, '');

    const auctionSql = `SELECT ${auction} from auction`;
    const sellSql = `SELECT ${sell} from sell_board`;
    const [[auctionTmp]] = await conn.query(auctionSql);
    const [[sellTmp]] = await conn.query(sellSql);
    const auctionResult = Object.entries(auctionTmp);
    const sellResult = Object.entries(sellTmp);
    const result = [...auctionResult, ...sellResult];
    result.sort((a, b) => b[1] - a[1]);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};

exports.main = async (req, res) => {
  const sellLikeSql = `SELECT s_id, subject, likes , 
                      DATE_FORMAT(date,'%y-%m-%d') AS date
                      FROM sell_board
                      ORDER BY likes DESC
                      LIMIT 5`;
  const auLikeSql = `SELECT au_id, subject, likes , 
                    DATE_FORMAT(date,'%y-%m-%d') AS date
                    FROM auction
                    ORDER BY likes DESC
                    LIMIT 5`;
  const conn = await pool.getConnection();
  try {
    const [sLikeResult] = await conn.query(sellLikeSql);
    const [auLikeResult] = await conn.query(auLikeSql);
    const likeResult = [...sLikeResult, ...auLikeResult]
      .sort((a, b) => b.likes - a.likes)
      .filter((_, i) => i < 5)
      .map((v) => {
        const tmp = Object.keys(v)[0];
        const table = tmp === 'au_id' ? 'auction' : 'sell_board';
        const tableName = tmp === 'au_id' ? '경매' : '중고거래';
        v.table = table;
        v.tableName = tableName;
        const newObj = {
          idx: v.au_id || v.s_id,
          ...v,
        };
        return newObj;
      });
    res.send(likeResult);
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};
