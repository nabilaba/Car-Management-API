const router = require("express").Router();
const {
  getCars,
  getDetailCar,
  createCar,
  updateCar,
  deleteCar,
  deleteCarPermanent,
  deleteAllCars,
} = require("../controllers/cars.controller");
const { uploadThumbnail } = require("../controllers/upload.controller");
const middlewares = require("../middlewares");

// Bisa diakses oleh semua orang
router.get("/", middlewares.verifyToken, getCars);
router.get("/:id", middlewares.verifyToken, getDetailCar);

// Hanya bisa diakses oleh admin dan superadmin
router.post("/", middlewares.verifyToken, middlewares.verifyAdmin, createCar);
router.put("/:id", middlewares.verifyToken, middlewares.verifyAdmin, updateCar);
router.delete("/permanent/:id", middlewares.verifyToken, middlewares.verifySuperAdmin, deleteCarPermanent);
router.delete("/:id", middlewares.verifyToken, middlewares.verifyAdmin, deleteCar);
router.delete("/", middlewares.verifyToken, middlewares.verifyAdmin, deleteAllCars);

router.post("/upload", middlewares.verifyToken, middlewares.verifyAdmin, uploadThumbnail);

module.exports = router;
