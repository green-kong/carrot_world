async function init() {
  const url = 'http://localhost:4000/api/home/';
  const response = await axios.post(url);
  if (response.status === 200) {
    const categoryTem = document.querySelector('#category_tem').innerHTML;
    const sellList = document.querySelector('#sell_list');
    const bidList = document.querySelector('#bid_list');
    const categoryList = response.data.reduce((acc, cur) => {
      return (
        acc +
        categoryTem
          .replace('{c_code}', cur.c_code)
          .replace('{c_name}', cur.c_name)
      );
    }, '');
    sellList.innerHTML = categoryList;
    bidList.innerHTML = categoryList;
  }
}

init();
