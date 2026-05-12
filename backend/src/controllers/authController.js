const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const prisma = require("../lib/prisma");

async function login(req, res) {
  try {
    const { email, password } =
      req.body;

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    if (!user) {
      return res.status(401).json({
        message:
          "Invalid credentials",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!validPassword) {
      return res.status(401).json({
        message:
          "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        sub: user.id,

        email: user.email,

        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    return res.json({
      token,

      user: {
        id: user.id,

        email: user.email,

        role: user.role,

        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
}

module.exports = {
  login,
};