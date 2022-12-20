const login = require("../models").login;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Lengkapi semua kolom terlebih dahulu!" });
  } else {
    login
      .findOne({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (user) {
          bcryptjs.compare(password, user.password, (err, result) => {
            if (result) {
              const token = jwt.sign(
                {
                  id: user.id,
                  email: user.email,
                  role: user.role,
                },
                "NABIL",
                {
                  expiresIn: "1h",
                }
              );
              res.status(200).json({
                message: "Login berhasil!",
                token: token,
              });
            } else {
              res.status(401).json({ message: "Password salah!" });
            }
          });
        } else {
          res.status(404).json({ message: "Email tidak ditemukan!" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "Terjadi kesalahan pada server!" });
      });
  }
};

exports.loginGoogle = (req, res) => {
  const { tokenId } = req.body;
  const clientId =
    "733104915800-ii8moe3lrcoocsvpa89jhkqj6m970dc7.apps.googleusercontent.com";
  const client = new OAuth2Client(clientId);

  client
    .verifyIdToken({
      idToken: tokenId,
      audience: clientId,
    })
    .then((response) => {
      const { name, email } = response.payload;

      login
        .findOne({
          where: {
            email: email,
          },
        })
        .then((user) => {
          if (user) {
            const token = jwt.sign(
              {
                id: user.id,
                email: user.email,
                role: user.role,
              },
              "NABIL",
              {
                expiresIn: "1h",
              }
            );
            res.status(200).json({
              message: "Login berhasil!",
              token: token,
            });
          } else {
            const password = "12345678";
            bcryptjs.hash(password, 10, (err, hash) => {
              if (err) {
                res
                  .status(500)
                  .json({ message: "Terjadi kesalahan pada server!" });
              } else {
                login
                  .create({
                    email,
                    password: hash,
                    name,
                    role: "member",
                  })
                  .then((user) => {
                    const token = jwt.sign(
                      {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                      },
                      "NABIL",
                      {
                        expiresIn: "1h",
                      }
                    );
                    res.status(201).json({
                      message: "Akun berhasil dibuat!",
                      token: token,
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    res
                      .status(500)
                      .json({ message: "Terjadi kesalahan pada server!" });
                  });
              }
            });
          }
        })
        .catch((err) => {
          res.status(500).json({ message: "Terjadi kesalahan pada server!" });
        });
    });
};

exports.register = (req, res) => {
  const { email, password, name } = req.body;

  if ((!email || !password, !name)) {
    return res
      .status(400)
      .json({ message: "Lengkapi semua kolom terlebih dahulu!" });
  } else {
    login
      .findOne({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (user) {
          res.status(409).json({ message: "Email sudah terdaftar!" });
        } else {
          if (password.length < 8) {
            return res
              .status(400)
              .json({ message: "Password minimal 8 karakter!" });
          } else {
            bcryptjs.hash(password, 10, (err, hash) => {
              if (err) {
                res
                  .status(500)
                  .json({ message: "Terjadi kesalahan pada server!" });
              } else {
                login
                  .create({
                    email,
                    password: hash,
                    name,
                    role: "member",
                  })
                  .then((user) => {
                    res.status(201).json({ message: "Berhasil membuat akun" });
                  })
                  .catch((err) => {
                    res
                      .status(500)
                      .json({ message: "Terjadi kesalahan pada server!" });
                  });
              }
            });
          }
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "Terjadi kesalahan pada server!" });
      });
  }
};

exports.registerAdmin = (req, res) => {
  const { email, password, role, name } = req.body;

  if (!email || !password || !role || !name) {
    return res
      .status(400)
      .json({ message: "Lengkapi semua kolom terlebih dahulu!" });
  } else {
    login
      .findOne({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (user) {
          res.status(409).json({ message: "Email sudah terdaftar!" });
        } else {
          if (password.length < 8) {
            return res
              .status(400)
              .json({ message: "Password minimal 8 karakter!" });
          } else {
            bcryptjs.hash(password, 10, (err, hash) => {
              if (err) {
                res
                  .status(500)
                  .json({ message: "Terjadi kesalahan pada server!" });
              } else {
                login
                  .create({
                    email,
                    password: hash,
                    role,
                    name,
                  })
                  .then((user) => {
                    res.status(201).json({ message: "Berhasil membuat akun" });
                  })
                  .catch((err) => {
                    res
                      .status(500)
                      .json({ message: "Terjadi kesalahan pada server!" });
                  });
              }
            });
          }
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "Terjadi kesalahan pada server!" });
      });
  }
};

exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { email, password, name } = req.body;
  const user = await login.findByPk(id);
  const isMatch = await bcryptjs.compare(password, user.password);

  if (isMatch) {
    res.status(400).json({ message: "Password tidak boleh sama!" });
  } else {
    const hashedPassword = password
      ? await bcryptjs.hash(password, bcryptjs.genSaltSync(10))
      : user.password;
    login.findByPk(id).then((login) => {
      if (!login) {
        res.status(404).json({ message: "User tidak ditemukan!" });
      } else {
        login
          .update({
            email,
            password: hashedPassword,
            name,
          })
          .then((login) => {
            res.status(200).json({ message: "Berhasil mengubah data user!" });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Terjadi kesalahan pada server!" });
          });
      }
    });
  }
};

exports.getCurrentUser = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "NABIL");
  const id = decoded.id;

  login
    .findByPk(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User tidak ditemukan!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Terjadi kesalahan pada server!" });
    });
};

exports.getAllUsers = (req, res) => {
  login
    .findAll()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).json({ message: "Terjadi kesalahan pada server!" });
    });
};

exports.getUserById = (req, res) => {
  const id = req.params.id;

  login
    .findByPk(id)
    .then((user) => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User tidak ditemukan!" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Terjadi kesalahan pada server!" });
    });
};

exports.deleteMe = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "NABIL");
  const id = decoded.id;

  login.findByPk(id).then((user) => {
    if (user) {
      login
        .destroy({
          where: {
            id: id,
          },
        })
        .then((user) => {
          res.status(200).json({ message: "Akun anda berhasil dihapus!" });
        })
        .catch((err) => {
          res.status(500).json({ message: "Terjadi kesalahan pada server!" });
        });
    } else {
      res.status(404).json({ message: "User tidak ditemukan!" });
    }
  });
};

exports.deleteUser = (req, res) => {
  const id = req.params.id;

  login.findByPk(id).then((user) => {
    if (user) {
      login
        .destroy({
          where: {
            id: id,
          },
        })
        .then((user) => {
          res.status(200).json({ message: "User berhasil dihapus!" });
        })
        .catch((err) => {
          res.status(500).json({ message: "Terjadi kesalahan pada server!" });
        });
    } else {
      res.status(404).json({ message: "User tidak ditemukan!" });
    }
  });
};
