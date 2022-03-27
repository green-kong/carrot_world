export default async function clictCategory() {
  const categoryList = document.querySelectorAll('.listname');

  categoryList.forEach((v) => {
    v.addEventListener('click', changeCategory);
  });

  async function changeCategory(e) {
    const { way } = e.target.parentNode.dataset;
    const { code } = e.target.dataset;
    const category = e.target.innerHTML;

    const url = 'http://localhost:4000/api/home/list?page=1';
    const body = { way, code };

    const response = await axios.post(url, body);
    const { data: itemList } = response;

    const itemListTemp = document.querySelector(
      '#item_list_template'
    ).innerHTML;
    let items;
    if (way === 'sell') {
      const sellTemp = document.querySelector('#main_sell_list').innerHTML;
      items = itemList.reduce((acc, cur) => {
        return (
          acc +
          sellTemp
            .replace('{img}', cur.img)
            .replace('{bidStart}', cur.bidStart)
            .replace('{subject}', cur.subject)
            .replace('{price}', cur.price)
            .replace('{date}', cur.date)
        );
      }, '');
    } else {
      const auctionTemp =
        document.querySelector('#main_auction_list').innerHTML;
      items = itemList.reduce((acc, cur) => {
        return (
          acc +
          auctionTemp
            .replace('{img}', cur.img)
            .replace('{bidStart}', cur.bidStart)
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
  }
}
