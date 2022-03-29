import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

let socket;

function init() {
  const url = 'http://localhost:4000';
  socket = io.connect(url, {
    cors: { origin: '*' },
  });

  console.log(socket);

  socket.on('message', (msg) => {
    const msgList = document.getElementById('chat_view');
    const msgWrap = document.createElement('div');
    msgWrap.setAttribute('class', 'sender_msg_wrap');
    const profileWrap = document.createElement('div');
    profileWrap.setAttribute('class', 'profile_wrap');
    const profile = document.createElement('div');
    profile.setAttribute('class', 'profile');
    const img = document.createElement('img');
    img.src = '/img/hoochu.jpg';
    profile.appendChild(img);
    profileWrap.appendChild(profile);

    const senderMsg = document.createElement('p');
    senderMsg.setAttribute('class', 'sender_msg');
    senderMsg.innerText = msg;
    msgWrap.append(profileWrap, senderMsg);
    msgList.appendChild(msgWrap);
  });

  socket.on('send', (msg) => {
    const myMsgWrap = document.createElement('div');
    myMsgWrap.setAttribute('class', 'my_msg_wrap');
    const myMsg = document.createElement('p');
    myMsg.setAttribute('class', 'my_msg');
    myMsg.innerText = msg;
    myMsgWrap.appendChild(myMsg);
  });

  const msgForm = document.getElementById('chat_write_form');
  msgForm.onsubmit = (e) => {
    e.preventDefault();
    const msgInput = document.querySelector('#text_input');
    socket.emit('message', msgInput.value);
    msgInput.value = '';
  };

  const chatList = document.querySelectorAll('.chat_link');
  chatList.forEach((v) => {
    v.addEventListener('click', openChat);
  });
}

// 채팅 리스트 눌렀을 때 axios로 우측에 뜨게 만들어야함
async function openChat(e) {
  if (e.target.className === 'name') {
    let id = e.target.innerHTML;
    const url = `http://localhost:4000/api/chat`;
    const chatInfo = {};
    const response = await axios.post(url, chatInfo, {
      withCredentials: true,
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
