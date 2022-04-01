const userEmail = document.querySelector('#userEmail');
const quitBtn = document.querySelector('#quit_btn');
quitBtn.addEventListener('click', userQuit);

console.log(userEmail);
function userQuit() {
  axios.post('http://localhost:4000/api/user/quit');
}
