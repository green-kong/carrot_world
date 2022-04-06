const tabs = document.querySelector('#profile_tab');
const u_id = document.querySelector('#userIdx').value;
const tabTable = document.querySelector('#tab_table');

async function getSell() {
  const url = 'http://localhost:4000/api/user/profile/sell';
  const body = { u_id };

  const response = await axios.post(url, body);
  const { data } = response;
  const sellCol = document.querySelector('#sell_column_tem').innerHTML;
  const sellDataTem = document.querySelector('#sell_data_tem').innerHTML;

  const sellDataList = data.reduce((acc, cur) => {
    return (
      acc +
      sellDataTem
        .replace('{sell.s_id}', cur.s_id)
        .replace('{sell.subject}', cur.subject)
        .replace('{sell.price}', cur.price)
        .replace('{sell.isSold}', cur.isSold)
        .replace('{sell.date}', cur.date)
    );
  }, '');

  const result = sellCol.replace('{tbody}', sellDataList);
  tabTable.innerHTML = result;
}

async function getAu() {
  const url = 'http://localhost:4000/api/user/profile/auction';
  const body = { u_id };

  const response = await axios.post(url, body);
  const { data } = response;

  const auCol = document.querySelector('#au_column_tem').innerHTML;
  const auDataTem = document.querySelector('#au_data_tem').innerHTML;

  const auDataList = data.reduce((acc, cur) => {
    return (
      acc +
      auDataTem
        .replace('{sell.s_id}', cur.au_id)
        .replace('{sell.subject}', cur.subject)
        .replace('{sell.price}', cur.price)
        .replace('{sell.isSold}', cur.isSold)
        .replace('{sell.date}', cur.date)
        .replace('{sell.startDate}', cur.startDate)
    );
  }, '');

  const result = auCol.replace('{tbody}', auDataList);
  tabTable.innerHTML = result;
}

async function getLikes(slike, aulike) {
  const url = 'http://localhost:4000/api/user/profile/likes';
  const body = { slike, aulike };

  const response = await axios.post(url, body);

  const { data } = response;

  const likeCol = document.querySelector('#like_column_tem').innerHTML;
  const likeDataTem = document.querySelector('#like_data_tem').innerHTML;

  const likeDataList = data.reduce((acc, cur) => {
    return (
      acc +
      likeDataTem
        .replace('{sell.s_id}', cur.idx)
        .replace('{sell.subject}', cur.subject)
        .replace('{sell.price}', cur.price)
        .replace('{sell.isSold}', cur.isSold)
        .replace('{sell.date}', cur.date)
        .replace('{table}', cur.table)
        .replace('{category}', cur.category)
    );
  }, '');

  const result = likeCol.replace('{tbody}', likeDataList);
  tabTable.innerHTML = result;
}

async function getQa() {
  const url = 'http://localhost:4000/api/user/profile/qa';
  const body = { u_id };

  const response = await axios.post(url, body);

  const { data } = response;

  const qaCol = document.querySelector('#qa_column_tem').innerHTML;
  const qaDataTem = document.querySelector('#qa_data_tem').innerHTML;

  const qaDataList = data.reduce((acc, cur) => {
    return (
      acc +
      qaDataTem
        .replace(/{q_id}/g, cur.q_id)
        .replace('{sell.subject}', cur.subject)
        .replace('{sell.date}', cur.date)
        .replace('{hit}', cur.hit)
    );
  }, '');

  const result = qaCol.replace('{tbody}', qaDataList);
  tabTable.innerHTML = result;
}

async function changeTap(e) {
  const tabList = e.target.parentNode.children;
  const { slike, aulike } = e.target.dataset;
  [...tabList].forEach((v) => {
    v.classList.remove('selected');
  });

  e.target.classList.add('selected');

  const { tapname } = e.target.dataset;

  if (tapname === 'sell') {
    getSell();
  }

  if (tapname === 'auction') {
    getAu();
  }

  if (tapname === 'likes') {
    getLikes(slike, aulike);
  }

  if (tapname === 'qa') {
    getQa();
  }
}

tabs.addEventListener('click', changeTap);
