const userEmail = document.querySelector('#userEmail').value;

const quitBtn = document.querySelector('#quit_btn');
quitBtn.addEventListener('click', userQuit);

async function userQuit() {
  const url = 'http://localhost:4000/api/user/quit';
  const body = { userEmail };
  const response = await axios.post(url, body);
  if (response.status !== 200) {
    alert('잠시 후에 다시 시도해주세요');
    return;
  } else {
    alert('회원탈퇴가 완료되었습니다.');
    window.location.href = 'http://localhost:3000/user/logout';
  }
}
