const db = require("../db");
const partialUpdate = require("../utils/partialUpdate");

class Creator {
  static async getEventsForCreator(creator_email) {
    const results = await db.query(
      `SELECT * FROM events WHERE creator_email = $1`,
      [creator_email]
    );

    return results.rows;
  }

  static async register({
    user_email,
    twitter_handle,
    instagram_handle,
    profile_image_url,
    subscription_enabled,
    subscription_price
  }) {
    const foundCreator = await Creator.findBy("user_email", user_email);
    if (foundCreator !== undefined) {
      throw { status: 400, message: "Email already taken" };
    }
    const result = await db.query(
      `INSERT INTO creators (
             user_email, 
             twitter_handle, 
             instagram_handle, 
             profile_image_url, 
             subscription_enabled, 
             subscription_price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING user_email, twitter_handle, instagram_handle, profile_image_url, subscription_enabled, subscription_price`,
      [
        user_email,
        twitter_handle,
        instagram_handle,
        profile_image_url,
        subscription_enabled,
        subscription_price
      ]
    );
    return result.rows[0];
  }

  static async findBy(field, value) {
    const result = await db.query(`SELECT * FROM creators WHERE ${field}=$1`, [
      value
    ]);
    return result.rows[0];
  }

  static async update(user_email, data) {
    const { query, values } = await partialUpdate(
      "creators",
      data,
      "user_email",
      user_email
    );

    const res = await db.query(query, values);

    return res.rows[0];
  }
}

module.exports = Creator;
