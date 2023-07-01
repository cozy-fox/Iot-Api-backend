const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const path=require("path");
const deviceController = require("./app/controllers/device.controller");

const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);


const db = require("./app/models");

db.mongoose
  .connect(`${dbConfig.HOST}/${dbConfig.DB}`, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

app.use(express.static(path.join(__dirname, 'build')))


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

setTimeout(deviceController.getDeviceFromAggio, 0);

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/device.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
