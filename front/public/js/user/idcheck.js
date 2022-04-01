async function checkBtnClick() {
  const emailInput = document.querySelector('#userEmail');
  const emailMsg = document.querySelector('#emailMsg');
  const userEmail = emailInput.value;
  const url = 'http://localhost:4000/api/user/idcheck';
  const body = { userEmail };
  const response = await axios.post(url, body);
  if (response.data) {
    ('사용가능한 아이디입니다.');
  } else {
    alert('중복된 아이디 입니다.');
  }
}

export default function idcheck() {
  const checkBtn = document.querySelector('#idCheckButton');
  checkBtn.addEventListener('click', checkBtnClick);
}
