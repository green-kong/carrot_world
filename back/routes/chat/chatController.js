const { pool } = require('../../model/db/db.js');

exports.chat = async (req, res) => {
  const { u_id, userAlias, u_img, chatResult } = req.body;
  console.log(u_id, userAlias, u_img, chatResult);
  const conn = await pool.getConnection();
  try {
    const bringSql = `SELECT ANY_VALUE(chat.c_id), ANY_VALUE(chat.mem1), ANY_VALUE(chat.mem2), 
                      ANY_VALUE(u1.userAlias) AS mem1Alias, 
                      ANY_VALUE(u2.userAlias) AS mem2Alias, 
                      ANY_VALUE(c1.date) AS mem1date, 
                      (SELECT date FROM chat_log WHERE c_id )
                      
                      FROM 
                        (SELECT c_id, 
                          SUBSTRING_INDEX(members,',',1) AS mem1, 
                          SUBSTRING_INDEX(members,',',-1) AS mem2 
                          FROM chat) chat
                      JOIN user u1 
                      ON mem1 = u1.u_id 
                      JOIN user u2 
                      ON mem2 = u2.u_id 
                      WHERE chat.c_id IN (1,2,3)
                          
                        (${chatResult})
                      `;

    `SELECT chat.c_id, chat.mem1, chat.mem2, 
                      u1.userAlias AS mem1Alias, 
                      u2.userAlias AS mem2Alias, 
                      c1.date AS mem1date, 
                      c2.date AS mem2date, 
                      c1.dialog AS mem1dialog, 
                      c2.dialog AS mem2dialog 
                      FROM 
                        (SELECT c_id, 
                          SUBSTRING_INDEX(members,',',1) AS mem1, 
                          SUBSTRING_INDEX(members,',',-1) AS mem2 
                          FROM chat) chat
                          JOIN user u1 
                          ON mem1 = u1.u_id 
                          JOIN user u2 
                          ON mem2 = u2.u_id 
                          JOIN chat_log c1 
                          ON mem1 = c1.u_id 
                          JOIN chat_log c2 
                          ON mem2 = c2.u_id 
                          WHERE chat.c_id IN (1,2,3)
                          GROUP BY chat
                          `;
    const [chatLog] = conn.query(sql);
  } catch (err) {
    console.log(err.message);
  } finally {
    conn.release();
  }
};
