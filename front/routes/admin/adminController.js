const axios = require('axios');

const adminDataMaker = require('../../utils/admin/amdinDataMaker.js');

exports.login = (req, res) => {
  res.render('admin/login.html');
};

exports.statistics = async (req, res) => {
  const url = 'http://localhost:4000/api/statistics/main';

  const response = await axios.post(url);

  const {
    data: {
      likeResult,
      popCatResult,
      topSellerResult,
      pointCollectorResult,
      categoryList,
    },
  } = response;

  res.render('admin/statistics.html', {
    categoryList,
    likeResult,
    popCatResult,
    topSellerResult,
    pointCollectorResult,
  });
};

exports.sell = async (req, res) => {
  const { result, pageList, curPage, lastPage } = await adminDataMaker(
    req,
    'sell'
  );

  res.render('admin/sell.html', { result, pageList, curPage, lastPage });
};

exports.auction = async (req, res) => {
  const { result, pageList, curPage, lastPage } = await adminDataMaker(
    req,
    'auction'
  );

  res.render('admin/auction.html', { result, pageList, curPage, lastPage });
};

exports.user = async (req, res) => {
  const { result, pageList, curPage, lastPage } = await adminDataMaker(
    req,
    'user'
  );
  res.render('admin/user.html', { result, pageList, curPage, lastPage });
};

exports.qa = async (req, res) => {
  const { result, pageList, curPage, lastPage } = await adminDataMaker(
    req,
    'qa'
  );
  res.render('admin/qa.html', { result, pageList, curPage, lastPage });
};
