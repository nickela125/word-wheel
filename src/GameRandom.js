export default function getRandomNumberGenerator() {
    // Make sure everyone gets the same randoms value every day
    const seedrandom = require('seedrandom');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return seedrandom(today.getTime());
}