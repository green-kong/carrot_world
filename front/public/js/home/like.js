async function likeClickHandler(e) {
  const [, table, itemIdx] = window.location.hash.replace('#', '').split('/');
  const userIdx = document.querySelector('#u_id').value;

  const url = 'http://localhost:4000/api/home/like';
  const body = { table, itemIdx, userIdx };

  const response = await axios.post(url, body);
  const { likes } = response.data;

  const like = document.querySelector('#like_num');
  like.innerHTML = likes;

  const auLikeList = document.querySelector('#au_likes');
  const sLikeList = document.querySelector('#s_likes');
  let likeList =
    table === 'auction'
      ? auLikeList.value.split(',')
      : sLikeList.value.split(',');

  const { classList } = e.target.closest('.like_btn');

  const classArr = [...classList];
  if (classArr.includes('click')) {
    e.target.closest('.like_btn').classList.remove('click');
    likeList = likeList.filter((v) => v !== itemIdx);
  } else {
    e.target.closest('.like_btn').classList.add('click');
    likeList.push(itemIdx);
  }

  const likeResult = likeList.join(',');
  if (table === 'auction') {
    auLikeList.value = likeResult;
  } else {
    sLikeList.value = likeResult;
  }
}

export default async function activeLike() {
  const likeBtn = document.querySelector('.like_btn');
  likeBtn.addEventListener('click', likeClickHandler);
}
