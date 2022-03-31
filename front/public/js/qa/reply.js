const res = require('express/lib/response');

const replyTemp = document.querySelector('#reply').innerHTML;
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
  try {
    if (content === '') throw new Error('no contents');
    const body = { content, q_id };
    const url = 'http://localhost:4000/api/qa/reply/write';
    const response = await axios.post(url, body);
    const { record } = response.data;
    console.log(record);
    if (response.data.rows === 1 && response.status === 200) {
      const replyGroup = record.reduce((acc, cur) => {
        const temp = replyTemp
          .replace('{userAlias}', cur.userAlias)
          .replace('{date}', cur.date)
          .replace('{content}', cur.content)
          .replace('{qr_id}', cur.qr_id);
        return acc + temp;
      }, '');
      replyList.innerHTML = replyGroup;
      replyInput.value = '';
    }
  } catch (err) {
    console.log(err.message);
    alert('내용을 입력해주세요');
  }
}

const replyEditBtn = document.querySelectorAll('.reply_edit_btn');
const replyDelBtn = document.querySelectorAll('.reply_del_btn');

replyEditBtn.forEach((v) => v.addEventListener('click', updateReply));
replyDelBtn.forEach((v) => v.addEventListener('click', delReply));

async function delReply(e) {
  const qr_id = e.target.querySelector('input[type=hidden]').value;
  const url = `http://localhost:4000/api/qa/reply/delete`;
  const body = { qr_id };
  const response = await axios.post(url, body);
  const { isDeleted } = response.data;
  if (isDeleted === 1 && response.status === 200) {
    const targetReply = e.target.parentNode;
    replyList.removeChild(targetReply);
  } else {
    alert('댓글 삭제 오류, 다시 시도해주세요');
  }
}

async function updateReply(e) {
  const qr_id = e.target.querySelector('input[type=hidden]').value;
  const url = `http://localhost:4000/api/qa/reply/update`;
  const body = { qr_id };
  const response = await axios.post(url, body);
}
