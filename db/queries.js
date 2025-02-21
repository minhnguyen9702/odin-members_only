const db = require("./pool");

const checkExistingUser = async (username) => {
  const query = "SELECT 1 FROM users WHERE username = $1 LIMIT 1";
  const result = await db.query(query, [username]);
  return result.rowCount > 0;
};

const addUser = async (first_name, last_name, username, password) => {
  try {
    const query = `
        INSERT INTO users (first_name, last_name, username, password) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id
      `;

    const result = await db.query(query, [
      first_name,
      last_name,
      username,
      password,
    ]);

    return result.rowCount > 0;
  } catch (error) {
    console.error("Error adding user:", error);
    return false;
  }
};

const setAdminStatusTrue = async (userId) => {
  const query =
    "UPDATE users SET membership_status = TRUE, admin_status = TRUE WHERE id = $1 RETURNING *";
  const rows = await db.query(query, [userId]);
  return rows[0];
};

const setMemberStatusTrue = async (userId) => {
  const query =
    "UPDATE users SET membership_status = TRUE WHERE id = $1 RETURNING *";
  const rows = await db.query(query, [userId]);
  return rows[0];
};

const createMessage = async (userId, title, text) => {
  const query = `
    INSERT INTO messages (user_id, title, text) 
    VALUES ($1, $2, $3)
  `;
  await db.query(query, [userId, title, text]);
};

const getAllMessages = async () => {
  const query = `SELECT messages.id, messages.title, messages.text, messages.created_at, users.username 
                 FROM messages 
                 JOIN users ON messages.user_id = users.id 
                 ORDER BY messages.created_at DESC`;
  const result = await db.query(query);
  return result.rows;
};

module.exports = {
  checkExistingUser,
  addUser,
  setAdminStatusTrue,
  setMemberStatusTrue,
  createMessage,
  getAllMessages,
};
