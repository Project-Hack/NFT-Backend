const AWS = require('aws-sdk');
const fs = require('fs')

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

async function uploadtos3(file) {
  const params = {  
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `f${Date.now()}-${file.originalname}`,
    Body: fs.createReadStream(file.path),
  };
  const data = await s3.upload(params).promise();
  fs.unlink(file.path, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    }
  });
  return data.Location; // returns the url location
}

module.exports = uploadtos3;

