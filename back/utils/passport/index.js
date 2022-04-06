const kakao = require('./kakao.js');
const naver = require('./naver.js');
const google = require('./google.js');

module.exports = () => {
  kakao();
  naver();
  google();
};
