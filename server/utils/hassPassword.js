require("dotenv").config();
const bcrypt = require("bcryptjs"); // swapped from bcrypt

// Hash password
const hashPassword = async (password) => {
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
};

// Compare password
const checkPassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    console.error("Error comparing password:", err);
    throw err;
  }
};

module.exports = { hashPassword, checkPassword };
