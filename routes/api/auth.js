const express = require("express");
const router = express.Router();

// @route GET api/auths
// desc   Test route
// access public

router.get("/", (req, res) => {
  res.send("auths route");
});

module.exports = router;
