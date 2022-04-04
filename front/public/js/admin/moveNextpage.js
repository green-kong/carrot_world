const curPage = Number(window.location.search.split('=')[1]);

const nextBtn = document.querySelector('#nextPage');

function moveNextPage(table) {
  window.location.href = `http://localhost:3000/admin/${table}?page=${
    curPage + 1
  }`;
}
