const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const env = require('../config');

let storage;

if (env.aws.bucket && env.aws.accessKeyId && env.aws.secretAccessKey) {
  aws.config.update({
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
    region: env.aws.region,
  });

  const s3 = new aws.S3();

  storage = multerS3({
    s3,
    bucket: env.aws.bucket,
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  });
} else {
  storage = multer.memoryStorage();
}

const upload = multer({ storage });

module.exports = upload;
