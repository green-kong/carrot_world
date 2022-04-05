window.onload = function () {
  const section = document.querySelectorAll('.section');
  const sectionQty = section.length;

  section.forEach((v, i) =>
    v.addEventListener('mousewheel', (e) => {
      e.preventDefault();
      let screenY = 0;
      if (!e) e = window.event;
      if (e.wheelDelta) {
        screenY = e.wheelDelta;
        console.log(screenY);
      } else if (e.detail) screenY = -e.detail;
      let moveTop = window.scrollY;
      console.log(moveTop);
      let sectionNum = section[i];

      if (screenY < 0) {
        if (sectionNum !== sectionQty - 1) {
          moveTop += sectionNum.nextElementSibling.getBoundingClientRect().top;
        }
      } else {
        if (sectionNum !== 0) {
          moveTop +=
            sectionNum.previousElementSibling.getBoundingClientRect().top;
        }
      }
      window.scrollTo({ top: moveTop, left: 0, behavior: 'smooth' });
    })
  );
};

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
