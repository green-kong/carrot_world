require('dotenv').config();
const express = require('express');
const passport = require('passport');

const { makeToken } = require('../../utils/user/jwt.js');

const router = express.Router();

router.get('/kakao', passport.authenticate('kakao'));

router.get(
  '/kakao/callback',
  passport.authenticate('kakao', {
    session: false,
    failureRedirect: '/',
  }),
  (req, res) => {
    const payload = { ...req.user };
    const token = makeToken(payload);
    res.cookie('Access_token', token);
    res.redirect('http://localhost:3000/home');
  }
);

router.get('/naver', passport.authenticate('naver', { authType: 'reprompt' }));

router.get(
  '/naver/callback',
  passport.authenticate('naver', { session: false }),
  (req, res) => {
    const payload = { ...req.user };
    const token = makeToken(payload);
    res.cookie('Access_token', token);
    res.redirect('http://localhost:3000/home');
  }
);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const payload = { ...req.user };
    const token = makeToken(payload);
    res.cookie('Access_token', token);
    res.redirect('http://localhost:3000/home');
  }
);
module.exports = router;
