const db = require("./db");
const bcrypt = require("bcrypt");
const fs = require("fs");

async function readDDL() {
  const DDL = fs.readFileSync("data.sql", "utf-8");
  await db.query(DDL);
}

async function seedData() {
  try {
    await readDDL();
    const hashedPassword = await bcrypt.hash("secret", 1);
    await db.query(
      `INSERT INTO users (email, password, first_name, last_name, phone)
                  VALUES 
                   ('lester@test.com', $1, 'lester', 'testowitz', '123323211'),
                   ('esther@test.com', $1, 'lester', 'testowitz', '123323211'),
                   ('bester@test.com', $1, 'bester', 'testowitz', '123323211'),
                   ('another@test.com', $1,'another', 'testowitz',  '123323211'),
                   ('another2@test.com', $1,'another2', 'testowitz',  '123323211'),
                   ('another3@test.com', $1, 'another3', 'testowitz', '123323211')
                  `,
      [hashedPassword]
    );
    await db.query(`
  INSERT INTO creators(user_email) VALUES
    ('lester@test.com'),
    ('bester@test.com'),
    ('another2@test.com')
  `);
    await db.query(`
  INSERT INTO events (name, start_date, start_time, creator_email) 
    VALUES
    ('first event', 'March 2, 2020', '20:00', 'lester@test.com'),
    ('second event', 'March 2, 2020', '11:00', 'bester@test.com'),
    ('third event', 'March 3, 2020', '8:00', 'another2@test.com'),
    ('fourth event', 'March 3, 2020', '2:00', 'bester@test.com')
  `);
  } catch (err) {
    console.log("Something went wrong!");
    console.log(err);
    process.exit(1);
  }
}

seedData().then(() => {
  console.log("Successful seed!");
  process.exit();
});
