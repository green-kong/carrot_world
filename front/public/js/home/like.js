function likeClickHandler() {
  console.log('like btn!!');
}

export default async function activeLike() {
  const likeBtn = document.querySelector('.like_btn');
  likeBtn.addEventListener('click', likeClickHandler);
}
