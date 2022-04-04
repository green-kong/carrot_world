import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

let socket;

socket = io(`http://localhost:4000/chat`);

const chatRoom = window.location.href.split('#')[1];
const msgForm = document.getElementById('chat_write_form');
const uId = document.querySelector('#u_id').value;
const chatList = document.querySelector('.c_id');

socket.emit('joinRoom', chatRoom);

// if (chatList === null) {
//   console.log('no chatList');
// } else {
//   const chatData = {
//     c_id: chatList.value,
//     loginUser: uId,
//   };
//   socket.emit('chatList', chatData);
// }

// socket.on('chatList_back', (result) => {
//   console.log(result);
// });

msgForm.onsubmit = (e) => {
  e.preventDefault();
  const msgInput = document.querySelector('#text_input');
  if (msgInput.value === '') {
    return;
  }
  let msg = {
    data: msgInput.value,
    author: uId,
  };

  socket.emit('message', msg);
  msgInput.value = '';
};

socket.on('send', (latestMsg) => {
  const { dialog, u_id: author } = latestMsg;
  const msgList = document.getElementById('chat_view');
  if (Number(uId) !== Number(author)) {
    const msgWrap = document.createElement('div');
    msgWrap.setAttribute('class', 'sender_msg_wrap');
    const profileWrap = document.createElement('div');
    profileWrap.setAttribute('class', 'profile_wrap');
    const profile = document.createElement('div');
    profile.setAttribute('class', 'profile');
    const img = document.createElement('img');
    img.src = `/img/hoochu.jpg`;
    profile.appendChild(img);
    profileWrap.appendChild(profile);
    const senderMsg = document.createElement('p');
    senderMsg.setAttribute('class', 'sender_msg');
    senderMsg.innerText = dialog;
    msgWrap.append(profileWrap, senderMsg);
    msgList.appendChild(msgWrap);
  } else {
    const myMsgWrap = document.createElement('div');
    myMsgWrap.setAttribute('class', 'my_msg_wrap');
    const myMsg = document.createElement('p');
    myMsg.setAttribute('class', 'my_msg');
    myMsg.innerText = dialog;
    myMsgWrap.appendChild(myMsg);
    msgList.appendChild(myMsgWrap);
  }
  msgList.scrollTop = msgList.scrollHeight;
});

const chatGroup = document.querySelectorAll('.chat_list');
chatGroup.forEach((v) => {
  v.addEventListener('click', openChat);
});

function openChat(e) {
  const chat_id = e.target.parentNode.querySelector('.c_id').value;
  if (chat_id === undefined) {
    return;
  }
  location.href = `/chat#${chat_id}`;
}
