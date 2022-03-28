import axios from 'axios';

const searchHandler = async () => {
  const keyword = document.querySelector('#search_input').value;
  const way = document.querySelector('#search_category').value;

  const url = 'http://localhost:4000/home/search';
  const body = { way, keyword };

  const response = await axios.post(url, body);
  if (response === 200) {
  }
};

export default async function search() {
  const searchBtn = document.querySelector('#search_btn');
  const searchInput = document.querySelector('#search_input');

  searchBtn.addEventListener('click', searchHandler);
}
