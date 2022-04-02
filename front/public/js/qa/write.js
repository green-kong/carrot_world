const writeForm = document.querySelector('#write_form');

writeForm.addEventListener('submit', writeQna);

async function writeQna(e) {
  e.preventDefault();
  const { subject, content, author, u_id } = e.target;
  if (subject.value === '' || content.value === '') {
    return alert('제목 및 내용을 채워주세요');
  }
  const url = `http://localhost:4000/api/qa/write`;
  const body = {
    subject: subject.value,
    content: content.value,
    author: author.value,
    u_id: u_id.value,
  };
  const response = await axios.post(url, body, {
    withCredentials: true,
  });
  const { row } = response.data.result;
  if (row === 1) {
    const { q_id } = response.data.result;
    location.href = `/qa/view?idx=${q_id}`;
  } else {
    alert('등록 오류/다시 작성 부탁드립니다');
  }
}
