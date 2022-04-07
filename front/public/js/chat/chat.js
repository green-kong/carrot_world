import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

let socket;

socket = io(`http://localhost:4000/chat`);

const chatGroup = document.querySelectorAll('.chat_link');
const msgForm = document.getElementById('chat_write_form');
const uId = document.querySelector('#u_id').value;
const msgList = document.getElementById('chat_view');

chatGroup.forEach((v) => {
  v.addEventListener('click', openChat);
});

async function openChat(e) {
  const chat_id = e.target.parentNode.querySelector('.c_id').value;
  const curChatId = window.location.hash.replace('#', '');
  const otherTemp = document.querySelector('#otherMsg').innerHTML;
  const myTemp = document.querySelector('#myMsg').innerHTML;

  try {
    socket.emit('leaveRoom', curChatId);

    window.location.hash = `${chat_id}`;
    socket.emit('joinRoom', chat_id);
    const url = `http://localhost:4000/api/chat/renderChat`;
    const body = { chat_id };
    const response = await axios.post(url, body);

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

    const prevClicked = document.querySelector('.clicked');

    const prevIndex = [...chatGroup].indexOf(prevClicked);
    console.log(prevIndex);

    if (prevIndex !== -1) {
      chatGroup[prevIndex].addEventListener('click', openChat);
    }

    chatGroup.forEach((v) => {
      v.classList.remove('clicked');
    });

    e.target.closest('.chat_link').classList.add('clicked');

    const index = [...chatGroup].indexOf(e.target.closest('.chat_link'));
    chatGroup[index].removeEventListener('click', openChat);
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
  const { c_id, dialog, u_id: author, u_img } = latestMsg;
  const msgList = document.getElementById('chat_view');
  if (Number(uId) !== Number(author)) {
    makeMsg(u_img, dialog);
  } else {
    makeMyMsg(dialog);
  }
  msgList.scrollTop = msgList.scrollHeight;
});

socket.on('update', (latestMsg) => {
  const msgOnList = document.querySelectorAll('.msg');
  const dateOnList = document.querySelectorAll('.date');
  const { c_id, dialog, date } = latestMsg;
  const latestYear = new Date(date).getFullYear();
  const latestDate = new Date(date).getDate();
  const latestMonth = new Date(date).getMonth();

  let dateForRender;
  if (
    latestYear === new Date().getFullYear() &&
    latestMonth === new Date().getMonth() &&
    latestDate === new Date().getDate()
  ) {
    dateForRender = date.split(' ')[1].substr(0, 5);
  } else {
    dateForRender = date.split(' ')[0].substr(2, 8);
  }

  msgOnList.forEach((v) => {
    if (Number(v.previousElementSibling.value) === c_id) {
      v.innerHTML = dialog;
    }
  });
  dateOnList.forEach((v) => {
    if (
      Number(v.previousElementSibling.previousElementSibling.value) === c_id
    ) {
      v.innerHTML = dateForRender;
    }
  });
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
