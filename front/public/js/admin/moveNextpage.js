const curPage = Number(window.location.search.split('=')[1]);

const nextBtn = document.querySelector('#nextPage');

nextBtn.addEventListener('click', () => {
  window.location.href = `http://localhost:3000/admin/sell?page=${curPage + 1}`;
});
