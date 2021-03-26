const errorHandler = require("../utils/error-handler");
const s3 = require("../services/aws-upload");
const cfsign = require("aws-cloudfront-sign");
const BUCKET_NAME = "epam-demomaker";
const PHOTO_FOLDER = "photo/";
const axios = require('axios');
const validator = require('validator');

const cloudFront = require('../services/cloud-front')

const getRequets = url => {
  return axios
     .get(url)
     .then(response => {
       return response.data;
     })
     .catch(error => {
      return error;
       //console.log(error);
     });
 };

const listDirectories = derectoryName => {
  return new Promise((resolve, reject) => {
    const s3params = {
      Bucket: BUCKET_NAME,
      Delimiter: "/",
      Prefix: derectoryName
    };
    s3.listObjectsV2(s3params, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

module.exports.getProjects = async function(req, res) {
  let folders = await listDirectories(PHOTO_FOLDER);
  let data = folders.CommonPrefixes.map(object => {
    let str = object.Prefix;
    let strArray = str.split("/");
    return strArray[1];
  });
  try {
    res.status(200).send(data);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getCases = async function(req, res) {
  let folders = await listDirectories(`${PHOTO_FOLDER}${req.params.id}/`);
  let data = folders.CommonPrefixes.map(object => {
    let str = object.Prefix;
    str = str.substring(0, str.length - 1);
    return str;
  });
  try {
    res.status(200).send(data);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getPoster = async function(req, res) {
  let folders = await listDirectories(
    `${PHOTO_FOLDER}${req.query.project}/${req.query.caseName}/`
  );
  let data = folders.Contents.filter(object => {
    let str = object.Key;
    let sliceArray = str.split(".");
    if (sliceArray[sliceArray.length - 1] !== "json") {
      return sliceArray[sliceArray.length - 1];
    }
  });
  const nameStringArray = data[0].Key.split("/");
  let signedUrl = cfsign.getSignedUrl(
    `${cloudFront.CLOUD_FRONT_ADRESS}/photo/${req.query.project}/${req.query.caseName}/${
      nameStringArray[nameStringArray.length - 1]
    }`,
    cloudFront.signingParams
  );
  try {
    res.status(200).send(JSON.stringify(signedUrl));
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getPhoto = async function(req, res) {
  let signedUrl = cfsign.getSignedUrl(
    `${cloudFront.CLOUD_FRONT_ADRESS}/photo/${req.query.project}/${req.query.caseName}/${req.query.photoName}`,
    cloudFront.signingParams
  );
  try {
    res.status(200).send(JSON.stringify(signedUrl));
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.deleteCase = async function(req, res) {
  let folders = await listDirectories(
    `${PHOTO_FOLDER}${req.query.project}/${req.query.caseName}/`
  );
  try {
    folders.Contents.forEach(item => {
      var getParams = {
        Bucket: BUCKET_NAME,
        Key: `${item.Key}`
      };
      s3.deleteObject(getParams, function(err, data) {
        if (err) {
          errorHandler(res, err);
        }
      });
    });
    res.status(200).send(JSON.stringify("File was deleted"));
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getData = async function(req, res) {
  try {
  let folders = await listDirectories(
    `${PHOTO_FOLDER}${req.query.project}/${req.query.caseName}/`
  );
  let data = folders.Contents.filter(object => {
    let str = object.Key;
    let sliceArray = str.split(".");
    if (sliceArray[sliceArray.length - 1] === "json") {
      return sliceArray[sliceArray.length - 1];
    }
  });

  const nameStringArray = data[0].Key.split("/");
  let signedUrl = cfsign.getSignedUrl(
    `${cloudFront.CLOUD_FRONT_ADRESS}/photo/${req.query.project}/${req.query.caseName}/${
      nameStringArray[nameStringArray.length - 1]
    }`,
    cloudFront.signingParams
  );
  let json = await getRequets(signedUrl);
  if(json instanceof Error) {
    errorHandler(res, json);
  }
  if(validator.isJSON(JSON.stringify(json))){
    res.status(200).send(json);
  } else {
    errorHandler(res, new Error('JSON is not valid'));
  } 
} catch (e) {
  errorHandler(res, e);
}
};
