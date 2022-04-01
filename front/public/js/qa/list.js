const pageNum = document.querySelectorAll('.page_num');
const CUR_PAGE = location.href.split('=')[1];

(() => {
  let i = (CUR_PAGE % 5) - 1;
  if (CUR_PAGE % 5 === 0) {
    i = 4;
  }
  pageNum[i].classList.add('emphasis');
})();
