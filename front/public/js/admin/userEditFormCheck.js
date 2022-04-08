const editFrm = document.querySelector('#edit_frm');

let aliasPass = false;
let mobilePass = false;

function aliasCheck() {
  console.log('check');
  const alias = document.querySelector('#userAlias').value;
  const aliasMsg = document.querySelector('#aliasSpan');
  if (alias === '') {
    aliasMsg.innerHTML = '닉네임을 입력해주세요';
  } else {
    aliasMsg.innerHTML = '';
    aliasPass = true;
  }
}

function mobileCheck() {
  const mobile = document.querySelector('#userMobile').value;
  const mobileMsg = document.querySelector('#mobileSpan');
  const mobileReg = /^010-([0-9]{4})-([0-9]{4})$/;
  console.log(mobileReg.test(mobile));

  if (mobile === '') {
    mobileMsg.innerHTML = '핸드폰 번호를 입력해 주세요';
  } else if (!mobileReg.test(mobile)) {
    mobileMsg.innerHTML = '올바른 핸드폰 번호를 입력해주세요';
  } else {
    mobileMsg.innerHTML = '';
    mobilePass = true;
  }
}

function submitHandler(e) {
  aliasCheck();
  mobileCheck();

  if (!(aliasPass && mobilePass)) {
    e.preventDefault();
  }
}

editFrm.addEventListener('submit', submitHandler);
