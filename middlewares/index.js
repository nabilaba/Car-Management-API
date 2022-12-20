const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "NABIL", (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Sesi login anda tidak valid, silahkan login ulang!" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Anda harus login terlebih dahulu!" });
  }
};

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "NABIL");
  const role = decoded.role;
  
  if (role === "admin" || role === "superadmin") {
    next();
  } else {
    res.status(401).json({ message: "Anda tidak memiliki akses!" });
  }
};

const verifySuperAdmin = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "NABIL");
  const role = decoded.role;
  
  if (role === "superadmin") {
    next();
  } else {
    res.status(401).json({ message: "Anda tidak memiliki akses!" });
  }
};

module.exports = { verifyToken, verifyAdmin, verifySuperAdmin };
