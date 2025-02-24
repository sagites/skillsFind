const generateToken = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0].toString().slice(-6).padStart(6, '0');
}

module.exports = generateToken;