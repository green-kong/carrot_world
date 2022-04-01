import itemClickEvent from '../view.js';

export default async function drawCategory() {
  const [, way, code, tmp] = window.location.hash.replace('#', '').split('/');
  const category = decodeURIComponent(tmp);

  const url = 'http://localhost:4000/api/home/list?page=1';
  const body = { way, code };

  const response = await axios.post(url, body);
  const { data: itemList } = response;

  const itemListTemp = document.querySelector('#item_list_template').innerHTML;
  let items;
  if (way === 'sell') {
    const sellTemp = document.querySelector('#main_sell_list').innerHTML;
    items = itemList.reduce((acc, cur) => {
      return (
        acc +
        sellTemp
          .replace('{s_id}', cur.s_id)
          .replace('{img}', cur.img)
          .replace('{bidStart}', cur.bidStart)
          .replace('{subject}', cur.subject)
          .replace('{price}', cur.price)
          .replace('{date}', cur.date)
      );
    }, '');
  } else {
    const auctionTemp = document.querySelector('#main_auction_list').innerHTML;
    items = itemList.reduce((acc, cur) => {
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
        auctionTemp
          .replace('{au_id}', cur.au_id)
          .replace('{img}', cur.img)
          .replace('{bidStart}', bidStart)
          .replace('{subject}', cur.subject)
          .replace('{price}', cur.price)
          .replace('{date}', cur.date)
      );
    }, '');
  }

  const result = itemListTemp
    .replace('{itemList}', items)
    .replace('{way}', way === 'sell' ? '중고거래' : '경매')
    .replace('{category}', category);

  const contentFrame = document.querySelector('#content_frame');
  contentFrame.innerHTML = result;
  itemClickEvent();
}
