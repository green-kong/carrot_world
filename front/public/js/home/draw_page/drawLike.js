export default function drawLike() {
  const [, table, idx] = window.location.hash.replace('#', '').split('/');
  const likeBtn = document.querySelector('.like_btn');
  const auLikeList = document.querySelector('#au_likes').value;
  const sLikeList = document.querySelector('#s_likes').value;

  const likeList =
    table === 'auction' ? auLikeList.split(',') : sLikeList.split(',');

  if (likeList.includes(idx)) {
    likeBtn.classList.add('click');
  }
}
