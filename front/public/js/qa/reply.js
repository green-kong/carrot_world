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
    if (response.data.rows === 1 && response.status === 200) {
      const replyGroup = record.reduce((acc, cur) => {
        const temp = replyTemp
          .replace('{userAlias}', cur.userAlias)
          .replace('{date}', cur.date)
          .replace('{content}', cur.content);
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
