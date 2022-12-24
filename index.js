const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./models");
const port = process.env.PORT || 8000;
const carsRoute = require("./routes/cars");
const usersRoute = require("./routes/users");
const { seedingCars, seedingLogin } = require("./utils/seeding");
const swaggerUi = require('swagger-ui-express');

db.sequelize.sync().then(() => {
  seedingLogin(db.sequelize);
  seedingCars(db.sequelize);
});

app.use(express.json());
app.use(cors());

// storage
app.use("/uploads", express.static("uploads"));

// backend
app.use("/cars", carsRoute);
app.use("/users", usersRoute);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(require('./utils/swaggerOptions').swaggerSpec));

app.use("/", (req, res) => {
  res.send(`Check out the API documentation at ${req.protocol}://${req.get("host")}/docs`);
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
