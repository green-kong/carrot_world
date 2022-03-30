async function likeClickHandler() {
  const [, table, itemIdx] = window.location.hash.replace('#', '').split('/');
  const userIdx = document.querySelector('#u_id').value;

  const url = 'http://localhost:4000/api/home/like';
  const body = { table, itemIdx, userIdx };

  const response = axios.post(url, body);
}

export default async function activeLike() {
  const likeBtn = document.querySelector('.like_btn');
  likeBtn.addEventListener('click', likeClickHandler);
}
