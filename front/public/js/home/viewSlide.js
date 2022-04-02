let totalImg;
let CUR_PAGE = 1;

function slideImg(num) {
  const imgWrap = document.querySelector('#prod_img_list');
  const imgList = document.querySelector('.prod_img');
  const imgWidth = imgList.getBoundingClientRect().width;

  imgWrap.style.transform = `translateX(${-imgWidth * (num - 1)}px)`;
}

function movePrev() {
  if (CUR_PAGE === 1) {
    console.log('return');
    return;
  }

  CUR_PAGE -= 1;
  slideImg(CUR_PAGE);
}
function moveNext() {
  if (CUR_PAGE === totalImg) {
    console.log('return');
    return;
  }

  CUR_PAGE += 1;
  slideImg(CUR_PAGE);
}

export default function viewSlide() {
  totalImg = document.querySelectorAll('.prod_img').length;
  const prevBtn = document.querySelector('#left_btn');
  const nxtBtn = document.querySelector('#right_btn');

  prevBtn.addEventListener('click', movePrev);
  nxtBtn.addEventListener('click', moveNext);
}
