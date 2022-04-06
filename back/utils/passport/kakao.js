require('dotenv').config();
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { pool } = require('../../model/db/db.js');

const clientID = process.env.KAKAO_API_KYE;
const CLIENT_SECRET = process.env.KAKAO_SECRET;
const callbackURL = 'http://localhost:4000/api/auth/kakao/callback';

const kakaoConfig = { clientID, callbackURL };

const KakaoStrategyCb = async (accessToken, refreshToken, profile, done) => {
  const {
    id: snsId,
    provider,
    _json: {
      properties: { nickname, profile_image: profileImg },
    },
  } = profile;

  const conn = await pool.getConnection();
  const selectSql = `SELECT * FROM user WHERE sns_id=${snsId}`;
  const insertSql = `INSERT INTO user 
                        (sns_id,userAlias,provider,u_img)
                        VALUES('${snsId}','${nickname}','카카오','${profileImg}')`;
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

// const id = Number(profile.id);
// const profileImg = profile._json.properties.profile_image;
// const selectSql = `SELECT * FROM kakao_user WHERE id =${id}`;
// const insertSql = `INSERT INTO kakao_user(id,img) values(${id},${profileImg})`;
// const conn = await pool.getConnection();
// try {
//   const [[exUser]] = await conn.query(selectSql);
//   if (exUser) {
//     done(null, exUser);
//     return;
//   }
//   const [[result]] = await conn.query(insertSql);
// } catch (err) {
//   console.log(err);
// }
