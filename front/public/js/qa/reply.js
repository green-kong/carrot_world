const replyInput = document.querySelector('#reply_content');
const replyBtn = document.querySelector('#reply_btn');
const replyList = document.querySelector('.reply_list');

replyBtn.addEventListener('click', addReply);
replyInput.addEventListener('keypress', (e) => {
  if (e.keyCode === 13) {
    addReply();
  }
});

async function addReply() {
  const q_id = document.querySelector('#linkedPosting').value;
  const content = replyInput.value;
  const replyAuthor = document.querySelector('#reply_author').value;
  try {
    if (content === '') throw new Error('no contents');
    const body = { content, q_id, replyAuthor };
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
        <span>${userAlias}</span>
        <span>${date}</span>
        <div>${content}</div>
        <span class="reply_edit_btn reply_btn" data-id=${qr_id}>
          <input type="hidden" value="${qr_id}" />수정
        </span>
        <span class="reply_del_btn reply_btn" data-id=${qr_id}>
          삭제<input type="hidden" value="${qr_id}" />
        </span>`;
      replyList.appendChild(itemLi);
      replyInput.value = '';
    }
  } catch (err) {
    console.log(err.message);
    alert('내용을 입력해주세요');
  }
}

replyList.addEventListener('click', delReply);
replyList.addEventListener('click', updateReply);

async function delReply(e) {
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

async function updateReply(e) {
  const qr_id = e.target.dataset.id;
  const contentInput = e.target.querySelector('div');
  console.log(contentInput);
  // const url = `http://localhost:4000/api/qa/reply/update`;
  // const body = { qr_id };
}
