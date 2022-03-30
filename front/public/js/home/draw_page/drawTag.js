import moveView from '../view.js';

export default async function drawTag() {
  const [, table, tmp] = window.location.hash.replace('#', '').split('/');

  const tag = decodeURIComponent(tmp);
  const tagTable = table === 'auction' ? 'au_tag' : 's_tag';
  const way = table === 'auction' ? '경매' : '중고거래';

  const url = 'http://localhost:4000/api/home/tag';
  const body = { table, tag, tagTable };

  const response = await axios.post(url, body);
  if (response.status === 200) {
    const itemListTem = document.querySelector(
      '#search_item_list_template'
    ).innerHTML;
    const bidItems = document.querySelector('#main_auction_list').innerHTML;
    const sellItems = document.querySelector('#main_sell_list').innerHTML;
    const contentFrame = document.querySelector('#content_frame');
    let listResult;
    if (table === 'auction') {
      listResult = response.data.reduce((acc, cur) => {
        return (
          acc +
          bidItems
            .replace('{au_id}', cur.au_id)
            .replace('{img}', cur.img)
            .replace('{bidStart}', cur.bidStart)
            .replace('{subject}', cur.subject)
            .replace('{price}', cur.price)
            .replace('{date}', cur.date)
        );
      }, '');
    } else {
      listResult = response.data.reduce((acc, cur) => {
        return (
          acc +
          sellItems
            .replace('{s_id}', cur.s_id)
            .replace('{img}', cur.img)
            .replace('{subject}', cur.subject)
            .replace('{price}', cur.price)
            .replace('{date}', cur.date)
        );
      }, '');
    }

    const result = itemListTem
      .replace('{way}', way)
      .replace('{keyword}', `#${tag}`)
      .replace('{itemList}', listResult);

    contentFrame.innerHTML = result;

    moveView();
  } else {
    alert('잠시후 다시 시도해 주세요.');
  }
}
