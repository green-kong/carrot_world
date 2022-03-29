const express = require('express');

const adminRouter = require('./admin/adminRouter.js');
const qaRouter = require('./qa/qaRouter.js');
const chatRouter = require('./chat/chatRouter.js');
const homeRouter = require('./home/homeRouter.js');
const userRouter = require('./user/userRouter.js');

const router = express.Router();

router.use('/admin', adminRouter);

router.use('/qa', qaRouter);

router.use('/chat', chatRouter);

router.use('/home', homeRouter);

router.use('/user', userRouter);

// 임시 로그인 만들어둔 것 (나중에 삭제해야함)
const temp = [
  {
    u_id: 3,
    userEmail: 'yjlee@gmail.com',
    userPW: '1234',
    userAlias: 'yjlee',
    userMobile: '010-9967-6161',
    point: 0,
  },
  {
    u_id: 4,
    userEmail: 'hoochu@gmail.com',
    userPW: '1234',
    userAlias: 'hoochu',
    userMobile: '010-1004-1004',
    point: 0,
  },
  {
    u_id: 5,
    userEmail: 'ahdjd5@gmail.com',
    userPW: '1234',
    userAlias: '큰완두콩',
    userMobile: '010-1234-1234',
    point: 0,
  },
  {
    u_id: 6,
    userEmail: 'whatsup@gmail.com',
    userPW: '1234',
    userAlias: '화섭이',
    userMobile: '010-5678-5678',
    point: 0,
  },
];

router.get('/user/login', (req, res) => {
  res.render('user/login.html');
});

router.use(express.urlencoded({ extended: true }));
router.post('/user/login', (req, res) => {
  const { userEmail, userPW } = req.body;
  let [loginUser] = temp.filter(
    (v) => v.userEmail === userEmail && v.userPW === userPW
  );
  console.log(loginUser);
  delete loginUser.userPW;
  res
    .setHeader('Set-Cookie', `loginUser=${JSON.stringify(loginUser)}`)
    .redirect('/chat');
});

module.exports = router;
