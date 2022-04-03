async function adminDataMaker(req, table) {
  const { page: curPage } = req.query;
  const url = `http://localhost:4000/api/admin/${table}`;
  const body = { ...req.query };

  const response = await axios.post(url, body);
  if (response.status === 200) {
    const {
      data: {
        result,
        countResult: { total },
      },
    } = response;
    result.forEach((v) => {
      v.how = v.how ? '직거래' : '택배거래';
      v.isSold = v.isSold ? '판매완료' : '판매중';
    });

    const pageList = [];
    const pageCounter = Math.ceil(curPage / 5);
    const lastPage = Math.floor(total / 10) + 1;

    for (let i = 4; i >= 0; i--) {
      const pageCalc = pageCounter * 5 - i;
      if (pageCalc > lastPage) {
        break;
      }
      pageList.push(pageCalc);
    }
    console.log(result);
    return { result, pageList, curPage, lastPage };
  }
}

exports.user = (req, res) => {
  res.render('admin/user.html');
};

module.exports = adminDataMaker;
