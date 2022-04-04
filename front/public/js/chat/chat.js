import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

let socket;

socket = io(`http://localhost:4000/chat`);

const chatGroup = document.querySelectorAll('.chat_list');
const msgForm = document.getElementById('chat_write_form');
const uId = document.querySelector('#u_id').value;
const msgList = document.getElementById('chat_view');

chatGroup.forEach((v) => {
  v.addEventListener('click', openChat);
});

async function openChat(e) {
  const chat_id = e.target.parentNode.querySelector('.c_id').value;
  const otherTemp = document.querySelector('#otherMsg').innerHTML;
  const myTemp = document.querySelector('#myMsg').innerHTML;
  try {
    window.location.hash = `${chat_id}`;
    socket.emit('joinRoom', chat_id);
    const url = `http://localhost:4000/api/chat/renderChat`;
    const body = { chat_id };
    const response = await axios.post(url, body);
    console.log(response.data);

    const msg = response.data.reduce((acc, cur) => {
      if (Number(uId) !== cur.u_id) {
        return (
          acc +
          otherTemp.replace('{img}', cur.u_img).replace('{dialog}', cur.dialog)
        );
      } else {
        return acc + myTemp.replace('{dialog}', cur.dialog);
      }
    }, '');
    msgList.innerHTML = msg;
    msgList.scrollTop = msgList.scrollHeight;
  } catch (err) {
    console.log(err.message);
  }
}

msgForm.onsubmit = (e) => {
  e.preventDefault();
  const msgInput = document.querySelector('#text_input');
  if (msgInput.value === '') {
    return;
  }
  let msg = {
    data: msgInput.value,
    author: uId,
    c_id: window.location.href.split('#')[1],
  };

  socket.emit('message', msg);
  msgInput.value = '';
};

socket.on('send', (latestMsg) => {
  const { dialog, u_id: author, u_img } = latestMsg;
  const msgList = document.getElementById('chat_view');
  if (Number(uId) !== Number(author)) {
    makeMsg(u_img, dialog);
  } else {
    makeMyMsg(dialog);
  }
  msgList.scrollTop = msgList.scrollHeight;
});

function makeMsg(u_img, dialog) {
  const msgWrap = document.createElement('div');
  msgWrap.setAttribute('class', 'sender_msg_wrap');
  const profileWrap = document.createElement('div');
  profileWrap.setAttribute('class', 'profile_wrap');
  const profile = document.createElement('div');
  profile.setAttribute('class', 'profile');
  const img = document.createElement('img');
  img.src = u_img;
  profile.appendChild(img);
  profileWrap.appendChild(profile);
  const senderMsg = document.createElement('p');
  senderMsg.setAttribute('class', 'sender_msg');
  senderMsg.innerText = dialog;
  msgWrap.append(profileWrap, senderMsg);
  return msgList.appendChild(msgWrap);
}

function makeMyMsg(dialog) {
  const myMsgWrap = document.createElement('div');
  myMsgWrap.setAttribute('class', 'my_msg_wrap');
  const myMsg = document.createElement('p');
  myMsg.setAttribute('class', 'my_msg');
  myMsg.innerText = dialog;
  myMsgWrap.appendChild(myMsg);
  return msgList.appendChild(myMsgWrap);
}
