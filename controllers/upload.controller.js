const imageUpload = require("../utils/uploadHelper");

exports.uploadThumbnail = (req, res) => {
  imageUpload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    } else {
      if (!req.file) {
        res
          .status(400)
          .json({ message: "Tidak ada file yang dipilih" });
      } else {
        res.status(200).json(req.file);
      }
    }
  });
};
