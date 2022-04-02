const replyInput = document.querySelector('#reply_content');
const replyBtn = document.querySelector('#reply_btn');
const replyList = document.querySelector('.reply_list');

replyBtn.addEventListener('click', addReply);
replyInput.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    addReply();
  }
});

async function addReply(e) {
  const u_id = document.querySelector('#u_id').value;
  const q_id = document.querySelector('#linkedPosting').value;
  const content = replyInput.value;
  try {
    if (content === '') throw new Error('no contents');
    const body = { content, q_id, u_id };
    const url = 'http://localhost:4000/api/qa/reply/write';
    const response = await axios.post(url, body);
    const { record } = response.data;
    const latest = record[record.length - 1];
    const { qr_id, date, userAlias } = latest;
    console.log(latest);
    if (response.data.rows === 1 && response.status === 200) {
      const itemLi = document.createElement('li');
      itemLi.setAttribute('data-id', qr_id);
      itemLi.innerHTML = ` 
        <span class="user_alias">${userAlias}</span>
        <span class="reply_date">${date}</span>
        <div>${content}</div>
        <span class="reply_edit_btn reply_btn" data-id=${qr_id}>
        수정<input type="hidden" value="${qr_id}" />
        </span>
        <span class="reply_del_btn reply_btn" data-id=${qr_id}>
          삭제<input type="hidden" value="${qr_id}" />
        </span>`;
      replyList.appendChild(itemLi);
      replyInput.value = '';
      itemLi.scrollIntoView({ behavior: 'smooth' });
    }
  } catch (err) {
    console.log(err.message);
    alert('내용을 입력해주세요');
  }
}

replyList.addEventListener('click', (e) => {
  switch (e.target.innerText) {
    case '삭제':
      delReply(e);
      break;
    case '수정 ':
      makeBlank(e);
      break;
    case '수정완료':
      updateReply(e);
      break;
    default:
      return;
  }
});

async function delReply(e) {
  const loginUser = document.querySelector('#reply_author').value;
  const replyAuth = e.target.parentNode.querySelector('.user_alias').innerText;
  if (loginUser !== replyAuth)
    return alert('해당 댓글 작성자만 삭제가 가능합니다.');
  const qr_id = e.target.dataset.id;
  const url = `http://localhost:4000/api/qa/reply/delete`;
  const body = { qr_id };
  const response = await axios.post(url, body);
  const { isDeleted } = response.data;
  if (isDeleted === 1 && response.status === 200) {
    const deleteItem = document.querySelector(`li[data-id='${qr_id}']`);
    deleteItem.remove();
  } else {
    alert('댓글 삭제 오류, 다시 시도해주세요');
  }
}

async function makeBlank(e) {
  const loginUser = document.querySelector('#reply_author').value;
  const replyAuth = e.target.parentNode.querySelector('.user_alias').innerText;
  if (loginUser !== replyAuth)
    return alert('해당 댓글 작성자만 수정이 가능합니다.');

  const replyInput = e.target.parentNode.querySelector('div');
  replyInput.innerHTML = `<textarea name="replyContent" id="reply_content" cols="30" rows="10" maxlength="120"></textarea>`;
  e.target.innerText = '수정완료';
}

async function updateReply(e) {
  const qr_id = e.target.dataset.id;
  const textArea = e.target.parentNode.querySelector('#reply_content');
  const changedReply = textArea.value;
  if (changedReply === '') {
    alert('내용을 입력해주세요');
    return;
  }
  const url = `http://localhost:4000/api/qa/reply/update`;
  const body = { qr_id, changedReply };
  const response = await axios.post(url, body);
  const { isUpdated } = response.data;
  if (isUpdated === 1 && response.status === 200) {
    const { content, date } = response.data.changedData;
    textArea.parentNode.innerText = `${content}`;
    textArea.remove();
    e.target.innerText = '수정 ';
    const newDate = e.target.parentNode.querySelector('.reply_date');
    newDate.innerText = `${date}`;
  }
}
