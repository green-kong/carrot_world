const section = document.querySelectorAll('.section');
const sectionQty = section.length;

let isWheelActive = false;

section.forEach((v, i) =>
  v.addEventListener(
    'mousewheel',
    (e) => {
      e.preventDefault();

      if (isWheelActive) return;

      isWheelActive = true;

      let delta = 0;
      if (e.wheelDelta) {
        delta = e.wheelDelta / 130;
        console.log('휠무브', delta);
      } else if (e.detail) delta = -e.detail / 3;

      let moveTop = window.scrollY;
      let sectionNum = section[i];

      // 내려갈때
      if (delta < 0) {
        // 마지막 섹션전까지
        if (sectionNum !== section[sectionQty - 2]) {
          moveTop += sectionNum.nextElementSibling.getBoundingClientRect().top;
        } else if (section[sectionQty - 2]) {
          // 로긴 페이지에서 더 안내려가게 막아주기
          moveTop +=
            sectionNum.previousElementSibling.getBoundingClientRect().top;
        } else {
          return;
        }
        console.log('얼마나 수직으로 스크롤됐나', moveTop);

        // 올라갈때
      } else {
        if (sectionNum !== 0) {
          // 첫번째 섹션 빼고
          moveTop +=
            sectionNum.previousElementSibling.getBoundingClientRect().top;
        }
        console.log('얼마나 수직으로 스크롤됐나', moveTop);
      }
      window.scrollTo({ top: moveTop, left: 0, behavior: 'smooth' });

      setTimeout(() => {
        isWheelActive = false;
      }, 1400);
    },
    { passive: false }
  )
);

const goLoginBtn = document.querySelector('#goLogin');
const goJoinBtn = document.querySelector('#goJoin');
const joinTag = document.querySelector('.join_tag');

const loginPage = document.querySelector('#section5');
const joinPage = document.querySelector('#section6');

const joinPosition = window.pageYOffset + joinPage.getBoundingClientRect().top;

const loginPosition =
  window.pageYOffset + loginPage.getBoundingClientRect().top;

goLoginBtn.addEventListener('click', () => {
  window.scrollTo({ top: loginPosition, left: 0, behavior: 'smooth' });
});

goJoinBtn.addEventListener('click', () => {
  window.scrollTo({ top: joinPosition, left: 0, behavior: 'smooth' });
});

joinTag.addEventListener('click', () => {
  window.scrollTo({ top: joinPosition, left: 0, behavior: 'smooth' });
});

const $textAni = document.createElement('span');
$textAni.classList.add('title-keyword');

document.querySelector('.title').appendChild($textAni);

const TextType = function () {
  this.toRotate = ['SELL', 'BUY', 'BID'];
  this.el = $textAni;
  this.loopNum = 0;
  this.txt = '';
  this.isDeleting = false;
  this.tick();
};

TextType.prototype.tick = function () {
  const i = this.loopNum % this.toRotate.length;
  const fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.textContent = this.txt;

  let delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    this.isDeleting = true;
    delta = 2000;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    delta = 500;
    this.loopNum++;
  }

  setTimeout(() => {
    this.tick();
  }, delta);
};

new TextType();
