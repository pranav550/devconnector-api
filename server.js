const express = require("express");

const connectDb = require("./config/db");

// connection

connectDb();

const app = express();

//init middleware
app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/api/user"));
app.use("/api/posts", require("./routes/api/post"));
app.use("/api/auths", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));

app.get("/", (req, res) => {
  res.send("test");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
