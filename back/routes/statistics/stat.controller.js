const { pool } = require('../../model/db/db.js');

exports.graph = async (req, res) => {
  const conn = await pool.getConnection();
  const categorySql = 'SELECT * FROM category';
  const select = `ROUND(count(case when c_code = '{c_code}' and isSold='1' then 1 end)/count(case when c_code = '{c_code}' then 1 end)*100) AS '{table}/{c_name}'`;
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
