const db = require("../db");
const partialUpdate = require("../utils/partialUpdate")
class Event {
  // get all events for the homepage
  static async all() {
    const res = await db.query(
      `
      SELECT e.name, e.id, e.start_date, e.start_time FROM events e 
      ORDER BY e.start_time ASC
      LIMIT 20
      `
    );
    return res.rows;
  }

  // get a specific event
  // if the event has started - show the player (on the frontend)
  // if the user going here has purchased this event or subscription,
  // let them know (event object contains all users who have signed up)
  // if the event has not been paid for
  // show the payment options
  static async get(event_id) {
    const res = await db.query("SELECT * FROM events WHERE id=$1", [event_id]);
    const event = res.rows[0];

    if (event === undefined) {
      throw { status: 404, message: "Event not found" };
    }

    // now get all of the users who signedup
    const user_emails = await db.query(
      "SELECT user_email FROM events_users WHERE event_id=$1",
      [event_id]
    );
    let emails = user_emails.rows.map(row => row.user_email);

    // if the array is empty, pass an array otherwise pass a nested array to ANY
    emails = emails.length === 0 ? [] : [emails];

    const users = await db.query("SELECT * FROM users WHERE email = ANY ($1)", [
      emails
    ]);

    event.signups = users.rows;

    return event;
  }

  // create an event
  static async create({
    name,
    start_date,
    start_time,
    duration,
    description,
    price,
    post_signup_description,
    photo_url,
    creator_email
  }) {
    const result = await db.query(
      `INSERT INTO events (
              name,
              start_date,
              start_time,
              duration,
              description,
              price,
              post_signup_description,
              photo_url,
              creator_email)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *`,
      [
        name,
        start_date,
        start_time,
        duration,
        description,
        price,
        post_signup_description,
        photo_url,
        creator_email
      ]
    );
    return result.rows[0];
  }

  static async signup(user_email, event_id) {
    const result = await db.query(
      `INSERT INTO 
      events_users 
      (user_email, event_id) 
      VALUES ($1, $2)
      RETURNING user_email, event_id
      `,
      [user_email, event_id]
    );

    return result.rows[0];
  }

  static async update(event_id, data) {
    const { query, values } = await partialUpdate(
      "events",
      data,
      "id",
      event_id
    );

    const res = await db.query(query, values);

    return res.rows[0];
  }

  static async findBy(field, value) {
    const result = await db.query(`SELECT * FROM events WHERE ${field}=$1`, [
      value
    ]);
    return result.rows[0];
  }
}

module.exports = Event;
