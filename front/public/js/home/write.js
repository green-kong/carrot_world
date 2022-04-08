const writeFrm = document.querySelector('#write_form');
const imgUploadBox = document.querySelector('#img_upload_box');
const preview = document.querySelectorAll('.preview_img');

let file;

function writeFormCheck(e) {
  const subject = document.querySelector('#subject').value;
  const dealPrice = document.querySelector('#deal_price').value;

  if (subject === '') {
    e.preventDefault();
    alert('제목을 입력해주세요.');
  }

  if (isNaN(dealPrice)) {
    e.preventDefault();
    alert('가격에는 숫자만 입력 가능합니다.');
  }
}

function makeThumbnail(input) {
  const data = input ? input.files : file;

  for (let i = 0; i < preview.length; i++) {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      const fileURL = fileReader.result;
      const imgTag = `<img src=${fileURL}>`;
      preview[i].innerHTML = imgTag;
    };
    if (data[i] !== undefined) {
      fileReader.readAsDataURL(data[i]);
    } else {
      preview[i].innerHTML = '미리보기';
    }
  }
}

function uploadDragenter() {}

function uploadDragover(e) {
  e.preventDefault();
  imgUploadBox.classList.add('green');
}

function uploadDragleave() {
  imgUploadBox.classList.remove('green');
}

function uploadValidation(file) {
  if (file.length > 5) {
    alert('이미지 첨부는 5개까지 가능합니다.');
    return false;
  }

  for (let i = 0; i < file.length; i++) {
    const extList = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!extList.includes(file[i].type)) {
      alert('jpg/png/jpeg 만 첨부 가능합니다.');
      return false;
    }
  }
  return true;
}

function uploadDrop(e) {
  e.preventDefault();
  imgUploadBox.classList.remove('green');
  file = e.dataTransfer.files;

  if (!uploadValidation(file)) return;

  makeThumbnail();

  document.getElementById('img_upload_btn').files = file;
}

writeFrm.addEventListener('submit', writeFormCheck);
imgUploadBox.addEventListener('dragenter', uploadDragenter);
imgUploadBox.addEventListener('dragover', uploadDragover);
imgUploadBox.addEventListener('dragleave', uploadDragleave);
imgUploadBox.addEventListener('drop', uploadDrop);

// deal_way sel/opt value 변경시 동작 함수
function checkDealWay() {
  const dealWay = document.querySelector('#deal_way').value;
  const dealDateWrap = document.querySelector('#deal_date_wrap');
  const dealTimeWrap = document.querySelector('#deal_time_wrap');

  if (dealWay === 'bid') {
    dealDateWrap.classList.add('bidon');
    dealTimeWrap.classList.add('bidon');
  }

  if (dealWay === 'sell') {
    dealDateWrap.classList.remove('bidon');
    dealTimeWrap.classList.remove('bidon');
  }
}
