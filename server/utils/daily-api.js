require("dotenv").config();

const axios = require("axios");
const BASE_URL = "https://api.daily.co/v1";
const AUTH_TOKEN = process.env.DAILY_API_KEY;
const kebabCase = require("lodash.kebabcase");

const instance = axios.create({
  baseURL: BASE_URL
});

instance.defaults.headers.common["Authorization"] = `Bearer ${AUTH_TOKEN}`;
instance.defaults.headers.common["Content-Type"] = "application/json";

// TODO: Implement this based on FE data
// https://docs.daily.co/reference#set-room-configuration
/* 
  accepts an object of roomData 
  {
    nbf - not before
    exp - expiration
    max_participants
  }
*/

// this function should be run to join a room when an event's already created
async function getRoom(name) {
  try {
    const response = await instance.get(`/rooms/${name}`);
    return response;
  } catch (err) {
    return err;
  }
}


// this function should be run when an event is created
async function createRoom(name, data) {
  name = kebabCase(name); // in case of whitespace

  try {
    const response = await instance.post(`/rooms`, {
      name,
      privacy: "private",
      properties: {
        owner_only_broadcast: true
      }
    });
    return response;
  } catch (err) {
    return err;
  }
}

// this function should be run when an event is updated
async function updateRoom(name, data) {
  name = kebabCase(name); // in case of whitespace
  try {
    const response = await instance.post(`/rooms/${name}`, {
      privacy: "private",
      properties: {
        owner_only_broadcast: true
      }
    });
    return response.data;
  } catch (err) {
    return err;
  }
}

// create meeting tokens to allow access to the room (store these in the users_events table)
async function createMeetingToken(name, isOwner = false) {
  try {
    const response = await instance.post(`/meeting-tokens`, {
      properties: {
        room_name: name,
        is_owner: isOwner,
      }
    });
    return response.data.token;
  } catch (err) {
    return err;
  }
}

// deletes a room
async function deleteRoom(name) {
  try {
    const response = await instance.delete(`/rooms/${name}`);
    return response.data;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getRoom,
  createRoom,
  updateRoom,
  createMeetingToken,
  deleteRoom
};