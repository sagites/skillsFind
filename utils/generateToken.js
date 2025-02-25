const crypto = require("crypto");

const generateToken = () => {
    return crypto.randomInt(100000, 999999).toString();
};

module.exports = generateToken;