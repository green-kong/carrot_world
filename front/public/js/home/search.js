function searchHandler() {
  const keyword = document.querySelector('#search_input').value;
  const way = document.querySelector('#search_category').value;
  window.location.hash = `search/${way}/${keyword}`;
}

export default async function searchEvent() {
  const searchBtn = document.querySelector('#search_btn');
  const searchInput = document.querySelector('#search_input');

  searchBtn.addEventListener('click', searchHandler);
  searchInput.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
      searchHandler();
    }
  });
}
