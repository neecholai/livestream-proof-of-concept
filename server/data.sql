DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS creators CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS events_users CASCADE;

CREATE TABLE users(
    email TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone text NOT NULL,
    password_reset_token TEXT DEFAULT NULL,
    stripe_customer_id TEXT
);

CREATE TABLE creators(
    user_email TEXT PRIMARY KEY REFERENCES users,
    twitter_handle TEXT,
    instagram_handle TEXT,
    profile_image_url TEXT,
    subscription_enabled BOOLEAN default FALSE,
    subscription_price INTEGER 
);

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration TEXT,
    description TEXT,
    price INTEGER,
    post_signup_description TEXT,
    photo_url TEXT,
    creator_email TEXT NOT NULL REFERENCES creators 
);

CREATE TABLE events_users (
    event_id INTEGER  REFERENCES events,
    user_email TEXT  REFERENCES users,
    PRIMARY KEY (event_id, user_email)
);