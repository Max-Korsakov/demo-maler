const errorHandler = require("../utils/error-handler");
const s3 = require("../services/aws-upload");
const BUCKET_NAME = "epam-demomaker";
const VIDEO_FOLDER = "video/";
const cfsign = require("aws-cloudfront-sign");
const axios = require("axios");
const cloudFront = require('../services/cloud-front')
const validator = require('validator');

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

const getRequets = url => {
 return axios
    .get(url)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      return error;
    });
};

module.exports.getProjects = async function(req, res) {
  try {
    let folders = await listDirectories(VIDEO_FOLDER);
    let data = folders.CommonPrefixes.map(object => {
      let str = object.Prefix;
      let strArray = str.split("/");
      return strArray[1];
    });
    res.status(200).send(data);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.getCases = async function(req, res) {
  try {
    let folders = await listDirectories(`${VIDEO_FOLDER}${req.params.id}/`);
    let data = folders.CommonPrefixes.map(object => {
      let str = object.Prefix;
      str = str.substring(0, str.length - 1);
      return str;
    });
    res.status(200).send(data);
  } catch (e) {
    errorHandler(res, e);
  }
};

module.exports.deleteCase = async function(req, res) {
  try {
    let folders = await listDirectories(
      `${VIDEO_FOLDER}${req.query.project}/${req.query.caseName}/`
    );
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
      `${VIDEO_FOLDER}${req.query.project}/${req.query.caseName}/`
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
      `${cloudFront.CLOUD_FRONT_ADRESS}/video/${req.query.project}/${req.query.caseName}/${
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

module.exports.setPoster = async function(req, res) {
  try {
    let folders = await listDirectories(
      `${VIDEO_FOLDER}${req.query.project}/${req.query.caseName}/`
    );
    let data = folders.Contents.filter(object => {
      let str = object.Key;
      let sliceArray = str.split(".");
      if (sliceArray[sliceArray.length - 1] === "png") {
        return sliceArray[sliceArray.length - 1];
      }
    });
    const nameStringArray = data[0].Key.split("/");
    let signedUrl = cfsign.getSignedUrl(
      `${cloudFront.CLOUD_FRONT_ADRESS}/video/${req.query.project}/${req.query.caseName}/${
        nameStringArray[nameStringArray.length - 1]
      }`,
      cloudFront.signingParams
    );
    res.status(200).send(JSON.stringify(signedUrl));
  } catch (e) {
    errorHandler(res, e);
  }
};


module.exports.getVideo = async function(req, res) {
  try {
    let folder = await listDirectories(
      `${VIDEO_FOLDER}${req.query.project}/${req.query.caseName}/`
    );
    let data = folder.Contents.filter(object => {
      let str = object.Key;
      let sliceArray = str.split(".");
      if (sliceArray[sliceArray.length - 1] === "mp4") {
        return sliceArray[sliceArray.length - 1];
      }
    });
    const nameStringArray = data[0].Key.split("/");

    let signedUrl = cfsign.getSignedUrl(
      `${cloudFront.CLOUD_FRONT_ADRESS}/video/${req.query.project}/${req.query.caseName}/${
        nameStringArray[nameStringArray.length - 1]
      }`,
      cloudFront.signingParams
    );
    res.status(200).send(JSON.stringify(signedUrl));
  } catch (e) {
    errorHandler(res, e);
  }
};



//method to get video with ranges from s3

    // const fileSize = await sizeOf(
    //   req.query.project,
    //   req.query.caseName,
    //   nameStringArray[nameStringArray.length - 1]
    // );
    // const range = req.headers.range;
    // if (range) {
    //   const parts = range.replace(/bytes=/, "").split("-");
    //   const start = parseInt(parts[0], 10);
    //   const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    //   if (start >= fileSize) {
    //     res
    //       .status(416)
    //       .send(
    //         "Requested range not satisfiable\n" + start + " >= " + fileSize
    //       );
    //     return;
    //   }
    //   const chunk_size = end - start + 1;
    //   const params = {
    //     Bucket: BUCKET_NAME,
    //     Key: `${VIDEO_FOLDER}${req.query.project}/${req.query.caseName}/${
    //       nameStringArray[nameStringArray.length - 1]
    //     }`,
    //     Range: `bytes=${start}-${end}`
    //   };
    //   const file = s3
    //     .getObject(params)
    //     .on("error", error => {
    //       console.log(error);
    //     })
    //     .createReadStream();

    //   const head = {
    //     "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    //     "Accept-Ranges": "bytes",
    //     "Content-Length": chunk_size,
    //     "Content-Type": "video/mp4",
    //     "Cache-Control": "immutable, no-transform"
    //   };
    //   res.writeHead(206, head);
    //   file.pipe(res);
    // } else {
    //   const params = {
    //     Bucket: BUCKET_NAME,
    //     Key: `${VIDEO_FOLDER}${req.query.project}/${req.query.caseName}/${
    //       nameStringArray[nameStringArray.length - 1]
    //     }`
    //   };

    //   let file = s3
    //     .getObject(params)
    //     .createReadStream()
    //     .on("error", error => {
    //       console.log(error);
    //     });
    //   const head = {
    //     "Content-Length": fileSize,
    //     "Content-Type": "video/mp4",
    //     "Cache-Control": "immutable, no-transform"
    //   };
    //   res.writeHead(206, head);
    //   file.pipe(res);
    // }
