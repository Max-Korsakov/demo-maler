const errorHandler = require("../utils/error-handler");

const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require("../services/aws-upload");
const BUCKET_NAME = 'epam-demomaker';
const PHOTO_FOLDER = 'photo/';
const VIDEO_FOLDER = 'video/';

function createMulterConfig(adress){
    return multer({
        storage: multerS3({
          s3: s3,
          bucket: adress,
          acl: 'public-read',
          metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
          },
          key: function (req, file, cb) {
            cb(null, file.originalname)
          }
        })
      })
}


module.exports.uploadNewCase = async function(req, res) {
  let bucketAdress 
  if(req.query.isVideo === 'true'){
    bucketAdress = `${BUCKET_NAME}/${VIDEO_FOLDER}${req.query.project}/${req.query.caseName}` 
    const upload = createMulterConfig(bucketAdress);
    upload.fields([{ name: 'jsonData', maxCount: 1 }, {name:"uploads"}, , {name:"preview"}])(req, res, function(err) {
    if (err) {
      return res
        .status(422)
        .send({
          errors: [{ title: "Image Upload Error", detail: err.message }]
        });
    }
    return res.json({ imageUrl: req.files});
  });
  } else {
    bucketAdress = `${BUCKET_NAME}/${PHOTO_FOLDER}${req.query.project}/${req.query.caseName}` 
    const upload = createMulterConfig(bucketAdress);
    upload.fields([{ name: 'jsonData', maxCount: 1 }, {name:"uploads"}])(req, res, function(err) {
    if (err) {
      return res
        .status(422)
        .send({
          errors: [{ title: "Image Upload Error", detail: err.message }]
        });
    }
    return res.json({ imageUrl: req.files});
  });
  }

};


