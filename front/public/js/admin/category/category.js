const createFrm = document.querySelector('#create_cat');
const changeFrm = document.querySelector('#change_cat');
const editFrm = document.querySelector('#edit_cat');
const delFrm = document.querySelector('#del_cat');

async function createCat(e) {
  e.preventDefault();

  const code = document.querySelector('#create_c_code');
  const name = document.querySelector('#create_c_name');

  if (code.value === '' || name.value === '') {
    alert('내용을 입력해주세요');
    return;
  }

  const url = 'http://localhost:4000/api/admin/createCat';
  const body = { code: code.value, name: name.value };

  const response = await axios.post(url, body);
  console.log(response);
  if (response.status === 200) {
    alert(
      `카테고리가 추가 되었습니다. c_code : ${code.value}, 카테고리이름 : ${name.value} `
    );
    window.location.href = 'http://localhost:3000/admin/statistics';
  } else {
    alert(response.data);
  }
}

async function delCat(e) {
  e.preventDefault();

  const name = e.target.querySelector('#del_c_name');

  const url = 'http://localhost:4000/api/admin/delCat';
  const body = { code: name.value };

  const response = await axios.post(url, body);

  if (response.status === 200) {
    alert(`${name.value} 카테고리가 삭제 되었습니다.`);
    window.location.href = 'http://localhost:3000/admin/statistics';
  } else {
    alert(response.data);
  }
}

async function editCat(e) {
  e.preventDefault();

  const code = e.target.querySelector('#edit_c_code');
  const name = e.target.querySelector('#edit_c_name');

  if (name.value === '') {
    alert('내용을 입력해주세요');
    return;
  }

  const url = 'http://localhost:4000/api/admin/editCat';
  const body = { code: code.value, name: name.value };

  const response = await axios.post(url, body);

  if (response.status === 200) {
    alert(`카테고리 이름이 ${name.value}(으)로 변경 되었습니다.`);
    window.location.href = 'http://localhost:3000/admin/statistics';
  } else {
    alert(response.data);
  }
}

async function changeCat(e) {
  e.preventDefault();

  const prevCode = e.target.querySelector('#origin_cat').value;
  const newCode = e.target.querySelector('#changed_cat').value;

  const prevName = e.target.querySelector('#origin_cat>option:checked').text;

  const changedName = e.target.querySelector(
    '#changed_cat>option:checked'
  ).text;

  console.log(prevName, changedName);

  const url = 'http://localhost:4000/api/admin/changeCat';
  const body = { prevCode, newCode };

  const response = await axios.post(url, body);
  if (response.status === 200) {
    alert(`${prevName}에 있던 모든 게시글이 ${changedName}으로 옮겨졌습니다.`);
    window.location.href = 'http://localhost:3000/admin/statistics';
  } else {
    alert('잠시 후에 다시 시도해주세요');
  }
}

createFrm.addEventListener('submit', createCat);
delFrm.addEventListener('submit', delCat);
editFrm.addEventListener('submit', editCat);
changeFrm.addEventListener('submit', changeCat);
