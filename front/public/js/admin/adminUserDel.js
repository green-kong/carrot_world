async function adminUserDel(e) {
  const page = window.location.search.split('=')[1];
  const { idx } = e.target.dataset;
  const url = 'http://localhost:4000/api/admin/userDel';
  const body = { idx };

  const response = await axios.post(url, body);

  if (response.status === 200) {
    alert('해당 회원을 탈퇴 시켰습니다.');
  } else {
    alert('잠시후 다시 시도해주세요');
  }
  window.location.href = `http://localhost:3000/admin/user?page=${page}`;
}

const delBtn = document.querySelectorAll('.fa-trash-alt');

delBtn.forEach((v) => {
  v.addEventListener('click', adminUserDel);
});
