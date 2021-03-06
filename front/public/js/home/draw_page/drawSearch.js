import itemClickEvent from '../view.js';

export default async function drawSearch() {
  const [, way, tmp] = window.location.hash.replace('#', '').split('/');
  const keyword = decodeURIComponent(tmp);
  const searchAllTem = document.querySelector('#home_search_all_tem').innerHTML;
  const sellCon = document.querySelector('#main_sell_list').innerHTML;
  const auctionCon = document.querySelector('#main_auction_list').innerHTML;
  const itemListTem = document.querySelector(
    '#search_item_list_template'
  ).innerHTML;

  const contentFrame = document.querySelector('#content_frame');

  const url = 'http://localhost:4000/api/home/search';
  const body = { way, keyword };

  const response = await axios.post(url, body);
  if (response.status === 200) {
    let result;
    if (way === 'all') {
      const { sellList, auctionList } = response.data;

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
          auctionCon
            .replace('{au_id}', cur.au_id)
            .replace('{img}', cur.img)
            .replace('{bidStart}', bidStart)
            .replace('{subject}', cur.subject)
            .replace('{price}', cur.price)
            .replace('{date}', cur.date)
        );
      }, '');

      if (auctionList.bidStart < 0) {
        bidStart = 'day';
      }

      const sell = sellList.reduce((acc, cur) => {
        return (
          acc +
          sellCon
            .replace('{s_id}', cur.s_id)
            .replace('{img}', cur.img)
            .replace('{subject}', cur.subject)
            .replace('{price}', cur.price)
            .replace('{date}', cur.date)
        );
      }, '');

      result = searchAllTem
        .replace(/{keyword}/g, keyword)
        .replace('{auctionList}', auction)
        .replace('{sellList}', sell);
    } else if (way === 'auction') {
      const { auctionList } = response.data;
      const auction = auctionList.reduce((acc, cur) => {
        return (
          acc +
          auctionCon
            .replace('{au_id}', cur.au_id)
            .replace('{img}', cur.img)
            .replace('{bidStart}', cur.bidStart)
            .replace('{subject}', cur.subject)
            .replace('{price}', cur.price)
            .replace('{date}', cur.date)
        );
      }, '');

      result = itemListTem
        .replace('{way}', '경매')
        .replace('{keyword}', keyword)
        .replace('{itemList}', auction);
    } else if (way === 'sell') {
      const { sellList } = response.data;
      const sell = sellList.reduce((acc, cur) => {
        return (
          acc +
          sellCon
            .replace('{s_id}', cur.s_id)
            .replace('{img}', cur.img)
            .replace('{subject}', cur.subject)
            .replace('{price}', cur.price)
            .replace('{date}', cur.date)
        );
      }, '');

      result = itemListTem
        .replace('{way}', '중고거래')
        .replace('{keyword}', keyword)
        .replace('{itemList}', sell);
    }
    contentFrame.innerHTML = result;

    itemClickEvent();
  } else {
    alert('죄송합니다 잠시후 다시 시도해 주세요.');
  }
}
