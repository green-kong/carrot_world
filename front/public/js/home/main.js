async function init() {
  const url = 'http://localhost:4000/api/home/';
  const categoryList = await axios.post(url);
}

init();
