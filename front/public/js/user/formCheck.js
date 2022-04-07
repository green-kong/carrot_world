const joinForm = document.querySelector('.join_form');
const emailMsg = document.querySelector('#emailMsg');
const pwMsg = document.querySelector('#pwMsg');
const pwCheckMsg = document.querySelector('#pwCheckMsg');
const nickMsg = document.querySelector('#nickMsg');
const phoneMsg = document.querySelector('#phoneMsg');
const agreeMsg = document.querySelector('#agreeMsg');

const userEmail = joinForm.querySelector('#userEmail_join');
const userPW = joinForm.querySelector('#userPW_join');
const userPWCheck = joinForm.querySelector('#userPWCheck');
const userAlias = joinForm.querySelector('#userAlias');
const userMobile = joinForm.querySelector('#userMobile');
const agreeUse = joinForm.querySelector('#isAgree_use');
const agreePersonal = joinForm.querySelector('#isAgree_personal');

const userProfile = document.querySelector('#userProfile');
const uploadName = document.querySelector('.upload_name');

userProfile.addEventListener('change', (e) => {
  console.log(e.target.value);
  uploadName.placeholder = e.target.value;
});

joinForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const emailReg = new RegExp(
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
  );

  let signedEmail;
  let signedPw;
  let signedNick;
  let signedMobile;
  let isAgree;

  if (userEmail.value === '') {
    emailMsg.innerHTML = `필수 정보입니다.`;
    emailMsg.style.color = 'red';
  } else if (!emailReg.test(userEmail.value)) {
    emailMsg.innerHTML = `이메일 형식이 올바르지 않습니다.`;
    emailMsg.style.color = 'red';
  } else {
    const url = `http://localhost:4000/api/user/idCheck`;
    const body = { userEmail: userEmail.value };
    const response = await axios.post(url, body);
    const { isJoined, checkedEmail } = response.data;
    if (isJoined === 1) {
      emailMsg.innerHTML = `이미 가입된 이메일입니다.`;
      emailMsg.style.color = 'red';
    } else {
      emailMsg.innerHTML = `이메일 ok`;
      emailMsg.style.color = 'green';
      signedEmail = checkedEmail;
    }
  }

  const pwReg = new RegExp(
    /^(?=.*[a-zA-z])(?=.*[0-9])(?!.*[^a-zA-z0-9]).{8,20}$/
  );

  if (!pwReg.test(userPW.value)) {
    pwMsg.innerHTML = `최소 8자 이상, 하나 이상의 문자, 숫자를 입력해주세요`;
    pwMsg.style.color = 'red';
  } else {
    pwMsg.innerHTML = `비밀번호 ok`;
    pwMsg.style.color = 'green';
    let prePw = userPW.value;

    if (userPWCheck.value !== prePw) {
      pwCheckMsg.innerHTML = '비밀번호가 일치하지 않습니다.';
      pwCheckMsg.style.color = 'red';
    } else {
      pwCheckMsg.innerHTML = '비밀번호 확인 ok';
      pwCheckMsg.style.color = 'green';
      signedPw = userPWCheck.value;
    }
  }

  if (userAlias.value === '') {
    nickMsg.innerHTML = `필수 정보입니다.`;
    nickMsg.style.color = `red`;
  } else {
    nickMsg.innerHTML = `닉네임 ok`;
    nickMsg.style.color = `green`;
    signedNick = userAlias.value;
  }

  const mobileReg = new RegExp(/^010-([0-9]{4})-([0-9]{4})$/);
  if (!mobileReg.test(userMobile.value)) {
    phoneMsg.innerHTML = `핸드폰 번호가 올바르지 않습니다.`;
    phoneMsg.style.color = `red`;
  } else {
    phoneMsg.innerHTML = `핸드폰 번호 ok`;
    phoneMsg.style.color = `green`;
    signedMobile = userMobile.value;
  }

  if (agreeUse.checked && agreePersonal.checked) {
    isAgree = true;
  } else {
    agreeMsg.innerHTML = `이용약관 및 개인정보 수집에 동의해주세요`;
    agreeMsg.style.color = `red`;
  }

  if (signedEmail && signedPw && signedNick && signedMobile && isAgree) {
    const joinUrl = `http://localhost:4000/api/user/join`;

    let formData = new FormData();

    formData.append('userEmail', signedEmail);
    formData.append('userPW', signedPw);
    formData.append('userAlias', signedNick);
    formData.append('userMobile', signedMobile);
    formData.append('userProfile', userProfile.files[0]);
    const response = await axios.post(joinUrl, formData);
    const { rows } = response.data;

    if (rows === 1) {
      alert(`${signedNick}님 회원가입을 축하합니다. 로그인을 해주세요`);
      window.location.href = 'http://localhost:3000/';
    } else {
      alert(`잠시 후 다시 시도해주세요`);
      window.location.href = 'http://localhost:3000/';
    }
  }
});

const autoHyphen = (target) => {
  target.value = target.value
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
};
