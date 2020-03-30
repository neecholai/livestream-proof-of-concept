const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const partialUpdate = require("../utils/partialUpdate");
const { isEmail, isMobilePhone } = require("validator");

class User {
  static async register({ email, password, first_name, last_name, phone }) {
    // TODO: We'll be repeating this validation logic quite a bit, let's make this a util
    if(isEmail(email) === false){
      throw { status: 400, message: "Invalid email" };
    }

    if (isMobilePhone(phone) === false) {
      throw { status: 400, message: "Invalid phone number" };
    }

    const foundUser = await User.findBy("email", email);
    if (foundUser !== undefined) {
      throw { status: 400, message: "Email already taken" };
    }

    let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `INSERT INTO users (
              email,
              password,
              first_name,
              last_name,
              phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING email, first_name, last_name, phone`,
      [email, hashedPassword, first_name, last_name, phone]
    );
    return result.rows[0];
  }

  /** Authenticate: is this email/password valid? Returns boolean. */

  static async authenticate(email, password) {
    const result = await db.query(
      "SELECT password FROM users WHERE email = $1",
      [email]
    );
    let user = result.rows[0];

    return user && (await bcrypt.compare(password, user.password));
  }

  static async checkIfCreator(email){
      const creator = await db.query(
        "SELECT * FROM creators WHERE user_email = $1",
        [email]
      );

      return creator.rows.length > 0;
  }

  static async findBy(field, value) {
    const result = await db.query(`SELECT * FROM users WHERE ${field}=$1`, [
      value
    ]);
    return result.rows[0];
  }

  static async update(user_email, data) {

    const { query, values } = await partialUpdate(
      "users",
      data,
      "email",
      user_email
    );

    const res = await db.query(query, values);
    delete res.rows[0].password
    return res.rows[0];
  }
}

module.exports = User;
