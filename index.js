const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.all('/*', (req, res) => {
	const urlPath = req.originalUrl.split('?')[0].split('/');
	const file = /(.+)\.(.+)/.test(urlPath[urlPath.length - 1]) ? urlPath[urlPath.length - 1] : 'index.html';

	res.status(200).sendFile(path.join(__dirname + `/dist/${file}`));
});

app.listen(PORT, () => {
	console.log(`Server has been started on http://localhost:${PORT}/`);
});
