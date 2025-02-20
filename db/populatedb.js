require("dotenv").config();
const { Client } = require("pg");

const dbUrl =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(50) NOT NULL,
      last_name VARCHAR(50) NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      membership_status BOOLEAN DEFAULT FALSE
  );

  CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,  -- Links to the users table
      title VARCHAR(255) NOT NULL,
      text TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

async function main() {
  console.log("Creating database...");
  const client = new Client({ connectionString: dbUrl });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("✅ Database tables created successfully.");
  } catch (error) {
    console.error("❌ Error creating database:", error);
  } finally {
    await client.end();
  }
}

main();
