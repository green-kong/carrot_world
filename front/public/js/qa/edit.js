const editForm = document.querySelector('#write_form');

async function editPost(e) {
  e.preventDefault();
  const { q_id, subject, content } = e.target;
  const url = `http://localhost:4000/api/qa/editPost`;
  const body = {
    q_id: q_id.value,
    subject: subject.value,
    content: content.value,
  };
  const response = await axios.post(url, body, {
    withCredentials: true,
  });
  if (response.data.changedRows === 1) {
    location.href = `/qa/view?idx=${q_id.value}`;
  } else {
    alert('수정 오류/다시 작성 부탁드립니다');
  }
}

editForm.addEventListener('submit', editPost);
