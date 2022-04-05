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

createFrm.addEventListener('submit', createCat);
