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

module.exports = {
  checkExistingUser,
  addUser,
  setAdminStatusTrue,
  setMemberStatusTrue,
};
