const { pool } = require('../../model/db/db.js');

exports.main = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const categorySql = 'SELECT * FROM category';
    const [categoryList] = await conn.query(categorySql);
    const auctionSql = `SELECT 
                        subject, img, 
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
                     subject, img, 
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
           subject, img, 
           FORMAT(price,0) AS price, 
           DATE_FORMAT(date,'%y-%m-%d') AS date
           FROM sell_board
           JOIN s_img
           ON sell_board.s_id = s_img.s_id
           WHERE c_code ='${code}'
           GROUP BY s_img.img,sell_board.s_id
           LIMIT ${(page - 1) * 32}, 32`;
  } else {
    sql = `SELECT 
           subject, img, 
           FORMAT(price,0) AS price, 
           DATE_FORMAT(date,'%y-%m-%d') AS date, 
           DATEDIFF(startDate,date) AS bidStart 
           FROM auction
           JOIN au_img
           ON auction.au_id = au_img.au_id
           WHERE c_code='${code}'
           GROUP BY au_img.img,auction.au_id
           LIMIT ${(page - 1) * 32}, 32`;
  }
  try {
    const [result] = await conn.query(sql);
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send('err');
  } finally {
  }
};
