require('dotenv').config();
const passport = require('passport');
const KakaoStrategy = require('passport-google-oauth20').Strategy;
const { pool } = require('../../model/db/db.js');

const clientID = process.env.GOOGLE_API_KEY;
const clientSecret = process.env.GOOGLE_SECRET;
const callbackURL = 'http://localhost:4000/api/auth/google/callback';

const kakaoConfig = { clientID, clientSecret, callbackURL };

const KakaoStrategyCb = async (accessToken, refreshToken, profile, done) => {
  const { sub: snsId, name, picture: profileImg } = profile._json;
  const nickname = name.replace(/ /g, '');
  const conn = await pool.getConnection();
  const selectSql = `SELECT * FROM user WHERE sns_id=${snsId}`;
  const insertSql = `INSERT INTO user
                          (sns_id,userAlias,provider,u_img)
                          VALUES('${snsId}','${nickname}','구글','${profileImg}')`;
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
  passport.use(new KakaoStrategy(kakaoConfig, KakaoStrategyCb));
};
