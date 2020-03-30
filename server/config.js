/** Shared config for application; can be req'd many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "test";
const BCRYPT_WORK_FACTOR = process.env.BCRYPT_WORK_FACTOR || 10;

const PORT = +process.env.PORT || 3000;

// database is:
//
// - on Heroku, get from env var DATABASE_URL
// - in testing, 'livestack-test'
// - else: 'livestack'

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "livestack-test";
} else {
  DB_URI = process.env.DATABASE_URL || "livestack";
}

module.exports = {
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
  PORT,
  DB_URI
};
