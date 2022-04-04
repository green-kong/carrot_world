const currPage = Number(window.location.search.split('=')[1]);

const prevBtn = document.querySelector('#prevPage');

function movePrevPage(table) {
  window.location.href = `http://localhost:3000/admin/${table}?page=${
    currPage - 1
  }`;
}
