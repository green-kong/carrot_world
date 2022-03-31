const { pool } = require('./model/db/db.js');

const bidSocket = (io) => {
  const bid = io.of('/bid');

  bid.on('connection', (socket) => {
    socket.on('idx', (req) => {
      const idx = req;
      socket.join(idx);

      socket.on('disconnect', () => {
        socket.leave(idx);
      });

      socket.on('bid', async (bidData) => {
        console.log('입찰 데이터 전송 client -> server', bidData);
        const { bidPrice, userIdx } = bidData;
        const conn = await pool.getConnection();
        try {
          const updateSql = `UPDATE auction 
                            SET price=${bidPrice},bid_mem=${userIdx} 
                            WHERE au_id = ${idx} `;
          const resultSql = `SELECT userAlias, 
                            FORMAT(price, 0) AS price 
                            FROM auction
                            JOIN user
                            ON bid_mem=user.u_id
                            WHERE au_id=${idx} `;
          await conn.query(updateSql);
          const [[result]] = await conn.query(resultSql);
          bid.to(idx).emit('bidResult', result);
        } catch (err) {
          console.log(err);
        } finally {
          conn.release();
        }
      });
    });
  });
};

module.exports = bidSocket;
