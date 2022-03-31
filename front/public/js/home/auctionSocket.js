import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

export default function auctionSocket() {
  const [, , idx] = window.location.hash.replace('#', '').split('/');
  const socket = io('http://localhost:4000/bid');
  socket.emit('idx', idx);

  const bidBtn = document.querySelector('.bid_btn');
  const priceNum = document.querySelector('#price_num');

  socket.on('bidResult', (req) => {
    const { bidPrice } = req;
    priceNum.innerHTML = bidPrice;
  });

  const clickHandler = () => {
    const bidPrice = document.querySelector('#bid_input').value;
    const userIdx = document.querySelector('#u_id').value;

    const bidData = { bidPrice, userIdx };

    socket.emit('bid', bidData);
  };

  bidBtn.addEventListener('click', clickHandler);
}
