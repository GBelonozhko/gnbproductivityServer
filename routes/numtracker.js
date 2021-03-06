const express = require("express");
const router = express.Router();
const NumTrackers = require("../models/numtrackers");
const User = require("../models/user");

router.get("/getnumtackertitles/:userId", (req, res) => {
  NumTrackers.find({ creator: req.params.userId })
    .distinct("title")
    .then((numtrackTitle) => {
      console.log(numtrackTitle);
      res.status(200).json({
         numtrackTitle,
      });
    });
});

router.get("/numtracker/:id/:title", (req, res) => {
  const title = req.params.title;
  const creatorId = req.params.id;

  NumTrackers.find({ creator: creatorId, title: title }).then((numtracker) => {
    res.status(200).json({
      numtracker:numtracker,
    });
  });
});

router.post("/addnumtracker/", (req, res) => {
  const numtrack = new NumTrackers(req.body.numTracker);
  const userId = req.body.numTracker.creator;

  numtrack
    .save()
    .then(() => {
      return User.findById(userId);
    })
    .then((user) => {
      user.numtrackers.push(numtrack);
      return user.save();
    });

  res.json(numtrack);
});

module.exports = router;