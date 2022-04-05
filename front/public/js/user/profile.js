const tabs = document.querySelector('#profile_tab');
const u_id = document.querySelector('#userIdx').value;
const tabTable = document.querySelector('#tab_table');
const tbody = document.querySelector('tbody');

async function getSell() {
  console.log('check');
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

async function changeTap(e) {
  const tabList = e.target.parentNode.children;
  [...tabList].forEach((v) => {
    v.classList.remove('selected');
  });

  e.target.classList.add('selected');

  const { tapname } = e.target.dataset;

  if (tapname === 'sell') {
    getSell();
  }

  if (tapname === 'auction') {
  }

  if (tapname === 'likes') {
  }

  if (tapname === 'qa') {
  }
}

tabs.addEventListener('click', changeTap);
