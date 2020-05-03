const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
// @route POST api/users
// desc   Register User
// access public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Valid Email Is required").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more character "
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      // if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: "User Already Exists" });
      }
      // get users grvatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        password,
        avatar,
      });
      // encrypt passord
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // return jwt token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ user, token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).json("server error");
    }
  }
);

module.exports = router;
