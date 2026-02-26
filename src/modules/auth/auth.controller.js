const { loginUser } = require("./auth.usecase");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const result = await loginUser(email, password);

    if (result.error) {
      return res.status(401).json({ message: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

module.exports = { login };
