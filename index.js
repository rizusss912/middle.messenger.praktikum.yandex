//const serverless = require('serverless-http');
const express = require('express');
const path = require('path');

const app = express();
//const router = express.Router();

const PORT = 3000;

app.use(express.static(path.join(__dirname + '/dist')));

app.listen(PORT, () => {
  console.log(`Server has been started on http://localhost:${PORT}/`);
});

//app.use('/.netlify/functions/server', router)

//module.exports = app;
//module.exports.handler = serverless(app);