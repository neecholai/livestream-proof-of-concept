const express = require("express");
const router = express.Router();
const {
  createRoom,
  getRoom,
  createMeetingToken,
  deleteRoom
} = require('../utils/daily-api');

router.get("/:name", async function (req, res, next) {
  try {
    const room = await getRoom(req.params.name);
    return res.status(200).json(room.data);
  } catch (err) {
    return next(err);
  }
})

router.post("/", async function (req, res, next) {
  try {
    const room = await createRoom("test", null);
    return res.status(201).json(room.data)
  } catch (err) {
    return next(err);
  }
});

// Create Token for room
router.post("/:name/token", async function (req, res, next) {
  try {
    const token = await createMeetingToken("test", req.body.isOwner);
    return res.status(201).json(token);
  } catch (err) {
    return next(err);
  }
});

router.delete("/:name", async function (req, res, next) {
  try {
    const msg = await deleteRoom('test');
    return res.json(msg);
  } catch (err) {
    return next(err);
  }
});


module.exports = router;