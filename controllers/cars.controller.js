const cars = require("../models").cars;
const login = require("../models").login;
const jwt = require("jsonwebtoken");

exports.getCars = (req, res) => {
  cars
    .findAll({
      include: [
        {
          model: login,
          as: "created",
        },
        {
          model: login,
          as: "updated",
        },
        {
          model: login,
          as: "deleted",
        }
      ],
      attributes: { exclude: ["createdBy", "updatedBy", "deletedBy"] },
    })
    .then((cars) => {
      res.status(200).json(cars);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Terjadi kesalahan pada server!" });
    });
};

exports.getDetailCar = (req, res) => {
  const id = req.params.id;

  cars
    .findByPk(id, {
      include: [
        {
          model: login,
          as: "created",
        },
        {
          model: login,
          as: "updated",
        },
        {
          model: login,
          as: "deleted",
        }
      ],
      attributes: { exclude: ["createdBy", "updatedBy", "deletedBy"] },
    })
    .then((car) => {
      if (car) {
        res.status(200).json(car);
      } else {
        res.status(404).json({ message: "Data tidak ditemukan!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Terjadi kesalahan pada server!" });
    });
};

exports.createCar = (req, res) => {
  const { name, rent_price, size, image_url } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "NABIL");
  const createdBy = decoded.id;
  const updatedBy = decoded.id;

  if (!name || !rent_price || !size || !image_url) {
    return res
      .status(400)
      .json({ message: "Lengkapi semua kolom terlebih dahulu!" });
  } else {
    if (
      typeof name !== "string" ||
      typeof rent_price !== "number" ||
      typeof size !== "string" ||
      typeof image_url !== "string"
    ) {
      console.log(typeof name);
      console.log(typeof rent_price);
      console.log(typeof size);
      console.log(typeof image_url);
      return res.status(400).json({ message: "Kolom tidak valid!" });
    } else {
      cars
        .create({
          name,
          rent_price,
          size,
          image_url,
          createdBy,
          updatedBy,
        })
        .then((car) => {
          res.status(201).json({ message: "Data berhasil ditambahkan!" });
        })
        .catch((err) => {
          res.status(500).json({ message: "Terjadi kesalahan pada server!" });
        });
    }
  }
};

exports.updateCar = (req, res) => {
  const id = req.params.id;
  const { name, rent_price, size, image_url, deletedAt, deletedBy } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "NABIL");
  const updatedBy = decoded.id;

  cars.findByPk(id).then((car) => {
    if (!car) {
      res.status(404).json({ message: "Data tidak ditemukan!" });
    } else {
      car
        .update({ name, rent_price, size, image_url, updatedBy, deletedAt, deletedBy })
        .then((car) => {
          res.status(200).json({ message: "Data berhasil diubah!" });
        })
        .catch((err) => {
          res.status(500).json({ message: "Terjadi kesalahan pada server!" });
        });
    }
  });
};

exports.deleteCar = (req, res) => {
  const id = req.params.id;
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "NABIL");
  const deletedBy = decoded.id;
  const deletedAt = new Date();

  cars.findByPk(id).then((car) => {
    if (!car) {
      res.status(404).json({ message: "Data tidak ditemukan!" });
    } else {
      car
        .update({ deletedBy, deletedAt })
        .then((car) => {
          res.status(200).json({ message: "Data berhasil dihapus!" });
        })
        .catch((err) => {
          res.status(500).json({ message: "Terjadi kesalahan pada server!" });
        });
    }
  });
};

exports.deleteCarPermanent = (req, res) => {
  const id = req.params.id;

  cars.findByPk(id).then((car) => {
    if (!car) {
      res.status(404).json({ message: "Data tidak ditemukan!" });
    } else {
      car
        .destroy()
        .then((car) => {
          res.status(200).json({ message: "Data berhasil dihapus secara permanen!" });
        })
        .catch((err) => {
          res.status(500).json({ message: "Terjadi kesalahan pada server!" });
        });
    }
  });
};

exports.deleteAllCars = (req, res) => {
  cars
    .destroy({ where: {} })
    .then(() => {
      res.status(200).json({ message: "Semua data berhasil dihapus!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Terjadi kesalahan pada server!" });
    });
};
