const express = require('express');
const path = require('path');
const app = express();
const PORT = 4006;

app.use(express.static(path.join(__dirname + '/client')));



app.listen(PORT, () => {
  console.log(`Server has been started on http://localhost:${PORT}/`);
});