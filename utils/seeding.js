const fs = require("fs");

exports.seedingCars = async (sequelize) => {
  const seedQuery = fs.readFileSync(`seeds/cars.sql`, { encoding: "utf8" });
  sequelize
    .query(seedQuery)
    .then((data) => {
      console.log("Seeding tabel cars berhasil");
    })
    .catch((err) => {
      console.log(err);
      console.log("Seeding tabel cars gagal");
    });
};

exports.seedingLogin = async (sequelize) => {
  const seedQuery = fs.readFileSync(`seeds/login.sql`, { encoding: "utf8" });
  sequelize
    .query(seedQuery)
    .then((data) => {
      console.log("Seeding tabel login berhasil");
    })
    .catch((err) => {
      console.log("Seeding tabel login gagal");
    });
};
