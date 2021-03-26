const aws = require("aws-sdk");
require("dotenv").config();

const secretAccessKey = process.env.AWS_SECRET_KEY;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;

aws.config.update({
  secretAccessKey: secretAccessKey,
  accessKeyId: accessKeyId,
  region: "us-west-1",
  httpOptions: {
    timeout: 1200000,
    connectTimeout: 5000,
  },
  maxRetries: 2,
});

const s3 = new aws.S3();

module.exports = s3;
