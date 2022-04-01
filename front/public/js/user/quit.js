const userEmail = document.querySelector('#userEmail').value;

const quitBtn = document.querySelector('#quit_btn');
quitBtn.addEventListener('click', userQuit);

async function userQuit() {
  const url = 'http://localhost:4000/api/user/quit';
  const body = { userEmail };
  const response = await axios.post(url, body);
}
