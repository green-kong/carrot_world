async function contactBtnHandler() {
  const seller = document.querySelector('#author').value;
  const buyer = document.querySelector('#u_id').value;
  if (seller === buyer) {
    alert('자기 자신과의 대화라니... 많이 외로우신가요..?');
    return;
  }
  const tmpArr = [buyer, seller].sort((a, b) => a - b);

  const chatMembers = tmpArr.join(',');

  const url = 'http://localhost:4000/api/home/chat';
  const body = { chatMembers };

  const response = await axios.post(url, body);
  const { chatRoom } = response.data;

  window.location.href = `/chat#${chatRoom}`;
}

export default function contactToSeller() {
  const contactBtn = document.querySelector('.contact_btn');

  contactBtn.addEventListener('click', contactBtnHandler);
}
