import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';

let socket;

export default function auctionSocket() {
  console.log('hash changed');
  const [view, auction, idx] = window.location.hash.replace('#', '').split('/');
  if (view !== 'view' || auction !== 'auction') {
    return;
  }
  socket = io('http://localhost:4000/bid');
  socket.on('connect', () => {
    console.log('client socket 연결', socket.id);
  });

  socket.emit('idx', idx);

  socket.on('bidResult', (req) => {
    const { userAlias, price } = req;
    console.log(req);
    const priceSpan = document.querySelector('.price_num');
    const bidName = document.querySelector('.bid_name');
    bidName.innerHTML = userAlias;
    priceSpan.innerHTML = price;
  });
}

export const clickHandler = () => {
  const bidPrice = document.querySelector('.bid_input').value;
  const userIdx = document.querySelector('#u_id').value;

  const bidData = { bidPrice, userIdx };

  socket.emit('bid', bidData);
};
