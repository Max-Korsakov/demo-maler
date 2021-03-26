const errorHandler = require("../utils/error-handler");
const fs = require("fs");

  module.exports.getData = async function(req, res) {
    const searchData = req.params.id
    try {
     res.status(200).sendFile(`/assets/data/${searchData}.json`, { root: '.' } )
    } catch (e) {
      errorHandler(res, e);
    }
  };

  module.exports.getStandardData = async function(req, res) {
    try {
     res.status(200).sendFile(`/assets/data/standardData.json`, { root: '.' } )
    } catch (e) {
      errorHandler(res, e);
    }
  };

  module.exports.getCorrectionData = async function(req, res) {
    try {
     res.status(200).sendFile(`/assets/data/correctionData.json`, { root: '.' } )
    } catch (e) {
      errorHandler(res, e);
    }
  };

  
  module.exports.saveStandardData = async function(req, res) {
    const data = JSON.stringify(req.body.data);
    const correction = JSON.stringify(req.body.correction);
    try {
      fs.writeFile(`assets/data/correctionData.json`, correction, function (err) {
        if (err) throw err;
      }); 
      fs.writeFile(`assets/data/standardData.json`, data, function (err) {
        if (err) throw err;
        res.status(200).sendFile(`/assets/data/correctionData.json`, { root: '.' } )
      }); 
    } catch (e) {
      errorHandler(res, e);
    }
  };

