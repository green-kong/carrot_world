const { pool } = require('../../model/db/db.js');

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
