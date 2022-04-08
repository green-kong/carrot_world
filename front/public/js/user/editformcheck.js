const editBtn = document.querySelector('#userUpdate');
const editFrm = document.querySelector('#edit_frm');

let pwPass = false;
let aliasPass = false;
let mobilePass = false;

function pwCheck() {
  const pw = document.querySelector('#userPW').value;
  const pwCheck = document.querySelector('#userPWCheck').value;
  const pwMsg = document.querySelector('#pwSpan');
  const pwCheckReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?!.*[^a-zA-z0-9]).{8,20}$/;

  if (pw === '') {
    pwMsg.innerHTML = '변경할 비밀번호 혹은 현재 비밀번호를 입력해주세요';
  } else if (pw !== pwCheck) {
    pwMsg.innerHTML = '비밀번호가 일치하지 않습니다.';
  } else if (!pwCheckReg.test(pw)) {
    pwMsg.innerHTML = '최소 8자 이상, 하나 이상의 문자, 숫자를 입력해주세요';
  } else {
    pwMsg.innerHTML = '';
    pwPass = true;
  }
}

function aliasCheck() {
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
  pwCheck();
  aliasCheck();
  mobileCheck();

  if (!(pwPass && aliasPass && mobilePass)) {
    e.preventDefault();
  }
}

editFrm.addEventListener('submit', submitHandler);
