const { pool } = require('../../model/db/db.js');
const makeSqlByCategory = require('../../utils/sqlGenerator/byCategory.js');

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
    const auction = makeSqlByCategory(categoryList, select, '경매');
    const sell = makeSqlByCategory(categoryList, select, '중고거래');

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

  const categorySql = 'SELECT * FROM category';
  const popCount = `COUNT(
                      CASE WHEN c_code = '{c_code}' THEN 1 END) AS '{table}/{c_name}'`;

  const topSellerSql = `SELECT tmp.u_id ,userAlias , 
                        SUM(tmp.total) AS totalCount, SUM(tmp.sold) AS soldCount
                        FROM
                          (
                          SELECT u_id,COUNT(*) AS total, COUNT(CASE WHEN isSold=1 THEN 1 END) AS sold FROM auction GROUP BY u_id
                          UNION ALL
                          SELECT u_id,COUNT(*) AS total, COUNT(CASE WHEN isSold=1 THEN 1 END) AS sold FROM sell_board GROUP BY u_id
                          )tmp
                        JOIN user
                        ON tmp.u_id = user.u_id
                        GROUP BY u_id
                        ORDER BY soldCount DESC
                        LIMIT 5`;
  const pointCollectorSql = `SELECT u_id, userAlias, point 
                            FROM user
                            ORDER BY point DESC
                            LIMIT 5`;

  const conn = await pool.getConnection();
  try {
    const [categoryList] = await conn.query(categorySql);
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

    const sellPop = makeSqlByCategory(categoryList, popCount, '중고거래');
    const auPop = makeSqlByCategory(categoryList, popCount, '경매');
    const sellPopCat = `SELECT ${sellPop} FROM sell_board`;
    const auPopCat = `SELECT ${auPop} FROM auction`;
    const [[sellPopResult]] = await conn.query(sellPopCat);
    const [[auPopResult]] = await conn.query(auPopCat);
    const popCatResult = [
      ...Object.entries(sellPopResult),
      ...Object.entries(auPopResult),
    ]
      .sort((a, b) => b[1] - a[1])
      .filter((_, i) => i < 5)
      .map((v) => {
        const obj = {};
        obj.category = v[0];
        obj.count = v[1];
        return obj;
      });

    const [topSellerResult] = await conn.query(topSellerSql);

    const [pointCollectorResult] = await conn.query(pointCollectorSql);
    res.send({
      categoryList,
      likeResult,
      popCatResult,
      topSellerResult,
      pointCollectorResult,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  } finally {
    conn.release();
  }
};
