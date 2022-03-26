import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

const socket = io('http://localhost:4000/');

const bidBtn = document.querySelector('#bid_btn');
const priceNum = document.querySelector('#price_num');

socket.on('auctionSrv', (req) => {
  const { bidPrice } = req;
  priceNum.innerHTML = bidPrice;
});

const clickHandler = () => {
  const bidPrice = document.querySelector('#bid_price').value;

  socket.emit('auction', { bidPrice });
};

bidBtn.addEventListener('click', clickHandler);
