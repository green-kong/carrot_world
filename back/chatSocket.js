const { pool } = require('./model/db/db.js');

const chatSocket = (io) => {
  const chat = io.of('/chat');

  chat.on('connection', (socket) => {
    socket.on('joinRoom', (chatRoom) => {
      const c_id = chatRoom;
      socket.join(c_id);
      console.log(c_id, '번 방 참여');

      socket.on('leaveRoom', (curChatId) => {
        socket.leave(curChatId);
        console.log(curChatId, '방 나감');
      });

      socket.on('message', async (msg) => {
        console.log('message received:', msg);
        const { author, data, c_id } = msg;
        const conn = await pool.getConnection();
        const chatLogSql = `INSERT INTO chat_log(c_id, u_id, dialog, date) 
                          VALUES(${c_id}, ${author},'${data}', now())`;
        const chatUpdateSql = `UPDATE chat 
                              SET lastDate = now(), lastMsg = '${data}' 
                              WHERE c_id = ${c_id}`;
        const bringSql = `SELECT c.c_id, c.u_id, u.u_img, c.dialog, c.date 
                          FROM chat_log c 
                          JOIN user u 
                          ON u.u_id = c.u_id 
                          WHERE c_id = ${c_id}
                          ORDER BY date DESC LIMIT 1`;
        try {
          await conn.query(chatLogSql);
          await conn.execute(chatUpdateSql);
          const [result] = await conn.query(bringSql);
          const latestMsg = await result[result.length - 1];
          console.log('가장 최근 메시지', latestMsg);
          chat.to(c_id).emit('send', latestMsg);
          chat.emit('update', latestMsg);
        } catch (err) {
          console.log(err);
        } finally {
          conn.release();
        }
      });
      socket.on('disconnect', () => {
        console.log(c_id, '번 방 나감');
        socket.leave(c_id);
      });
    });
  });

  // const closeCb = () => {
  //   console.log('채팅나감');
  // };

  // socket.on('disconnect', closeCb);
};

module.exports = chatSocket;
