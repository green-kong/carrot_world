const { pool } = require('../../model/db/db.js');

exports.main = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const categorySql = 'SELECT * FROM category';
    const [categoryList] = await conn.query(categorySql);
    const auctionSql = `SELECT 
                        auction.au_id AS au_id
                        ,subject, img, 
                        FORMAT(price,0) AS price, 
                        DATE_FORMAT(date,'%y-%m-%d') AS date, 
                        DATEDIFF(startDate,date) AS bidStart 
                        FROM auction
                        JOIN au_img
                        ON auction.au_id = au_img.au_id
                        GROUP BY au_img.img,auction.au_id
                        ORDER BY rand()
                        LIMIT 8`;
    const [auctionList] = await conn.query(auctionSql);
    const sellSql = `SELECT 
                     sell_board.s_id AS s_id
                     ,subject, img, 
                     FORMAT(price,0) AS price, 
                     DATE_FORMAT(date,'%y-%m-%d') AS date
                     FROM sell_board
                     JOIN s_img
                     ON sell_board.s_id = s_img.s_id
                     GROUP BY s_img.img,sell_board.s_id
                     ORDER BY rand()
                     LIMIT 8`;
    const [sellBoardList] = await conn.query(sellSql);
    const result = { categoryList, auctionList, sellBoardList };
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('err');
  } finally {
    conn.release();
  }
};

exports.write = async (req, res) => {
  const {
    subject,
    dealWay,
    bidDate,
    productType,
    dealPrice,
    dealZone,
    productDetail,
    tag,
    bidHour,
    bidMin,
  } = req.body;
  console.log(req.body);
  const tagList = tag
    .replace(/(\s*)/g, '')
    .split('#')
    .filter((v) => v !== '');

  const fileList = req.files.map((v) => v.filename);

  const conn = await pool.getConnection();
  try {
    let sql;
    let boardtype;
    let prepare;
    if (dealWay === 'sell') {
      boardtype = 's';
      sql = `INSERT INTO sell_board(
             c_code,subject,u_id,price,content,location,date
             )VALUES(
             ?,?,?,?,?,?,now()
             )`;
      prepare = [productType, subject, 1, dealPrice, productDetail, dealZone];
    } else {
      const date = new Date();
      date.setDate(date.getDate() + Number(bidDate));
      const y = date.getFullYear();
      const m = date.getMonth();
      const d = date.getDate();
      const bidStart = new Date(y, m, d, bidHour, bidMin);
      console.log(y, m, d, bidHour, bidMin);
      boardtype = 'au';
      sql = `INSERT INTO auction(
             c_code,subject,u_id,price,content,location,startDate,date
             )VALUES(
             ?,?,?,?,?,?,?,now()
             )`;
      prepare = [
        productType,
        subject,
        1,
        dealPrice,
        productDetail,
        dealZone,
        bidStart,
      ];
    }
    const [result] = await conn.query(sql, prepare);
    const idx = result.insertId;

    tagList.forEach(async (v) => {
      const tagSql = `INSERT INTO ${boardtype}_tag
                        (${boardtype}_id,tag)
                        VALUES
                        ('${idx}','${v}')`;
      await conn.query(tagSql);
    });

    fileList.forEach(async (v) => {
      const imgSql = `INSERT INTO ${boardtype}_img
                        (${boardtype}_id,img)
                        VALUES
                        ('${idx}','${v}')`;
      await conn.query(imgSql);
    });
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
    res.redirect('http://localhost:3000/home');
  }
};

exports.list = async (req, res) => {
  const { way, code } = req.body;
  const page = Number(req.query.page);
  const conn = await pool.getConnection();
  let sql;
  if (way === 'sell') {
    sql = `SELECT 
           sell_board.s_id AS s_id,
           subject, img, 
           FORMAT(price,0) AS price, 
           DATE_FORMAT(date,'%y-%m-%d') AS date
           FROM sell_board
           JOIN s_img
           ON sell_board.s_id = s_img.s_id
           WHERE c_code ='${code}'
           GROUP BY s_img.img,sell_board.s_id
           LIMIT ${(page - 1) * 16}, 16`;
  } else {
    sql = `SELECT 
            auction.au_id AS au_id,
           subject, img, 
           FORMAT(price,0) AS price, 
           DATE_FORMAT(date,'%y-%m-%d') AS date, 
           DATEDIFF(startDate,date) AS bidStart 
           FROM auction
           JOIN au_img
           ON auction.au_id = au_img.au_id
           WHERE c_code='${code}'
           GROUP BY au_img.img,auction.au_id
           LIMIT ${(page - 1) * 16}, 16`;
  }
  try {
    const [result] = await conn.query(sql);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('err');
  } finally {
    conn.release();
  }
};

exports.search = async (req, res) => {
  const { way, keyword } = req.body;
  const limit = way === 'all' ? 8 : 16;
  console.log(way);
  const auctionSql = `SELECT 
                       auction.au_id AS au_id,
                      subject, img, 
                      FORMAT(price,0) AS price, 
                      DATE_FORMAT(date,'%y-%m-%d') AS date, 
                      DATEDIFF(startDate,date) AS bidStart 
                      FROM auction
                      JOIN au_img
                      ON auction.au_id = au_img.au_id
                      WHERE subject like '%${keyword}%'
                      GROUP BY au_img.img,auction.au_id
                      ORDER BY rand()
                      LIMIT ${limit}`;
  const sellSql = `SELECT 
                   sell_board.s_id AS s_id,
                   subject, img, 
                   FORMAT(price,0) AS price, 
                   DATE_FORMAT(date,'%y-%m-%d') AS date
                   FROM sell_board
                   JOIN s_img
                   ON sell_board.s_id = s_img.s_id
                   WHERE subject like '%${keyword}%'
                   GROUP BY s_img.img,sell_board.s_id
                   ORDER BY rand()
                   LIMIT ${limit}`;

  const conn = await pool.getConnection();
  try {
    if (way === 'all') {
      const [auctionList] = await conn.query(auctionSql);
      const [sellList] = await conn.query(sellSql);
      res.send({ auctionList, sellList });
    } else if (way === 'auction') {
      const [auctionList] = await conn.query(auctionSql);
      res.send({ auctionList });
    } else if (way === 'sell') {
      const [sellList] = await conn.query(sellSql);
      res.send({ sellList });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('err');
  } finally {
    conn.release();
  }
};

exports.view = async (req, res) => {
  const { table, idx } = req.body;

  const imgTable = table === 'auction' ? 'au_img' : 's_img';
  const tagTable = table === 'auction' ? 'au_tag' : 's_tag';
  const imgIdx = table === 'auction' ? 'au_id' : 's_id';

  const sellItemSql = `SELECT 
                        sell_board.s_id AS s_id,
                        c_name, subject, sell_board.u_id,
                        FORMAT(price,0) AS price,
                        content, how, location, likes, report, isSold,
                        DATE_FORMAT(date,'%y-%m-%d') AS date
                        FROM sell_board
                        JOIN category
                        ON sell_board.c_code = category.c_code
                        WHERE s_id = '${idx}'`;
  const auItemSql = `SELECT * FROM auction WHERE s_id = ${idx}`;

  const imgSql = `SELECT * FROM ${imgTable} WHERE ${imgIdx}=${idx}`;
  const tagSql = `SELECT  * FROM ${tagTable} WHERE ${imgIdx}=${idx}`;
  const conn = await pool.getConnection();
  try {
    if (table === 'sell_board') {
      const [[itemResult]] = await conn.query(sellItemSql);
      const [imgList] = await conn.query(imgSql);
      const [tagList] = await conn.query(tagSql);
      const recommendPrepare = tagList.map((v) => v.tag);
      let recSqlIn = '';
      recommendPrepare.forEach((v, i, t) => {
        if (i === t.length - 1) {
          recSqlIn += '?';
        } else {
          recSqlIn += '?,';
        }
      });
      const recommendSql = `SELECT s_id FROM ${tagTable} 
                            WHERE tag IN (${recSqlIn})
                            AND s_id != ${idx}
                            GROUP BY s_tag.s_id
                            ORDER BY rand()
                            LIMIT 5`;
      const [recommendList] = await conn.query(recommendSql, recommendPrepare);
      const recItemsIdx = recommendList.map((v) => v.s_id);
      recItemsIdx.forEach((v, i, t) => {
        recSqlIn = '';
        if (i === t.length - 1) {
          recSqlIn += '?';
        } else {
          recSqlIn += '?,';
        }
      });
      const recSql = `SELECT
                      sell_board.s_id,c_name,
                      sell_board.c_code AS c_code,
                      subject, s_img.img,FORMAT(price,0) AS price
                      FROM sell_board
                      JOIN s_img
                      ON s_img.s_id = sell_board.s_id
                      JOIN category
                      ON sell_board.c_code = category.c_code
                      WHERE sell_board.s_id IN (${recSqlIn})
                      GROUP BY sell_board.s_id,s_img.img
                      `;
      const [recList] = await conn.query(recSql, recItemsIdx);
      console.log(recList);
      res.send({ itemResult, imgList, tagList, recList });
    }
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};
