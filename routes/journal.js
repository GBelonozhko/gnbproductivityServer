const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Journal = require("../models/journal");
const journal = require("../models/journal");

router.post("/addjournal/", (req, res) => {
  const journalEntry = new Journal(req.body.journalEntry);
  const userId = req.body.journalEntry.creator;

  journalEntry
    .save()
    .then(() => {
      return User.findById(userId);
    })
    .then((user) => {
      user.journal.push(journalEntry);
      return user.save();
    });
  res.json(journalEntry);
});

router.get("/alljournals/:userId", (req, res) => {
  Journal.find({
    creator: req.params.userId,
  }).then((journal) => {
    res.status(200).json({
      journals: journal,
    });
  });
});

router.delete("/deletejournal/:id", (req, res, next) => {
  Journal.findById(req.params.id)
    .then((result) => {
      return User.findById(result.creator);
    })
    .then((user) => {
      user.journal.pull(req.params.id);
      return user.save();
    });

  Journal.findByIdAndRemove(req.params.id).then(function () {
    res.status(200).json("todo deleted");
  });
});

module.exports = router;
