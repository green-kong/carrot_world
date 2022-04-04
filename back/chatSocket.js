const { pool } = require('./model/db/db.js');

const chatSocket = (io) => {
  const chat = io.of('/chat');

  const connectCb = (socket) => {
    socket.on('joinRoom', (chatRoom) => {
      const c_id = chatRoom;
      socket.join(c_id);

      socket.on('disconnect', () => {
        socket.leave(c_id);
      });

      socket.on('message', async (msg) => {
        console.log('message received:', msg);
        const { author, data } = msg;
        const conn = await pool.getConnection();
        const recordSql = `INSERT INTO chat_log(c_id, u_id, dialog, date) 
                          VALUES(${c_id}, ${author}, '${data}', now())`;
        const bringSql = `SELECT *
                          FROM chat_log
                          WHERE c_id = ${c_id}
                          ORDER BY date ASC `;
        await conn.query(recordSql);
        const [result] = await conn.query(bringSql);
        const latestMsg = await result[result.length - 1];
        chat.to(c_id).emit('send', latestMsg);
      });
    });

    // socket.on('chatList', async (chatData) => {
    //   const { c_id, loginUser } = chatData;
    //   console.log(chatData);
    //   const chatList = c_id.split(',');
    //   const conn = await pool.getConnection();
    //   try {
    //     let chatLog = [];
    //     for (let i = 0; i < chatList.length; i++) {
    //       const sql = `SELECT c.c_id, (SELECT userAlias From user WHERE u_id = cl.u_id) as userAlias, cl.dialog, DATE_FORMAT(cl.date, '%m-%d %H:%i:%s') as date FROM chat c JOIN chat_log cl ON c.c_id = cl.c_id WHERE c.c_id=${chatList[i]} ORDER BY date DESC LIMIT 1 `;
    //       const [[result]] = await conn.query(sql);
    //       console.log(result);
    //       chatLog.push(result);
    //     }
    //     console.log(chatLog);

    //     chat.emit('chatList_back', chatLog);
    //   } catch (err) {
    //     console.log(err.message);
    //   } finally {
    //     conn.release();
    //   }
    // });
  };

  // const closeCb = () => {
  //   console.log('채팅나감');
  // };

  // socket.on('disconnect', closeCb);

  chat.on('connection', connectCb);
};

module.exports = chatSocket;
