const crypto = require('crypto');
const dayjs = require('dayjs');

const generateRandomToken = (length = 48) => crypto.randomBytes(length).toString('hex');

const formatDate = (date = new Date(), format = 'YYYY-MM-DD HH:mm:ss') =>
  dayjs(date).format(format);

module.exports = { generateRandomToken, formatDate };
