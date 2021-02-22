const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Journal = require("../models/journal");

router.post("/addjournal/", (req, res) => {
  const journalEntry = new Journal(req.body.journalEntry);
  const userId = req.body.journalEntry.creator;

  journalEntry.save().then(() => {
    return User.findById(userId);
  }).then((user)=>{
      user.journal.push(journalEntry);
      return user.save();
  });
  res.json(journalEntry)
});

router.get(`/journal`)

module.exports = router;