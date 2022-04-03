const currPage = Number(window.location.search.split('=')[1]);

const prevBtn = document.querySelector('#prevPage');

prevBtn.addEventListener('click', () => {
  window.location.href = `http://localhost:3000/admin/sell?page=${
    currPage - 1
  }`;
});
