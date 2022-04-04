window.onload = function () {
  const section = document.querySelectorAll('.section');
  const sectionQty = section.length;

  section.forEach((v, i) =>
    v.addEventListener('mousewheel', (e) => {
      e.preventDefault();
      let screenY = 0;
      if (e.wheelDelta) {
        screenY = e.wheelDelta;
        console.log(screenY);
      }
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
