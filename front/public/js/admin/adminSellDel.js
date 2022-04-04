async function adminSellDel(e) {
  const page = window.location.search.split('=')[1];
  const { idx } = e.target.dataset;
  const url = 'http://localhost:4000/api/admin/sellDel';
  const body = { idx };

  const response = await axios.post(url, body);

  if (response.status === 200) {
    alert('해당 중고개래 판매글이 삭제 되었습니다.');
  } else {
    alert('잠시후 다시 시도해주세요');
  }
  window.location.href = `http://localhost:3000/admin/sell?page=${page}`;
}

const delBtn = document.querySelectorAll('.fa-trash-alt');

delBtn.forEach((v) => {
  v.addEventListener('click', adminSellDel);
});
