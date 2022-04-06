require('dotenv').config();
const passport = require('passport');
const NaverStrategy = require('passport-naver-v2').Strategy;
const NaverProfile = require('passport-naver-v2').Profile;
const { pool } = require('../../model/db/db.js');

const clientID = process.env.NAVER_API_KEY;
const clientSecret = process.env.NAVER_SECRET;
const callbackURL = 'http://localhost:4000/api/auth/naver/callback';
const naverConfig = { clientID, clientSecret, callbackURL };

const NaverStrategyCb = async (accessToken, refreshToken, profile, done) => {
  const { id: snsId, nickname, profileImage: profileImg } = profile;

  const conn = await pool.getConnection();
  const selectSql = `SELECT * FROM user WHERE sns_id='${snsId}'`;
  const insertSql = `INSERT INTO user
                          (sns_id,userAlias,provider,u_img)
                          VALUES('${snsId}','${nickname}','네이버','${profileImg}')`;
  try {
    const [[exUser]] = await conn.query(selectSql);
    if (!exUser) {
      await conn.query(insertSql);
      const [[newUser]] = await conn.query(selectSql);
      done(null, newUser);
    } else {
      done(null, exUser);
    }
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
};

module.exports = () => {
  passport.use(new NaverStrategy(naverConfig, NaverStrategyCb));
};
