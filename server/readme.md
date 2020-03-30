# Livestack Backend

## Getting Started

1. Fork and clone the repository
2. `npm install`
3. `createdb livestack`
4. `createdb livestack-test`
5. `psql livestack < data.sql`
6. `psql livestack-test < data.sql`
7. Create a `.env` file and make sure you have ENV variables
8. Seed the database with `node seed.js`
9. `npm test` to run the tests

### Technologies Used

- Node/Express/PG
- Nodemailer / Mandrill for email
- Stripe for payments
- Twilio for text messaging
- AJV and Validator for validation

## DB Modeling

users -- creators (1:1) creators are just an extension of users

creators --> events (1:M) for now, just one creator per event

users <--> events (M:M) through events_users

## Endpoints

### Users

- __POST /users/register__, register a user

- __POST /users/login__, login a user

- __POST /forgot-password__ - send password reset token as user or creator

- __POST /reset-password__ - reset password using token

- __PATCH /users__ - user auth required, update a user

### Creators

- __GET /creators/events__ - get all events for a creator

- __POST /creators/register__ - register a creator

- __PATCH /creators__ - update a creator

### Events

- __GET "/events"__ - get all events

- __GET "/events/:event_id"__ get a specific event (along with all attendees)

- __POST "/events/"__  - creator auth required, create an event

- __POST "/events/:event_id/signup"__  -user auth required, signup for an event

- __PATCH "/events/:event_id"__ - correct creator auth required, update an event

#### Payments

- __POST "/payments/event"__ - user auth required, signup for an event

- __POST "/payments/subscription"__ - user auth required, signup for a subscription
