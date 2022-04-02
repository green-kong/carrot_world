import clickCategory from './category.js';
import itemClickEvent from './view.js';

export default async function init() {
  const url = 'http://localhost:4000/api/home/';
  const response = await axios.post(url);
  if (response.status === 200) {
    const categoryTem = document.querySelector('#category_tem').innerHTML;
    const mainAuctionListTem =
      document.querySelector('#main_auction_list').innerHTML;
    const mainSellListTem = document.querySelector('#main_sell_list').innerHTML;
    const sellList = document.querySelector('#sell_list');
    const bidList = document.querySelector('#bid_list');
    const contentFrame = document.querySelector('#content_frame');

    const { categoryList, auctionList, sellBoardList } = response.data;

    const category = categoryList.reduce((acc, cur) => {
      return (
        acc +
        categoryTem
          .replace('{c_code}', cur.c_code)
          .replace('{c_name}', cur.c_name)
      );
    }, '');
    sellList.innerHTML = category;
    bidList.innerHTML = category;

    const auction = auctionList.reduce((acc, cur) => {
      let bidStart;
      if (cur.bidStart === 0) {
        bidStart = '경매시작 D-day';
      } else if (cur.bidStart > 0) {
        bidStart = `경매시작 D-${cur.bidStart}`;
      } else if (cur.bidStart < 0) {
        bidStart = '경매종료';
      }
      return (
        acc +
        mainAuctionListTem
          .replace('{au_id}', cur.au_id)
          .replace('{img}', cur.img)
          .replace('{bidStart}', bidStart)
          .replace('{subject}', cur.subject)
          .replace('{price}', cur.price)
          .replace('{date}', cur.date)
      );
    }, '');

    const sell = sellBoardList.reduce((acc, cur) => {
      return (
        acc +
        mainSellListTem
          .replace('{s_id}', cur.s_id)
          .replace('{img}', cur.img)
          .replace('{bidStart}', cur.bidStart)
          .replace('{subject}', cur.subject)
          .replace('{price}', cur.price)
          .replace('{date}', cur.date)
      );
    }, '');

    const homeMainTem = document
      .querySelector('#home_main_tem')
      .innerHTML //
      .replace('{auctionList}', auction)
      .replace('{sellList}', sell);

    contentFrame.innerHTML = homeMainTem;

    clickCategory();
    itemClickEvent();
  }
}
