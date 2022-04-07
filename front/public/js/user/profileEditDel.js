export default function btnActive() {
  const isSoldBtn = document.querySelectorAll('.isSoldBtn');
  const delBtn = document.querySelectorAll('.delBtn');

  async function isSoldClick(e) {
    const { idx, table } = e.target.dataset;
    const value = e.target.parentNode.querySelector('select').value;

    const url = 'http://localhost:4000/api/home/edit';
    const body = { idx, table, value };

    const response = await axios.post(url, body);

    if (response.status === 200) {
      alert('해당 글의 판매상태가 변경 되었습니다.');
    } else {
      alert('잠시 후에 다시 시도해주세요');
    }
    window.location.href = 'http://localhost:3000/user/profile';
  }

  async function delClick(e) {
    const { idx, table } = e.target.dataset;

    const url = 'http://localhost:4000/api/home/del';
    const body = { idx, table };

    const response = await axios.post(url, body);

    if (response.status === 200) {
      alert('해당글이 삭제 되었습니다.');
    } else {
      alert('잠시후에 다시 시도해 주세요');
    }
    window.location.href = 'http://localhost:3000/user/profile';
  }

  if (isSoldBtn.length !== 0) {
    isSoldBtn.forEach((v) => {
      console.log('hello');

      v.addEventListener('click', isSoldClick);
    });
  }

  if (delBtn.length !== 0) {
    delBtn.forEach((v) => {
      v.addEventListener('click', delClick);
    });
  }
}
