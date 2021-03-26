const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const videoRoutes = require('./routes/video-routes')
const dataRoutes = require('./routes/data-routes')
const photoRoutes = require('./routes/photo-routes')
const uploadRoutes = require('./routes/upload-routes')
const bodyParser = require('body-parser')


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 1000000, }))
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static(path.join(__dirname)));
app.use('/upload', uploadRoutes);
app.use('/photo', photoRoutes);
app.use('/video', videoRoutes);
app.use('/data', dataRoutes);


//routes for aws test purpose
app.get('/', function(req, res) {
  res.sendFile('views/health.html', {root: __dirname })
});

app.get('/health', function(req, res) {
  res.sendFile('views/health.html', {root: __dirname })
});

app.listen(8000, function() {
  console.log("Listening on port 8000!");
});


module.exports.app = app;
