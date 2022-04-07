const { pool } = require('./model/db/db.js');

const chatSocket = (io) => {
  const chat = io.of('/chat');
  let c_id;

  chat.on('connection', (socket) => {
    socket.on('disconnect', () => {
      console.log(c_id, '번 방 나감');
      socket.leave(c_id);
    });

    socket.on('message', async (msg) => {
      console.log('message received:', msg);
      const { author, data, c_id: chatId } = msg;
      const conn = await pool.getConnection();
      const validSql = `SELECT mem1, mem2 FROM chat WHERE c_id = ${chatId}`;
      const [[isValid]] = await conn.query(validSql);
      if (isValid.mem1 === Number(author) || isValid.mem2 === Number(author)) {
        const chatLogSql = `INSERT INTO chat_log(c_id, u_id, dialog, date) VALUES(${chatId}, ${author},'${data}', now())`;
        const chatUpdateSql = `UPDATE chat SET lastDate = now(), lastMsg = '${data}' WHERE c_id = ${chatId}`;
        const bringSql = `SELECT c.c_id, c.u_id, u.u_img, c.dialog, DATE_FORMAT(c.date, '%Y-%m-%d %H:%i:%s') as date FROM chat_log c JOIN user u ON u.u_id = c.u_id WHERE c_id = ${chatId} ORDER BY date DESC LIMIT 1`;
        try {
          await conn.query(chatLogSql);
          await conn.execute(chatUpdateSql);
          const [result] = await conn.query(bringSql);
          const latestMsg = await result[result.length - 1];
          console.log('가장 최근 메시지', latestMsg);
          chat.to(chatId).emit('send', latestMsg);
          chat.emit('update', latestMsg);
        } catch (err) {
          console.log(err);
        } finally {
          conn.release();
        }
      } else {
        let errMsg = `해당 채팅방 권한이 없습니다.`;
        chat.emit('notValid', errMsg);
      }
    });

    socket.on('leaveRoom', (curChatId) => {
      socket.leave(curChatId);
      console.log('소켓룸즈', socket.rooms);
      console.log(curChatId, '방 나감');
    });

    socket.on('joinRoom', (chatRoom) => {
      c_id = chatRoom;
      socket.join(c_id);
      console.log(c_id, '번 방 참여');
    });
  });

  // const closeCb = () => {
  //   console.log('채팅나감');
  // };

  // chat.on('disconnect', closeCb);
};

module.exports = chatSocket;
